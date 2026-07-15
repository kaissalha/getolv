"use client";

import { FormProvider } from "react-hook-form";

import type { RouterOutput } from "@getolv/server";
import { Form } from "@getolv/ui/components/form";

import { MedicalProfileCard } from "./medical-profile-card";
import { PatientClinicalStateSection } from "./patient-clinical-state-section";
import { PatientDetailsCard } from "./patient-details-card";
import { usePatientOverviewEditor } from "./use-patient-overview-editor";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type OverviewSidebarProps = {
	patient: PatientDetails;
};

export const OverviewSidebar = ({ patient }: OverviewSidebarProps) => {
	const editor = usePatientOverviewEditor({ patient });

	return (
		<div className='flex min-w-0 flex-col gap-4'>
			<FormProvider {...editor.form}>
				<Form
					id={editor.formId}
					onSubmit={editor.form.handleSubmit(editor.saveChanges)}
					className='flex min-w-0 flex-col gap-4'
				>
					<PatientDetailsCard
						formId={editor.formId}
						isAnotherCardEditing={editor.editingCard !== null && editor.editingCard !== "details"}
						isEditing={editor.editingCard === "details"}
						isSaving={editor.isSaving}
						onCancelEditing={editor.cancelEditing}
						onStartEditing={() => editor.startEditing({ card: "details" })}
						patient={patient}
					/>
					<MedicalProfileCard
						formId={editor.formId}
						isAnotherCardEditing={editor.editingCard !== null && editor.editingCard !== "medical"}
						isEditing={editor.editingCard === "medical"}
						isSaving={editor.isSaving}
						onCancelEditing={editor.cancelEditing}
						onStartEditing={() => editor.startEditing({ card: "medical" })}
						patient={patient}
					/>
				</Form>
			</FormProvider>
			<PatientClinicalStateSection patient={patient} />
		</div>
	);
};
