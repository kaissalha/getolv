"use client";

import { useCallback, useMemo, useReducer } from "react";

import { useParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import { useLogger } from "@getolv/logger/client";

import { usePdfBlobPreview } from "../../components/use-pdf-blob-preview";

type LabsHeaderActionsState = {
	isAddNoteOpen: boolean;
	noteText: string;
};

type LabsHeaderActionsAction =
	| { type: "close-add-note" }
	| { type: "open-add-note" }
	| { type: "set-note-text"; value: string };

const createInitialState = (): LabsHeaderActionsState => ({
	isAddNoteOpen: false,
	noteText: "",
});

const labsHeaderActionsReducer = (state: LabsHeaderActionsState, action: LabsHeaderActionsAction) => {
	switch (action.type) {
		case "close-add-note":
			return {
				...state,
				isAddNoteOpen: false,
				noteText: "",
			};
		case "open-add-note":
			return {
				...state,
				isAddNoteOpen: true,
			};
		case "set-note-text":
			return {
				...state,
				noteText: action.value,
			};
		default:
			return state;
	}
};

export const useLabsHeaderActionsController = () => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [reportId] = useQueryState("report", parseAsString);
	const [state, dispatch] = useReducer(labsHeaderActionsReducer, undefined, createInitialState);
	const logger = useLogger();
	const { closePreview, downloadPdf, isPreviewOpen, openPreview, pdfUrl } = usePdfBlobPreview();

	const { data: patient, isLoading: isPatientLoading } = useQuery(trpc.patients.get.queryOptions({ id: patientId }));
	const { data: labReports, isLoading: isLabReportsLoading } = useQuery(
		trpc.labs.getPatientLabReports.queryOptions({ patientId })
	);

	const selectedReportId = useMemo(() => {
		if (!reportId || !labReports?.some((report) => report.id === reportId)) {
			return labReports?.[0]?.id ?? null;
		}

		return reportId;
	}, [labReports, reportId]);

	const generatePdfMutation = useMutation(
		trpc.labs.generateLabResultsPdf.mutationOptions({
			onError: (error) => {
				logger.error({
					error,
					message: "Failed to generate lab results PDF",
					metadata: {
						patientId,
					},
				});
			},
		})
	);

	const analyzeLabResultsMutation = useMutation(
		trpc.labs.analyzeLabResultsFromText.mutationOptions({
			onError: (error) => {
				logger.error({
					error,
					message: "Failed to analyze lab results",
					metadata: {
						patientId,
					},
				});
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: trpc.labs.getPatientLabReports.queryKey({ patientId }) });
				dispatch({ type: "close-add-note" });
			},
		})
	);

	const loadPdf = useCallback(async () => {
		if (!selectedReportId) {
			return null;
		}

		return generatePdfMutation.mutateAsync({
			labReportId: selectedReportId,
			patientId,
		});
	}, [generatePdfMutation, patientId, selectedReportId]);

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

	const openAddNote = useCallback(() => {
		dispatch({ type: "open-add-note" });
	}, []);

	const handleCloseAddNote = useCallback(() => {
		if (analyzeLabResultsMutation.isPending) {
			return;
		}

		dispatch({ type: "close-add-note" });
	}, [analyzeLabResultsMutation.isPending]);

	const setNoteText = useCallback((value: string) => {
		dispatch({ type: "set-note-text", value });
	}, []);

	const trimmedNoteText = state.noteText.trim();

	const handleSubmitNote = useCallback(() => {
		if (!trimmedNoteText) {
			return;
		}

		analyzeLabResultsMutation.mutate({
			patientId,
			text: trimmedNoteText,
		});
	}, [analyzeLabResultsMutation, patientId, trimmedNoteText]);

	return {
		analyzeLabResultsMutation,
		closePreview,
		generatePdfMutation,
		handleCloseAddNote,
		handleDownloadPdf,
		handlePreviewPdf,
		handleSubmitNote,
		isAddNoteOpen: state.isAddNoteOpen,
		isLoading: isPatientLoading || isLabReportsLoading,
		isPreviewOpen,
		noteText: state.noteText,
		openAddNote,
		patient,
		pdfUrl,
		selectedReportId,
		setNoteText,
		trimmedNoteText,
	};
};
