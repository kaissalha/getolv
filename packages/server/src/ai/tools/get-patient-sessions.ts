import { tool } from "ai";
import { z } from "zod";

import { getPatientSessions } from "../../services/patient-sessions";
import { appContextSchema } from "../types";

const sessionSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	summary: z.string().nullable(),
	status: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const getPatientSessionsTool = tool({
	description:
		"Get all consultation sessions for a specific patient. Use this when the user wants to see a patient's session history or past consultations.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		status: z.enum(["loading", "success", "error"]),
		message: z.string().optional(),
		error: z.string().optional(),
		sessions: z.array(sessionSchema).optional(),
		totalCount: z.number().optional(),
	}),
	async *execute({ patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient sessions..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const sessions = await getPatientSessions(patientId, ctx.organizationId);

			yield {
				status: "success",
				sessions: sessions.map((session) => ({
					id: session.id,
					title: session.title,
					summary: session.summary,
					status: session.status,
					createdAt: session.createdAt,
					updatedAt: session.updatedAt,
				})),
				totalCount: sessions.length,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient sessions",
			};
		}
	},
});
