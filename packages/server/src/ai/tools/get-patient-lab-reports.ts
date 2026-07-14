import { tool } from "ai";
import { z } from "zod";

import { getPatientLabReports } from "../../services/lab";
import { appContextSchema } from "../types";

const labReportSchema = z.object({
	createdAt: z.string(),
	id: z.string(),
	patientSessionId: z.string().nullable(),
	patientSessionTitle: z.string().nullable(),
	reportDate: z.string().nullable(),
	summary: z.string().nullable(),
});

export const getPatientLabReportsTool = tool({
	description:
		"Get lab reports for a specific patient. Use this when the user asks about a patient's labs, recent reports, or generated lab summaries.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		error: z.string().optional(),
		message: z.string().optional(),
		reports: z.array(labReportSchema).optional(),
		status: z.enum(["loading", "success", "error"]),
		totalCount: z.number().optional(),
	}),
	async *execute({ patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient lab reports..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const reports = await getPatientLabReports({ patientId });

			yield {
				status: "success",
				reports: reports.map((report) => ({
					createdAt: report.createdAt,
					id: report.id,
					patientSessionId: report.patientSessionId,
					patientSessionTitle: report.patientSession?.title ?? null,
					reportDate: report.reportDate,
					summary: report.summary,
				})),
				totalCount: reports.length,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient lab reports",
			};
		}
	},
});
