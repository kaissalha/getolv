import { tool } from "ai";
import { z } from "zod";

import { listPatientWorkoutPlans } from "../../services/workouts";
import { appContextSchema } from "../types";

const workoutPlanSchema = z.object({
	createdAt: z.string(),
	daysCount: z.number(),
	daysPerWeek: z.number().nullable(),
	durationWeeks: z.number().nullable(),
	exercisesCount: z.number(),
	id: z.string(),
	summary: z.string().nullable(),
	title: z.string(),
});

export const getPatientWorkoutPlansTool = tool({
	description:
		"Get workout plans for a specific patient. Use this when the user asks about exercise plans, training plans, or workout recommendations previously generated for a patient.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		error: z.string().optional(),
		message: z.string().optional(),
		plans: z.array(workoutPlanSchema).optional(),
		status: z.enum(["loading", "success", "error"]),
		totalCount: z.number().optional(),
	}),
	async *execute({ patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient workout plans..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const plans = await listPatientWorkoutPlans({
				organizationId: ctx.organizationId,
				patientId,
			});

			yield {
				status: "success",
				plans: plans.map((plan) => ({
					createdAt: plan.createdAt,
					daysCount: plan.days.length,
					daysPerWeek: plan.daysPerWeek,
					durationWeeks: plan.durationWeeks,
					exercisesCount: plan.days.reduce((total, day) => total + day.exercises.length, 0),
					id: plan.id,
					summary: plan.summary,
					title: plan.title,
				})),
				totalCount: plans.length,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient workout plans",
			};
		}
	},
});
