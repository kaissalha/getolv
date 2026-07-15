"use client";

import { useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";

import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@getolv/server";
import { toast } from "@getolv/ui/components/sonner";

import {
	createEmptyClinicalDiagnosisEntry,
	createEmptyClinicalTodo,
	getPatientClinicalStateFormValues,
	getPatientClinicalStateMutationInput,
	type PatientClinicalStateFormValues,
} from "./patient-clinical-state-form";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type EditableClinicalStateCard = "diagnosis" | "todos" | null;

type UsePatientClinicalStateControllerProps = {
	patient: PatientDetails;
};

export const usePatientClinicalStateController = ({ patient }: UsePatientClinicalStateControllerProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const tOverview = useTranslations("dashboard.patients.overview");
	const [editingCard, setEditingCard] = useState<EditableClinicalStateCard>(null);
	const rollbackPatientRef = useRef<PatientDetails | null>(null);
	const form = useForm<PatientClinicalStateFormValues>({
		defaultValues: getPatientClinicalStateFormValues({ patient }),
		mode: "onChange",
	});
	const patientQueryKey = trpc.patients.get.queryKey({ id: patient.id });

	const workingDiagnosis = useFieldArray({
		control: form.control,
		name: "diagnosis.workingDx",
		keyName: "fieldId",
	});
	const differentialDiagnosis = useFieldArray({
		control: form.control,
		name: "diagnosis.differentialDx",
		keyName: "fieldId",
	});
	const todos = useFieldArray({
		control: form.control,
		name: "todos",
		keyName: "fieldId",
	});

	const updateClinicalStateMutation = useMutation(
		trpc.patients.updateClinicalState.mutationOptions({
			onError: () => {
				if (rollbackPatientRef.current) {
					form.reset(getPatientClinicalStateFormValues({ patient: rollbackPatientRef.current }));
					queryClient.setQueryData(patientQueryKey, rollbackPatientRef.current);
				}

				toast.error(tOverview("clinicalStateUpdateError"));
			},
			onMutate: async (input) => {
				rollbackPatientRef.current = queryClient.getQueryData<PatientDetails>(patientQueryKey) ?? patient;
				const optimisticPatient = {
					...rollbackPatientRef.current,
					diagnosis: input.diagnosis,
					todos: input.todos,
				};

				form.reset(getPatientClinicalStateFormValues({ patient: optimisticPatient }));
				queryClient.setQueryData(patientQueryKey, optimisticPatient);
			},
			onSuccess: async (updatedPatient) => {
				rollbackPatientRef.current = null;
				form.reset(getPatientClinicalStateFormValues({ patient: updatedPatient }));
				queryClient.setQueryData(patientQueryKey, updatedPatient);
				await queryClient.invalidateQueries({ queryKey: patientQueryKey });
				setEditingCard(null);
				toast.success(tOverview("clinicalStateUpdateSuccess"));
			},
		})
	);

	const cancelEditing = () => {
		const nextPatient = queryClient.getQueryData<PatientDetails>(patientQueryKey) ?? patient;
		form.reset(getPatientClinicalStateFormValues({ patient: nextPatient }));
		setEditingCard(null);
	};

	const startEditing = ({ card }: { card: Exclude<EditableClinicalStateCard, null> }) => {
		if (editingCard) {
			return;
		}

		setEditingCard(card);
	};

	const saveClinicalState = async ({ values }: { values: PatientClinicalStateFormValues }) => {
		await updateClinicalStateMutation.mutateAsync({
			id: patient.id,
			...getPatientClinicalStateMutationInput({ values }),
		});
	};

	const saveChanges = async (values: PatientClinicalStateFormValues) => {
		await saveClinicalState({ values });
	};

	const removeTodo = async ({ todoId }: { todoId: string }) => {
		const values = form.getValues();

		await saveClinicalState({
			values: {
				...values,
				todos: values.todos.filter((todo) => todo.id !== todoId),
			},
		});
	};

	const completeTodo = async ({ todoId }: { todoId: string }) => {
		await removeTodo({ todoId });
	};

	return {
		cancelEditing,
		completeTodo,
		differentialDiagnosis,
		editingCard,
		form,
		formId: `patient-clinical-state-form-${patient.id}`,
		isSaving: updateClinicalStateMutation.isPending,
		removeTodo,
		saveChanges,
		startEditing,
		todos,
		workingDiagnosis,
		appendDifferentialDiagnosis: () => differentialDiagnosis.append(createEmptyClinicalDiagnosisEntry()),
		appendTodo: () => todos.append(createEmptyClinicalTodo()),
		appendWorkingDiagnosis: () => workingDiagnosis.append(createEmptyClinicalDiagnosisEntry()),
		removeDifferentialDiagnosis: ({ index }: { index: number }) => differentialDiagnosis.remove(index),
		removeWorkingDiagnosis: ({ index }: { index: number }) => workingDiagnosis.remove(index),
		removeTodoRow: ({ index }: { index: number }) => todos.remove(index),
	};
};
