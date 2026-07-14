import { tool } from "ai";
import { z } from "zod";

import { listPatients } from "../../services/patients";
import { appContextSchema } from "../types";

const patientSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phoneNumber: z.string().nullable(),
	createdAt: z.string(),
});

export const getPatientsTool = tool({
	description:
		"Search and list patients in the organization. Use this when the user wants to find patients, see a list of patients, or search for specific patients by name or email.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		search: z.string().optional().describe("Search term to filter patients by name or email"),
		pageSize: z.number().optional().default(10).describe("Number of patients to return (default: 10)"),
	}),
	outputSchema: z.object({
		status: z.enum(["loading", "success", "error"]),
		message: z.string().optional(),
		error: z.string().optional(),
		patients: z.array(patientSchema).optional(),
		totalCount: z.number().optional(),
		hasMore: z.boolean().optional(),
	}),
	async *execute({ search, pageSize }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patients..." };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const result = await listPatients({
				organizationId: ctx.organizationId,
				search,
				pageSize,
			});

			yield {
				status: "success",
				patients: result.data.map((patient) => ({
					id: patient.id,
					firstName: patient.firstName,
					lastName: patient.lastName,
					email: patient.email,
					phoneNumber: patient.phoneNumber,
					createdAt: patient.createdAt,
				})),
				totalCount: result.data.length,
				hasMore: result.meta.cursor !== null,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patients",
			};
		}
	},
});
