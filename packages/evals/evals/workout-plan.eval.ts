import { Output, generateText } from "ai";
import { createScorer, evalite } from "evalite";

import { models } from "@starter/ai/models";
import { generateWorkoutPlanPrompt, generatedWorkoutPlanSchema } from "@starter/ai/prompts";

type WorkoutPlanInput = {
	exerciseCatalog: Array<{
		bodyParts: string[];
		equipments: string[];
		name: string;
		targetMuscles: string[];
	}>;
	goal?: string;
	patientContext: string;
};

type WorkoutPlanOutput = {
	days: Array<{
		coolDown: string | null;
		dayNumber: number;
		exercises: Array<{
			exerciseName: string;
			notes: string | null;
			reps: string | null;
			restSeconds: number | null;
			sets: number | null;
		}>;
		focus: string | null;
		name: string;
		warmUp: string | null;
	}>;
	daysPerWeek: number | null;
	durationWeeks: number | null;
	summary: string | null;
	title: string;
};

type WorkoutPlanExpected = {
	minCatalogExerciseCoverage: number;
};

const structureScorer = createScorer<WorkoutPlanInput, WorkoutPlanOutput, WorkoutPlanExpected>({
	name: "Has usable plan structure",
	scorer: ({ output }) => {
		if (!output.title.trim() || output.days.length === 0) {
			return 0;
		}

		const validDays = output.days.every(
			(day) =>
				Boolean(day.name.trim()) &&
				Boolean(day.warmUp?.trim()) &&
				Boolean(day.coolDown?.trim()) &&
				day.exercises.length > 0
		);

		return validDays ? 1 : 0;
	},
});

const summaryScorer = createScorer<WorkoutPlanInput, WorkoutPlanOutput, WorkoutPlanExpected>({
	name: "Summary stays descriptive",
	scorer: ({ output }) => {
		const summary = output.summary?.trim() ?? "";

		if (!summary) {
			return 0;
		}

		return summary.length >= 180 ? 1 : 0.5;
	},
});

const catalogCoverageScorer = createScorer<WorkoutPlanInput, WorkoutPlanOutput, WorkoutPlanExpected>({
	name: "Uses the provided exercise catalog",
	scorer: ({ input, output, expected }) => {
		const catalogNames = new Set(input.exerciseCatalog.map((item) => item.name.toLowerCase()));
		const exercises = output.days.flatMap((day) => day.exercises);

		if (exercises.length === 0) {
			return 0;
		}

		const matched = exercises.filter((item) => catalogNames.has(item.exerciseName.toLowerCase())).length;
		const coverage = matched / exercises.length;

		return coverage >= expected.minCatalogExerciseCoverage ? 1 : coverage / expected.minCatalogExerciseCoverage;
	},
});

evalite<WorkoutPlanInput, WorkoutPlanOutput, WorkoutPlanExpected>("Workout plan generation prompt", {
	data: [
		{
			input: {
				patientContext:
					"38-year-old patient returning to exercise after an ankle sprain. Goal is to rebuild lower-body strength without aggravating the ankle, improve balance, and restore confidence walking uphill.",
				goal: "Rebuild strength and stability after ankle rehab",
				exerciseCatalog: [
					{
						name: "Goblet Squat",
						targetMuscles: ["quads", "glutes", "core"],
						bodyParts: ["legs"],
						equipments: ["dumbbell"],
					},
					{
						name: "Step-Up",
						targetMuscles: ["glutes", "quads", "calves"],
						bodyParts: ["legs"],
						equipments: ["bench"],
					},
					{
						name: "Single-Leg Romanian Deadlift",
						targetMuscles: ["hamstrings", "glutes", "core"],
						bodyParts: ["legs"],
						equipments: ["dumbbell"],
					},
					{
						name: "Farmer Carry",
						targetMuscles: ["grip", "core", "shoulders"],
						bodyParts: ["full body"],
						equipments: ["dumbbell"],
					},
				],
			},
			expected: {
				minCatalogExerciseCoverage: 0.5,
			},
		},
	],
	task: async (input) => {
		const { output } = await generateText({
			model: models.fast.model,
			output: Output.object({
				schema: generatedWorkoutPlanSchema,
			}),
			prompt: generateWorkoutPlanPrompt(input),
		});

		return output;
	},
	scorers: [structureScorer, summaryScorer, catalogCoverageScorer],
});
