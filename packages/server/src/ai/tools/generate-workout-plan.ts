import { generateText, Output, tool } from "ai";
import { z } from "zod";

import { models } from "@getolv/ai/models";
import { editWorkoutPlanPrompt, generateWorkoutPlanPrompt, generatedWorkoutPlanSchema } from "@getolv/ai/prompts";

import { createWorkoutPlan, getExerciseCatalog } from "../../services/workouts";
import { appContextSchema } from "../types";

type GeneratedWorkoutPlan = z.infer<typeof generatedWorkoutPlanSchema>;

const matchExercisesToCatalog = ({
	plan,
	catalog,
}: {
	plan: GeneratedWorkoutPlan;
	catalog: { id: string; name: string }[];
}) => {
	const catalogMap = new Map(catalog.map((ex) => [ex.name.toLowerCase(), ex.id]));

	return plan.days.map((day) => ({
		...day,
		exercises: day.exercises.map((ex, idx) => ({
			exerciseId: catalogMap.get(ex.exerciseName.toLowerCase()) ?? null,
			exerciseName: ex.exerciseName,
			orderIndex: idx,
			sets: ex.sets,
			reps: ex.reps,
			restSeconds: ex.restSeconds,
			notes: ex.notes,
		})),
	}));
};

export const generateWorkoutPlanCore = async ({ patientContext, goal }: { patientContext: string; goal?: string }) => {
	const catalog = await getExerciseCatalog();

	const catalogForPrompt = catalog.map((ex) => ({
		name: ex.name,
		targetMuscles: ex.targetMuscles,
		bodyParts: ex.bodyParts,
		equipments: ex.equipments,
	}));

	const result = await generateText({
		model: models.fast.model,
		output: Output.object({
			schema: generatedWorkoutPlanSchema,
		}),
		prompt: generateWorkoutPlanPrompt({ patientContext, goal, exerciseCatalog: catalogForPrompt }),
	});

	if (!result.output) return null;

	const daysWithCatalogIds = matchExercisesToCatalog({
		plan: result.output,
		catalog: catalog.map((ex) => ({ id: ex.id, name: ex.name })),
	});

	return { ...result.output, days: daysWithCatalogIds };
};

export const editWorkoutPlanCore = async ({
	patientContext,
	currentPlanJson,
	instructions,
}: {
	patientContext: string;
	currentPlanJson: string;
	instructions: string;
}) => {
	const catalog = await getExerciseCatalog();

	const catalogForPrompt = catalog.map((ex) => ({
		name: ex.name,
		targetMuscles: ex.targetMuscles,
		bodyParts: ex.bodyParts,
		equipments: ex.equipments,
	}));

	const result = await generateText({
		model: models.fast.model,
		output: Output.object({
			schema: generatedWorkoutPlanSchema,
		}),
		prompt: editWorkoutPlanPrompt({
			patientContext,
			currentPlanJson,
			instructions,
			exerciseCatalog: catalogForPrompt,
		}),
	});

	if (!result.output) return null;

	const daysWithCatalogIds = matchExercisesToCatalog({
		plan: result.output,
		catalog: catalog.map((ex) => ({ id: ex.id, name: ex.name })),
	});

	return { ...result.output, days: daysWithCatalogIds };
};

export const generateWorkoutPlan = tool({
	description: "Generate a personalized workout plan for a patient and store it in the database",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		goal: z.string().optional().describe("The fitness or rehabilitation goal for the workout plan"),
	}),
	outputSchema: z.object({
		stage: z.enum(["processing", "complete"]),
		workoutPlanId: z.string().nullable(),
		title: z.string().nullable(),
		summary: z.string().nullable(),
		daysCount: z.number(),
	}),
	async *execute({ goal }, { context }) {
		const { patientId, sessionId, organizationId, patientContext } = context;

		if (!patientId || !organizationId) {
			throw new Error("Patient ID or organization ID not found");
		}

		yield {
			stage: "processing",
			workoutPlanId: null,
			title: null,
			summary: null,
			daysCount: 0,
		};

		const generated = await generateWorkoutPlanCore({
			patientContext: patientContext ?? "",
			goal,
		});

		if (!generated) {
			yield {
				stage: "complete",
				workoutPlanId: null,
				title: null,
				summary: null,
				daysCount: 0,
			};
			return;
		}

		const plan = await createWorkoutPlan({
			patientId,
			patientSessionId: sessionId ?? null,
			organizationId,
			title: generated.title,
			summary: generated.summary,
			durationWeeks: generated.durationWeeks,
			daysPerWeek: generated.daysPerWeek,
			days: generated.days,
		});

		yield {
			stage: "complete",
			workoutPlanId: plan.id,
			title: plan.title,
			summary: plan.summary,
			daysCount: plan.days.length,
		};
	},
});
