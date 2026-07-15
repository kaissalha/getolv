"use client";

import dynamic from "next/dynamic";

import { Download, Eye, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@getolv/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@getolv/ui/components/credenza";
import { Skeleton } from "@getolv/ui/components/skeleton";
import { Textarea } from "@getolv/ui/components/textarea";

import { useLabsHeaderActionsController } from "./use-labs-header-actions-controller";

const PdfViewer = dynamic(() => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer), {
	ssr: false,
	loading: () => <Skeleton className='h-full w-full' />,
});

export const LabsHeaderActionsSkeleton = () => (
	<div className='ms-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-2'>
		<Skeleton className='h-8 w-28 rounded-md' />
		<Skeleton className='h-8 w-22 rounded-md' />
		<Skeleton className='h-8 w-24 rounded-md' />
	</div>
);

export const LabsHeaderActions = () => {
	const t = useTranslations("dashboard.patients.labs");
	const {
		analyzeLabResultsMutation,
		closePreview,
		generatePdfMutation,
		handleCloseAddNote,
		handleDownloadPdf,
		handlePreviewPdf,
		handleSubmitNote,
		isAddNoteOpen,
		isLoading,
		isPreviewOpen,
		noteText,
		openAddNote,
		patient,
		pdfUrl,
		selectedReportId,
		setNoteText,
		trimmedNoteText,
	} = useLabsHeaderActionsController();

	if (isLoading) {
		return <LabsHeaderActionsSkeleton />;
	}

	return (
		<>
			<div className='ms-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-2'>
				<Button size='sm' onClick={openAddNote}>
					<Plus className='me-2 size-4' />
					<span className='hidden md:inline'>{t("addLabNote")}</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={handlePreviewPdf}
					disabled={generatePdfMutation.isPending || !selectedReportId}
					title={t("preview")}
				>
					<Eye className='size-4 md:me-2' />
					<span className='hidden md:inline'>{t("preview")}</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={handleDownloadPdf}
					disabled={generatePdfMutation.isPending || !selectedReportId}
					title={generatePdfMutation.isPending ? t("generating") : t("download")}
				>
					<Download className='size-4 md:me-2' />
					<span className='hidden md:inline'>
						{generatePdfMutation.isPending ? t("generating") : t("download")}
					</span>
				</Button>
			</div>

			<Credenza open={isAddNoteOpen} onOpenChange={(open) => !open && handleCloseAddNote()}>
				<CredenzaPortal>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>{t("addLabNoteTitle")}</CredenzaTitle>
							<CredenzaDescription>{t("addLabNoteDescription")}</CredenzaDescription>
						</CredenzaHeader>

						<CredenzaBody>
							<Textarea
								value={noteText}
								onChange={(e) => setNoteText(e.target.value)}
								placeholder={t("addLabNotePlaceholder")}
								className='min-h-50'
								disabled={analyzeLabResultsMutation.isPending}
							/>
						</CredenzaBody>

						<CredenzaFooter>
							<Button variant='outline' onClick={handleCloseAddNote}>
								{t("cancel")}
							</Button>
							<Button
								onClick={handleSubmitNote}
								disabled={!trimmedNoteText || analyzeLabResultsMutation.isPending}
							>
								{analyzeLabResultsMutation.isPending ? t("analyzing") : t("analyze")}
							</Button>
						</CredenzaFooter>
					</CredenzaContent>
				</CredenzaPortal>
			</Credenza>

			<Credenza type='drawer' open={isPreviewOpen} onOpenChange={(open) => !open && closePreview()}>
				<CredenzaPortal>
					<CredenzaContent>
						<CredenzaHeader className='flex-row items-start justify-between gap-4'>
							<div className='flex flex-1 flex-col gap-1'>
								<CredenzaTitle>{t("labResults")}</CredenzaTitle>
								<CredenzaDescription>
									{patient?.firstName} {patient?.lastName}
								</CredenzaDescription>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={handleDownloadPdf}
								disabled={generatePdfMutation.isPending || !selectedReportId}
							>
								<Download className='me-2 size-4' />
								{t("download")}
							</Button>
						</CredenzaHeader>

						<CredenzaBody className='flex-1 overflow-scroll pb-6 px-0 md:mx-auto w-fit max-w-screen max-h-full'>
							{pdfUrl && <PdfViewer url={pdfUrl} />}
						</CredenzaBody>
					</CredenzaContent>
				</CredenzaPortal>
			</Credenza>
		</>
	);
};
