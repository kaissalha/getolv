"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@starter/server";
import { toast } from "@starter/ui/components/sonner";

import {
	getPatientFormValues,
	getPatientMutationInput,
	patientFormSchema,
	type PatientFormValues,
} from "../../../../patient-form-schema";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type EditableOverviewCard = "details" | "medical" | null;

type UsePatientOverviewEditorProps = {
	patient: PatientDetails;
};

export const usePatientOverviewEditor = ({ patient }: UsePatientOverviewEditorProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const commonT = useTranslations("common");
	const tOverview = useTranslations("dashboard.patients.overview");
	const [editingCard, setEditingCard] = useState<EditableOverviewCard>(null);
	const form = useForm<PatientFormValues>({
		resolver: zodResolver(patientFormSchema({ commonT })),
		defaultValues: getPatientFormValues({ patient }),
		mode: "onChange",
	});

	const updatePatientMutation = useMutation(
		trpc.patients.update.mutationOptions({
			onSuccess: async (updatedPatient) => {
				const patientQueryKey = trpc.patients.get.queryKey({ id: patient.id });
				form.reset(getPatientFormValues({ patient: updatedPatient }));
				queryClient.setQueryData(patientQueryKey, updatedPatient);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: patientQueryKey }),
					queryClient.invalidateQueries({ queryKey: trpc.patients.list.queryKey() }),
				]);
				setEditingCard(null);
				toast.success(tOverview("updateSuccess"));
			},
			onError: (error) => {
				if (error.data?.code === "CONFLICT") {
					form.setError("email", { message: error.message });
					setEditingCard("details");
					return;
				}

				toast.error(tOverview("updateError"));
			},
		})
	);

	const cancelEditing = () => {
		form.reset(getPatientFormValues({ patient }));
		setEditingCard(null);
	};

	const startEditing = ({ card }: { card: Exclude<EditableOverviewCard, null> }) => {
		if (editingCard) {
			return;
		}

		setEditingCard(card);
	};

	const saveChanges = async (values: PatientFormValues) => {
		await updatePatientMutation.mutateAsync({
			id: patient.id,
			...getPatientMutationInput({ values }),
		});
	};

	return {
		cancelEditing,
		editingCard,
		form,
		formId: `patient-overview-form-${patient.id}`,
		isSaving: updatePatientMutation.isPending,
		saveChanges,
		startEditing,
	};
};
