import { tool } from "ai";
import { z } from "zod";

import { getPatientMailThread } from "../../services/mail";
import { getPatient } from "../../services/patients";
import { appContextSchema } from "../types";

const patientMailMessageSchema = z.object({
	id: z.string(),
	isUnread: z.boolean(),
	receivedOn: z.string(),
	senderEmail: z.string(),
	senderName: z.string().nullable(),
	snippet: z.string().nullable(),
	subject: z.string().nullable(),
});

export const getPatientMailThreadTool = tool({
	description:
		"Get recent Gmail messages related to a specific patient. Use this when the user asks about emails with a patient, recent correspondence, or the patient's mail thread.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		maxResults: z.number().min(1).max(20).optional().default(10).describe("How many recent messages to return"),
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		error: z.string().optional(),
		hasUnread: z.boolean().optional(),
		message: z.string().optional(),
		messages: z.array(patientMailMessageSchema).optional(),
		patientEmail: z.string().optional(),
		status: z.enum(["loading", "success", "error"]),
		totalReplies: z.number().optional(),
	}),
	async *execute({ maxResults, patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient email thread..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const patient = await getPatient({
				id: patientId,
				organizationId: ctx.organizationId,
			});

			if (!patient) {
				yield { status: "error", error: "Patient not found" };
				return;
			}

			if (!patient.email.trim()) {
				yield { status: "error", error: "Patient does not have an email address" };
				return;
			}

			const thread = await getPatientMailThread({
				maxResults,
				organizationId: ctx.organizationId,
				patientEmail: patient.email,
			});

			if (!thread) {
				yield { status: "error", error: "No mail connection found" };
				return;
			}

			yield {
				status: "success",
				hasUnread: thread.hasUnread,
				messages: thread.messages
					.filter((message) => !message.isDraft)
					.toReversed()
					.slice(0, maxResults)
					.map((message) => ({
						id: message.id,
						isUnread: message.isUnread,
						receivedOn: message.receivedOn,
						senderEmail: message.sender.email,
						senderName: message.sender.name ?? null,
						snippet: message.snippet || message.body.slice(0, 240) || null,
						subject: message.subject || null,
					})),
				patientEmail: patient.email,
				totalReplies: thread.totalReplies,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient email thread",
			};
		}
	},
});
