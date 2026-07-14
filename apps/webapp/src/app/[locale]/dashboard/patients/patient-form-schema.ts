import isEmail from "validator/lib/isEmail";
import { z } from "zod";

import type { TranslationFunction } from "@/types/translation";

export const ADDITIONAL_CONTEXT_MAX = 1000;

export const patientFormSchema = ({ commonT }: { commonT: TranslationFunction<"common"> }) =>
	z.object({
		firstName: z.string().min(1, { message: commonT("validation.required") }),
		lastName: z.string().min(1, { message: commonT("validation.required") }),
		email: z
			.string()
			.min(1, { message: commonT("validation.required") })
			.refine(isEmail, { message: commonT("validation.invalidEmail") }),
		phoneNumber: z.string().optional(),
		dateOfBirth: z.string().optional(),
		gender: z.string().optional(),
		allergies: z.string().optional(),
		currentMedications: z.string().optional(),
		pastMedicalHistory: z.string().optional(),
		familyMedicalHistory: z.string().optional(),
		additionalContext: z.string().max(ADDITIONAL_CONTEXT_MAX).optional(),
	});

export type PatientFormValues = z.infer<ReturnType<typeof patientFormSchema>>;

const normalizeOptionalText = ({ value }: { value: string | undefined }) => {
	const trimmedValue = value?.trim();
	return trimmedValue ? trimmedValue : null;
};

export const getPatientMutationInput = ({ values }: { values: PatientFormValues }) => ({
	firstName: values.firstName.trim(),
	lastName: values.lastName.trim(),
	email: values.email.trim(),
	phoneNumber: normalizeOptionalText({ value: values.phoneNumber }),
	dateOfBirth: normalizeOptionalText({ value: values.dateOfBirth }),
	gender: normalizeOptionalText({ value: values.gender }),
	allergies: normalizeOptionalText({ value: values.allergies }),
	currentMedications: normalizeOptionalText({ value: values.currentMedications }),
	pastMedicalHistory: normalizeOptionalText({ value: values.pastMedicalHistory }),
	familyMedicalHistory: normalizeOptionalText({ value: values.familyMedicalHistory }),
	additionalContext: normalizeOptionalText({ value: values.additionalContext }),
});

export const getEmptyPatientFormValues = (): PatientFormValues => ({
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	dateOfBirth: "",
	gender: "",
	allergies: "",
	currentMedications: "",
	pastMedicalHistory: "",
	familyMedicalHistory: "",
	additionalContext: "",
});

export const getPatientFormValues = ({
	patient,
}: {
	patient: {
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string | null;
		dateOfBirth: string | null;
		gender: string | null;
		allergies: string | null;
		currentMedications: string | null;
		pastMedicalHistory: string | null;
		familyMedicalHistory: string | null;
		additionalContext: string | null;
	};
}): PatientFormValues => ({
	firstName: patient.firstName,
	lastName: patient.lastName,
	email: patient.email,
	phoneNumber: patient.phoneNumber ?? "",
	dateOfBirth: patient.dateOfBirth ?? "",
	gender: patient.gender ?? "",
	allergies: patient.allergies ?? "",
	currentMedications: patient.currentMedications ?? "",
	pastMedicalHistory: patient.pastMedicalHistory ?? "",
	familyMedicalHistory: patient.familyMedicalHistory ?? "",
	additionalContext: patient.additionalContext ?? "",
});
