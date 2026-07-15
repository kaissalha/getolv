"use client";

import { useCallback, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { useLogger } from "@getolv/logger/client";
import { toast } from "@getolv/ui/components/sonner";

import { usePdfBlobPreview } from "../../components/use-pdf-blob-preview";

type TreatmentPlanPreviewDocument = {
	base64: string;
	filename: string;
	sessionId: string;
};

export const useOverviewTreatmentPlanPreview = ({ patientId }: { patientId: string }) => {
	const tCommon = useTranslations("common");
	const tOverview = useTranslations("dashboard.patients.overview");
	const trpc = useTRPC();
	const logger = useLogger();
	const { closePreview, downloadPdf, isPreviewOpen, openPreview, pdfUrl } = usePdfBlobPreview();
	const [previewDocument, setPreviewDocument] = useState<TreatmentPlanPreviewDocument | null>(null);
	const [previewingSessionId, setPreviewingSessionId] = useState<string | null>(null);
	const generateTreatmentPlanPdfMutation = useMutation(
		trpc.treatmentPlans.generateTreatmentPlanPdf.mutationOptions()
	);

	const handleCloseTreatmentPlanPreview = useCallback(() => {
		closePreview();
		setPreviewDocument(null);
	}, [closePreview]);

	const handleDownloadTreatmentPlan = useCallback(() => {
		if (!previewDocument) {
			return;
		}

		downloadPdf(previewDocument);
	}, [downloadPdf, previewDocument]);

	const handlePreviewTreatmentPlan = useCallback(
		async ({ sessionId }: { sessionId: string }) => {
			try {
				setPreviewingSessionId(sessionId);
				const pdf = await generateTreatmentPlanPdfMutation.mutateAsync({
					patientId,
					sessionId,
				});

				setPreviewDocument({
					base64: pdf.base64,
					filename: pdf.filename,
					sessionId,
				});
				openPreview({
					base64: pdf.base64,
					filename: pdf.filename,
				});
			} catch (error) {
				logger.error({
					error,
					message: "Failed to generate treatment plan PDF from overview timeline",
					metadata: {
						patientId,
						sessionId,
					},
				});
				toast.error(tOverview("treatmentPlanPreviewError"), {
					description: error instanceof Error ? error.message : tCommon("errors.somethingWentWrong"),
				});
			} finally {
				setPreviewingSessionId((currentSessionId) =>
					currentSessionId === sessionId ? null : currentSessionId
				);
			}
		},
		[generateTreatmentPlanPdfMutation, logger, openPreview, patientId, tCommon, tOverview]
	);

	return {
		handleCloseTreatmentPlanPreview,
		handleDownloadTreatmentPlan,
		handlePreviewTreatmentPlan,
		isPreviewOpen,
		pdfUrl,
		previewingSessionId,
	};
};
