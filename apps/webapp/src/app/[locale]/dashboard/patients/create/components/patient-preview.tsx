"use client";

import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { PatientFormValues } from "../../patient-form-schema";
import { PatientPreviewCard } from "./patient-preview-card";

type PatientPreviewProps = {
	control: UseFormReturn<PatientFormValues>["control"];
};

export const PatientPreview = ({ control }: PatientPreviewProps) => {
	const values = useWatch({ control });

	return (
		<PatientPreviewCard
			values={{
				firstName: values.firstName ?? "",
				lastName: values.lastName ?? "",
				email: values.email ?? "",
				phoneNumber: values.phoneNumber ?? "",
				dateOfBirth: values.dateOfBirth ?? "",
				gender: values.gender ?? "",
				allergies: values.allergies ?? "",
				currentMedications: values.currentMedications ?? "",
				pastMedicalHistory: values.pastMedicalHistory ?? "",
				familyMedicalHistory: values.familyMedicalHistory ?? "",
				additionalContext: values.additionalContext ?? "",
			}}
		/>
	);
};
