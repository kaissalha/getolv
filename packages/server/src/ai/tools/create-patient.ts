import { tool } from "ai";
import { z } from "zod";

import { createPatient } from "../../services/patients";
import { appContextSchema } from "../types";

const patientSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phoneNumber: z.string().nullable(),
	createdAt: z.string(),
});

export const createPatientTool = tool({
	description:
		"Create a new patient in the organization. Use this when the user wants to add or register a new patient. Requires first name, last name, and email.",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		firstName: z.string().describe("The patient's first name"),
		lastName: z.string().describe("The patient's last name"),
		email: z.string().email().describe("The patient's email address"),
		phoneNumber: z.string().optional().describe("The patient's phone number (optional)"),
		dateOfBirth: z.string().optional().describe("The patient's date of birth in YYYY-MM-DD format (optional)"),
		gender: z
			.string()
			.optional()
			.describe("The patient's gender: male, female, other, or preferNotToSay (optional)"),
		allergies: z.string().optional().describe("Known allergies (optional)"),
		currentMedications: z.string().optional().describe("Current medications (optional)"),
		pastMedicalHistory: z.string().optional().describe("Personal medical history (optional)"),
		familyMedicalHistory: z.string().optional().describe("Family medical history (optional)"),
		additionalContext: z
			.string()
			.max(1000)
			.optional()
			.describe("Additional patient context for reference (optional)"),
	}),
	outputSchema: z.object({
		status: z.enum(["loading", "success", "error"]),
		message: z.string().optional(),
		error: z.string().optional(),
		patient: patientSchema.optional(),
	}),
	async *execute(
		{
			firstName,
			lastName,
			email,
			phoneNumber,
			dateOfBirth,
			gender,
			allergies,
			currentMedications,
			pastMedicalHistory,
			familyMedicalHistory,
			additionalContext,
		},
		{ context }
	) {
		const ctx = context;

		yield { status: "loading", message: `Creating patient ${firstName} ${lastName}...` };

		if (!ctx.organizationId) {
			yield { status: "error", error: "Organization context not found" };
			return;
		}

		try {
			const patient = await createPatient({
				organizationId: ctx.organizationId,
				firstName,
				lastName,
				email,
				phoneNumber,
				dateOfBirth,
				gender,
				allergies,
				currentMedications,
				pastMedicalHistory,
				familyMedicalHistory,
				additionalContext,
			});

			if (!patient) {
				yield { status: "error", error: "Failed to create patient" };
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
					createdAt: patient.createdAt,
				},
				message: `Successfully created patient ${firstName} ${lastName}`,
			};
		} catch (error) {
			yield {
				status: "error",
				error: error instanceof Error ? error.message : "Failed to create patient",
			};
		}
	},
});
