"use client";

import { FormProvider } from "react-hook-form";

import type { RouterOutput } from "@getolv/server";
import { Form } from "@getolv/ui/components/form";

import { PatientDiagnosisCard } from "./patient-diagnosis-card";
import { PatientTodosCard } from "./patient-todos-card";
import { usePatientClinicalStateController } from "./use-patient-clinical-state-controller";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type PatientClinicalStateSectionProps = {
	patient: PatientDetails;
};

export const PatientClinicalStateSection = ({ patient }: PatientClinicalStateSectionProps) => {
	const controller = usePatientClinicalStateController({ patient });

	return (
		<FormProvider {...controller.form}>
			<Form
				id={controller.formId}
				onSubmit={controller.form.handleSubmit(controller.saveChanges)}
				className='flex min-w-0 flex-col gap-4'
			>
				<PatientDiagnosisCard
					appendDifferentialDiagnosis={controller.appendDifferentialDiagnosis}
					appendWorkingDiagnosis={controller.appendWorkingDiagnosis}
					differentialDiagnosisFields={controller.differentialDiagnosis.fields}
					formId={controller.formId}
					isAnotherCardEditing={controller.editingCard !== null && controller.editingCard !== "diagnosis"}
					isEditing={controller.editingCard === "diagnosis"}
					isSaving={controller.isSaving}
					onCancelEditing={controller.cancelEditing}
					onRemoveDifferentialDiagnosis={controller.removeDifferentialDiagnosis}
					onRemoveWorkingDiagnosis={controller.removeWorkingDiagnosis}
					onStartEditing={() => controller.startEditing({ card: "diagnosis" })}
					patient={patient}
					workingDiagnosisFields={controller.workingDiagnosis.fields}
				/>
				<PatientTodosCard
					formId={controller.formId}
					isAnotherCardEditing={controller.editingCard !== null && controller.editingCard !== "todos"}
					isEditing={controller.editingCard === "todos"}
					isSaving={controller.isSaving}
					onAppendTodo={controller.appendTodo}
					onCancelEditing={controller.cancelEditing}
					onCompleteTodo={controller.completeTodo}
					onRemoveTodo={controller.removeTodo}
					onRemoveTodoRow={controller.removeTodoRow}
					onStartEditing={() => controller.startEditing({ card: "todos" })}
					patient={patient}
					todoFields={controller.todos.fields}
				/>
			</Form>
		</FormProvider>
	);
};
