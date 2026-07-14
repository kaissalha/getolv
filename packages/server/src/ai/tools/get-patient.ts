import { tool } from "ai";
import { z } from "zod";

import { getPatient } from "../../services/patients";
import { appContextSchema } from "../types";

const patientSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phoneNumber: z.string().nullable(),
	dateOfBirth: z.string().nullable(),
	gender: z.string().nullable(),
	allergies: z.string().nullable(),
	currentMedications: z.string().nullable(),
	pastMedicalHistory: z.string().nullable(),
	familyMedicalHistory: z.string().nullable(),
	additionalContext: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const getPatientTool = tool({
	description:
		"Get detailed information about a specific patient by their ID. Use this when the user asks about a specific patient's details.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		patientId: z.string().describe("The unique identifier of the patient"),
	}),
	outputSchema: z.object({
		status: z.enum(["loading", "success", "error"]),
		message: z.string().optional(),
		error: z.string().optional(),
		patient: patientSchema.optional(),
	}),
	async *execute({ patientId }, { context }) {
		const ctx = context;

		yield { status: "loading", message: "Fetching patient details..." };

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

			yield {
				status: "success",
				patient: {
					id: patient.id,
					firstName: patient.firstName,
					lastName: patient.lastName,
					email: patient.email,
					phoneNumber: patient.phoneNumber,
					dateOfBirth: patient.dateOfBirth,
					gender: patient.gender,
					allergies: patient.allergies,
					currentMedications: patient.currentMedications,
					pastMedicalHistory: patient.pastMedicalHistory,
					familyMedicalHistory: patient.familyMedicalHistory,
					additionalContext: patient.additionalContext,
					createdAt: patient.createdAt,
					updatedAt: patient.updatedAt,
				},
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to fetch patient",
			};
		}
	},
});
