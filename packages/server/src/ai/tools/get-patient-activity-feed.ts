import { tool } from "ai";
import { z } from "zod";

import { getPatientActivityFeed } from "../../services/patient-activity-feed";
import { appContextSchema } from "../types";

const activityItemSchema = z.object({
	createdAt: z.string(),
	description: z.string().nullable(),
	id: z.string(),
	title: z.string(),
	type: z.enum(["email", "lab-report", "note", "session", "workout-plan"]),
});

export const getPatientActivityFeedTool = tool({
	description:
		"Get a patient's recent cross-product activity feed including sessions, emails, notes, lab reports, and workout plans. Use this when the user wants a recent timeline or overall activity summary for a patient.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		pageSize: z.number().min(1).max(25).optional().default(10).describe("How many recent activity items to return"),
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		activities: z.array(activityItemSchema).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		status: z.enum(["loading", "success", "error"]),
		totalCount: z.number().optional(),
	}),
	async *execute({ pageSize, patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient activity..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const activityFeed = await getPatientActivityFeed({
				organizationId: ctx.organizationId,
				patientId,
			});

			yield {
				status: "success",
				activities: activityFeed.slice(0, pageSize).map((activity) => {
					if (activity.type === "email") {
						return {
							createdAt: activity.createdAt,
							description: activity.snippet,
							id: activity.id,
							title: activity.subject || activity.senderName || activity.senderEmail,
							type: activity.type,
						};
					}

					if (activity.type === "lab-report") {
						return {
							createdAt: activity.createdAt,
							description: activity.summary,
							id: activity.id,
							title: activity.patientSessionTitle || "Lab report",
							type: activity.type,
						};
					}

					if (activity.type === "note") {
						return {
							createdAt: activity.createdAt,
							description: activity.body,
							id: activity.id,
							title: "Note",
							type: activity.type,
						};
					}

					if (activity.type === "session") {
						return {
							createdAt: activity.createdAt,
							description: activity.summary,
							id: activity.id,
							title: activity.title || "Session",
							type: activity.type,
						};
					}

					return {
						createdAt: activity.createdAt,
						description: activity.summary,
						id: activity.id,
						title: activity.title,
						type: activity.type,
					};
				}),
				totalCount: activityFeed.length,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient activity",
			};
		}
	},
});
