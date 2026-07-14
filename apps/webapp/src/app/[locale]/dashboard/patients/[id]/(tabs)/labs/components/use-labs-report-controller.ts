"use client";

import { useCallback, useMemo, useReducer } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";

import type { LabReportListItem } from "./labs-report-picker";

type LabsReportControllerState = {
	editedSummary: string;
	editingLabTestId: string | null;
	isEditingSummary: boolean;
	rangeOverridesOpen: boolean;
};

type LabsReportControllerAction =
	| { type: "close-summary" }
	| { type: "open-ranges"; labTestId: string }
	| { type: "set-edited-summary"; value: string }
	| { type: "set-range-open"; open: boolean }
	| { type: "start-summary"; summary: string };

const labsReportControllerReducer = (state: LabsReportControllerState, action: LabsReportControllerAction) => {
	switch (action.type) {
		case "close-summary":
			return {
				...state,
				editedSummary: "",
				isEditingSummary: false,
			};
		case "open-ranges":
			return {
				...state,
				editingLabTestId: action.labTestId,
				rangeOverridesOpen: true,
			};
		case "set-edited-summary":
			return {
				...state,
				editedSummary: action.value,
			};
		case "set-range-open":
			return {
				...state,
				editingLabTestId: action.open ? state.editingLabTestId : null,
				rangeOverridesOpen: action.open,
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

export const useLabsReportController = ({ labReports }: { labReports: LabReportListItem[] }) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [reportId, setReportId] = useQueryState("report", parseAsString);
	const [state, dispatch] = useReducer(
		labsReportControllerReducer,
		undefined,
		(): LabsReportControllerState => ({
			editedSummary: "",
			editingLabTestId: null,
			isEditingSummary: false,
			rangeOverridesOpen: false,
		})
	);

	const { latestSelected, selectedReportId } = useMemo(() => {
		const validId = reportId && labReports.some((report) => report.id === reportId) ? reportId : null;

		return {
			latestSelected: !validId,
			selectedReportId: validId ?? labReports[0]?.id ?? "",
		};
	}, [labReports, reportId]);

	const handleEditRanges = useCallback((labTestId: string) => {
		dispatch({ type: "open-ranges", labTestId });
	}, []);

	const handleRangeOverridesOpenChange = useCallback((open: boolean) => {
		dispatch({ type: "set-range-open", open });
	}, []);

	const setEditedSummary = useCallback((value: string) => {
		dispatch({ type: "set-edited-summary", value });
	}, []);

	const startEditingSummary = useCallback((summary: string) => {
		dispatch({ type: "start-summary", summary });
	}, []);

	const stopEditingSummary = useCallback(() => {
		dispatch({ type: "close-summary" });
	}, []);

	const updateSummaryMutation = useMutation(
		trpc.labs.updateLabReportSummary.mutationOptions({
			onSuccess: () => {
				if (selectedReportId) {
					queryClient.invalidateQueries({
						queryKey: trpc.labs.getLabReportWithResults.queryKey({ labReportId: selectedReportId }),
					});
				}

				dispatch({ type: "close-summary" });
			},
		})
	);

	return {
		editedSummary: state.editedSummary,
		editingLabTestId: state.editingLabTestId,
		handleEditRanges,
		handleRangeOverridesOpenChange,
		isEditingSummary: state.isEditingSummary,
		latestSelected,
		rangeOverridesOpen: state.rangeOverridesOpen,
		reportId,
		selectedReportId,
		setEditedSummary,
		setReportId,
		startEditingSummary,
		stopEditingSummary,
		updateSummaryMutation,
	};
};
