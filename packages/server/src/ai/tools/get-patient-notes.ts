import { tool } from "ai";
import { z } from "zod";

import { listNotes } from "../../services/notes";
import { appContextSchema } from "../types";

const noteSchema = z.object({
	body: z.string(),
	createdAt: z.string(),
	id: z.string(),
	updatedAt: z.string(),
});

export const getPatientNotesTool = tool({
	description:
		"Get recent notes for a specific patient. Use this when the user asks about patient notes, practitioner notes, or recent written observations about a patient.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		pageSize: z.number().min(1).max(20).optional().default(10).describe("How many notes to return"),
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		error: z.string().optional(),
		message: z.string().optional(),
		notes: z.array(noteSchema).optional(),
		status: z.enum(["loading", "success", "error"]),
		totalCount: z.number().optional(),
	}),
	async *execute({ pageSize, patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient notes..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const result = await listNotes({
				organizationId: ctx.organizationId,
				pageSize,
				resourceId: patientId,
				resourceType: "patient",
			});

			yield {
				status: "success",
				notes: result.data.map((note) => ({
					body: note.body,
					createdAt: note.createdAt,
					id: note.id,
					updatedAt: note.updatedAt,
				})),
				totalCount: result.data.length,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient notes",
			};
		}
	},
});
