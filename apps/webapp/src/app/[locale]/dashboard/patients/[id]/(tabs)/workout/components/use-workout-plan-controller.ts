"use client";

import { useCallback, useMemo, useReducer } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";

import type { WorkoutPlanListItem } from "./workout-plan-summary";

type WorkoutPlanShellState = {
	deletingPlanId: string | null;
	editedSummary: string;
	isEditingSummary: boolean;
};

type WorkoutPlanShellAction =
	| { type: "close-summary" }
	| { type: "request-delete"; planId: string | null }
	| { type: "set-edited-summary"; value: string }
	| { type: "set-is-editing-summary"; value: boolean }
	| { type: "start-summary"; summary: string };

type WorkoutPlanExerciseState = {
	addingToDayId: string | null;
	removingExerciseId: string | null;
	swappingExerciseId: string | null;
};

type WorkoutPlanExerciseAction =
	| { type: "set-adding-day"; value: string | null }
	| { type: "set-removing-exercise"; value: string | null }
	| { type: "set-swapping-exercise"; value: string | null };

const createShellState = (): WorkoutPlanShellState => ({
	deletingPlanId: null,
	editedSummary: "",
	isEditingSummary: false,
});

const workoutPlanShellReducer = (state: WorkoutPlanShellState, action: WorkoutPlanShellAction) => {
	switch (action.type) {
		case "close-summary":
			return {
				...state,
				editedSummary: "",
				isEditingSummary: false,
			};
		case "request-delete":
			return {
				...state,
				deletingPlanId: action.planId,
			};
		case "set-edited-summary":
			return {
				...state,
				editedSummary: action.value,
			};
		case "set-is-editing-summary":
			return {
				...state,
				isEditingSummary: action.value,
			};
		case "start-summary":
			return {
				...state,
				editedSummary: action.summary,
				isEditingSummary: true,
			};
		default:
			return state;
	}
};

const createExerciseState = (): WorkoutPlanExerciseState => ({
	addingToDayId: null,
	removingExerciseId: null,
	swappingExerciseId: null,
});

const workoutPlanExerciseReducer = (state: WorkoutPlanExerciseState, action: WorkoutPlanExerciseAction) => {
	switch (action.type) {
		case "set-adding-day":
			return {
				...state,
				addingToDayId: action.value,
			};
		case "set-removing-exercise":
			return {
				...state,
				removingExerciseId: action.value,
			};
		case "set-swapping-exercise":
			return {
				...state,
				swappingExerciseId: action.value,
			};
		default:
			return state;
	}
};

export const useWorkoutPlanShellController = ({
	patientId,
	workoutPlans,
}: {
	patientId: string;
	workoutPlans: WorkoutPlanListItem[];
}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [planId, setPlanId] = useQueryState("plan", parseAsString);
	const [state, dispatch] = useReducer(workoutPlanShellReducer, undefined, createShellState);

	const { latestSelected, selectedPlanId } = useMemo(() => {
		const validId = planId && workoutPlans.some((workoutPlan) => workoutPlan.id === planId) ? planId : null;

		return {
			latestSelected: !validId,
			selectedPlanId: validId ?? workoutPlans[0]?.id ?? null,
		};
	}, [planId, workoutPlans]);

	const setEditedSummary = useCallback((value: string) => {
		dispatch({ type: "set-edited-summary", value });
	}, []);

	const setIsEditingSummary = useCallback((value: boolean) => {
		if (!value) {
			dispatch({ type: "close-summary" });
			return;
		}

		dispatch({ type: "set-is-editing-summary", value });
	}, []);

	const setDeletingPlanId = useCallback((value: string | null) => {
		dispatch({ type: "request-delete", planId: value });
	}, []);

	const deleteMutation = useMutation(
		trpc.workouts.deleteWorkoutPlan.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.workouts.listPatientWorkoutPlans.queryKey({ patientId }),
				});

				if (state.deletingPlanId === selectedPlanId) {
					setPlanId(null);
				}

				dispatch({ type: "request-delete", planId: null });
			},
		})
	);

	const updateSummaryMutation = useMutation(
		trpc.workouts.updateWorkoutPlanSummary.mutationOptions({
			onSuccess: () => {
				if (selectedPlanId) {
					queryClient.invalidateQueries({
						queryKey: trpc.workouts.getWorkoutPlan.queryKey({ id: selectedPlanId }),
					});
				}

				dispatch({ type: "close-summary" });
			},
		})
	);

	return {
		deleteMutation,
		deletingPlanId: state.deletingPlanId,
		editedSummary: state.editedSummary,
		isEditingSummary: state.isEditingSummary,
		latestSelected,
		planId,
		selectedPlanId,
		setDeletingPlanId,
		setEditedSummary,
		setIsEditingSummary,
		setPlanId,
		updateSummaryMutation,
	};
};

export const useWorkoutPlanExerciseController = ({
	patientId,
	selectedPlanId,
}: {
	patientId: string;
	selectedPlanId: string;
}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [state, dispatch] = useReducer(workoutPlanExerciseReducer, undefined, createExerciseState);

	const invalidatePlan = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: trpc.workouts.getWorkoutPlan.queryKey({ id: selectedPlanId }) });
		queryClient.invalidateQueries({
			queryKey: trpc.workouts.listPatientWorkoutPlans.queryKey({ patientId }),
		});
	}, [patientId, queryClient, selectedPlanId, trpc.workouts]);

	const setAddingToDayId = useCallback((value: string | null) => {
		dispatch({ type: "set-adding-day", value });
	}, []);

	const setRemovingExerciseId = useCallback((value: string | null) => {
		dispatch({ type: "set-removing-exercise", value });
	}, []);

	const setSwappingExerciseId = useCallback((value: string | null) => {
		dispatch({ type: "set-swapping-exercise", value });
	}, []);

	const addExerciseMutation = useMutation(
		trpc.workouts.addExerciseToDay.mutationOptions({
			onSuccess: () => {
				invalidatePlan();
				dispatch({ type: "set-adding-day", value: null });
			},
		})
	);

	const removeExerciseMutation = useMutation(
		trpc.workouts.removeExerciseFromDay.mutationOptions({
			onSuccess: () => {
				invalidatePlan();
				dispatch({ type: "set-removing-exercise", value: null });
			},
		})
	);

	const swapExerciseMutation = useMutation(
		trpc.workouts.updateExerciseInPlan.mutationOptions({
			onSuccess: () => {
				invalidatePlan();
				dispatch({ type: "set-swapping-exercise", value: null });
			},
		})
	);

	return {
		addExerciseMutation,
		addingToDayId: state.addingToDayId,
		removeExerciseMutation,
		removingExerciseId: state.removingExerciseId,
		setAddingToDayId,
		setRemovingExerciseId,
		setSwappingExerciseId,
		swapExerciseMutation,
		swappingExerciseId: state.swappingExerciseId,
	};
};
