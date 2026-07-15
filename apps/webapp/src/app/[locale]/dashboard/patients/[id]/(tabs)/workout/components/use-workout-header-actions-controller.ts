"use client";

import { useCallback, useMemo, useReducer } from "react";

import { useParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import { useLogger } from "@getolv/logger/client";

import { usePdfBlobPreview } from "../../components/use-pdf-blob-preview";

type WorkoutHeaderActionsState = {
	contextText: string;
	editInstructions: string;
	isEditWithAiOpen: boolean;
	isGenerateOpen: boolean;
};

type WorkoutHeaderActionsAction =
	| { type: "close-edit-with-ai" }
	| { type: "close-generate" }
	| { type: "open-edit-with-ai" }
	| { type: "open-generate" }
	| { type: "set-context-text"; value: string }
	| { type: "set-edit-instructions"; value: string };

const createInitialState = (): WorkoutHeaderActionsState => ({
	contextText: "",
	editInstructions: "",
	isEditWithAiOpen: false,
	isGenerateOpen: false,
});

const workoutHeaderActionsReducer = (state: WorkoutHeaderActionsState, action: WorkoutHeaderActionsAction) => {
	switch (action.type) {
		case "close-edit-with-ai":
			return {
				...state,
				editInstructions: "",
				isEditWithAiOpen: false,
			};
		case "close-generate":
			return {
				...state,
				contextText: "",
				isGenerateOpen: false,
			};
		case "open-edit-with-ai":
			return {
				...state,
				isEditWithAiOpen: true,
			};
		case "open-generate":
			return {
				...state,
				isGenerateOpen: true,
			};
		case "set-context-text":
			return {
				...state,
				contextText: action.value,
			};
		case "set-edit-instructions":
			return {
				...state,
				editInstructions: action.value,
			};
		default:
			return state;
	}
};

export const useWorkoutHeaderActionsController = () => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [planId, setPlanId] = useQueryState("plan", parseAsString);
	const [state, dispatch] = useReducer(workoutHeaderActionsReducer, undefined, createInitialState);
	const logger = useLogger();
	const { closePreview, downloadPdf, isPreviewOpen, openPreview, pdfUrl } = usePdfBlobPreview();

	const { data: patient, isLoading: isPatientLoading } = useQuery(trpc.patients.get.queryOptions({ id: patientId }));
	const { data: workoutPlans, isLoading: isWorkoutPlansLoading } = useQuery(
		trpc.workouts.listPatientWorkoutPlans.queryOptions({ patientId })
	);

	const selectedPlanId = useMemo(() => {
		if (!planId || !workoutPlans?.some((plan) => plan.id === planId)) {
			return workoutPlans?.[0]?.id ?? null;
		}

		return planId;
	}, [planId, workoutPlans]);

	const generatePdfMutation = useMutation(
		trpc.workouts.generateWorkoutPlanPdf.mutationOptions({
			onError: (error) => {
				logger.error({
					error,
					message: "Failed to generate workout PDF",
					metadata: {
						patientId,
					},
				});
			},
		})
	);

	const generatePlanMutation = useMutation(
		trpc.workouts.generateWorkoutPlan.mutationOptions({
			onError: (error) => {
				logger.error({
					error,
					message: "Failed to generate workout plan",
					metadata: {
						patientId,
					},
				});
			},
			onSuccess: async (plan) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.workouts.listPatientWorkoutPlans.queryKey({ patientId }),
				});
				await setPlanId(plan.id);
				dispatch({ type: "close-generate" });
			},
		})
	);

	const editPlanWithAiMutation = useMutation(
		trpc.workouts.editWorkoutPlanWithAi.mutationOptions({
			onError: (error) => {
				logger.error({
					error,
					message: "Failed to edit workout plan with AI",
					metadata: {
						patientId,
						workoutPlanId: selectedPlanId,
					},
				});
			},
			onSuccess: async (_plan, variables) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.workouts.listPatientWorkoutPlans.queryKey({ patientId }),
				});
				await queryClient.invalidateQueries({
					queryKey: trpc.workouts.getWorkoutPlan.queryKey({ id: variables.workoutPlanId }),
				});
				dispatch({ type: "close-edit-with-ai" });
			},
		})
	);

	const loadPdf = useCallback(async () => {
		if (!selectedPlanId) {
			return null;
		}

		return generatePdfMutation.mutateAsync({
			patientId,
			workoutPlanId: selectedPlanId,
		});
	}, [generatePdfMutation, patientId, selectedPlanId]);

	const handlePreviewPdf = useCallback(async () => {
		const result = await loadPdf();

		if (!result) {
			return;
		}

		openPreview({ base64: result.base64 });
	}, [loadPdf, openPreview]);

	const handleDownloadPdf = useCallback(async () => {
		const result = await loadPdf();

		if (!result) {
			return;
		}

		downloadPdf({ base64: result.base64, filename: result.filename });
	}, [downloadPdf, loadPdf]);

	const openGenerate = useCallback(() => {
		dispatch({ type: "open-generate" });
	}, []);

	const handleCloseGenerate = useCallback(() => {
		if (generatePlanMutation.isPending) {
			return;
		}

		dispatch({ type: "close-generate" });
	}, [generatePlanMutation.isPending]);

	const setContextText = useCallback((value: string) => {
		dispatch({ type: "set-context-text", value });
	}, []);

	const handleSubmitGenerate = useCallback(() => {
		generatePlanMutation.mutate({
			context: state.contextText,
			patientId,
		});
	}, [generatePlanMutation, patientId, state.contextText]);

	const openEditWithAi = useCallback(() => {
		dispatch({ type: "open-edit-with-ai" });
	}, []);

	const handleCloseEditWithAi = useCallback(() => {
		if (editPlanWithAiMutation.isPending) {
			return;
		}

		dispatch({ type: "close-edit-with-ai" });
	}, [editPlanWithAiMutation.isPending]);

	const setEditInstructions = useCallback((value: string) => {
		dispatch({ type: "set-edit-instructions", value });
	}, []);

	const trimmedEditInstructions = state.editInstructions.trim();

	const handleSubmitEditWithAi = useCallback(() => {
		if (!selectedPlanId || !trimmedEditInstructions) {
			return;
		}

		editPlanWithAiMutation.mutate({
			instructions: trimmedEditInstructions,
			patientId,
			workoutPlanId: selectedPlanId,
		});
	}, [editPlanWithAiMutation, patientId, selectedPlanId, trimmedEditInstructions]);

	return {
		closePreview,
		contextText: state.contextText,
		editInstructions: state.editInstructions,
		editPlanWithAiMutation,
		generatePdfMutation,
		generatePlanMutation,
		handleCloseEditWithAi,
		handleCloseGenerate,
		handleDownloadPdf,
		handlePreviewPdf,
		handleSubmitEditWithAi,
		handleSubmitGenerate,
		isEditWithAiOpen: state.isEditWithAiOpen,
		isGenerateOpen: state.isGenerateOpen,
		isLoading: isPatientLoading || isWorkoutPlansLoading,
		isPreviewOpen,
		openEditWithAi,
		openGenerate,
		patient,
		pdfUrl,
		selectedPlanId,
		setContextText,
		setEditInstructions,
		trimmedEditInstructions,
	};
};
