import { tool } from "ai";
import { z } from "zod";

import { createPatientSession } from "../../services/patient-sessions";
import { appContextSchema } from "../types";

const sessionSchema = z.object({
	id: z.string(),
	patientId: z.string(),
	createdAt: z.string(),
});

export const createPatientSessionTool = tool({
	description:
		"Create a new consultation session for a patient. Use this when the user wants to start a new consultation or session with a patient.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		patientId: z.string().describe("The unique identifier of the patient"),
		title: z.string().optional().describe("Optional title for the session (default: 'New Session')"),
	}),
	outputSchema: z.object({
		status: z.enum(["loading", "success", "error"]),
		message: z.string().optional(),
		error: z.string().optional(),
		session: sessionSchema.optional(),
	}),
	async *execute({ patientId, title }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Creating patient session..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const result = await createPatientSession({
				organizationId: ctx.organizationId,
				patientId,
				title,
			});

			if (!result.patientSession) {
				yield { status: "error", error: "Failed to create patient session" };
				return;
			}

			yield {
				status: "success",
				session: {
					id: result.patientSession.id,
					patientId: result.patientSession.patientId,
					createdAt: result.patientSession.createdAt,
				},
				message: "Successfully created new session for patient",
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to create patient session",
			};
		}
	},
});
