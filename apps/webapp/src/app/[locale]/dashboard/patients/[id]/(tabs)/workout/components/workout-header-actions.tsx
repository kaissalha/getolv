"use client";

import dynamic from "next/dynamic";

import { Download, Eye, Sparkles, Wand2 } from "lucide-react";
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

import { useWorkoutHeaderActionsController } from "./use-workout-header-actions-controller";

const PdfViewer = dynamic(() => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer), {
	ssr: false,
	loading: () => <Skeleton className='h-full w-full' />,
});

export const WorkoutHeaderActionsSkeleton = () => (
	<div className='ms-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-2'>
		<Skeleton className='h-8 w-30 rounded-md' />
		<Skeleton className='h-8 w-28 rounded-md' />
		<Skeleton className='h-8 w-22 rounded-md' />
		<Skeleton className='h-8 w-24 rounded-md' />
	</div>
);

export const WorkoutHeaderActions = () => {
	const t = useTranslations("dashboard.patients.workout");
	const {
		closePreview,
		contextText,
		editInstructions,
		editPlanWithAiMutation,
		generatePdfMutation,
		generatePlanMutation,
		handleCloseEditWithAi,
		handleCloseGenerate,
		handleDownloadPdf,
		handlePreviewPdf,
		handleSubmitEditWithAi,
		handleSubmitGenerate,
		isEditWithAiOpen,
		isGenerateOpen,
		isLoading,
		isPreviewOpen,
		openEditWithAi,
		openGenerate,
		patient,
		pdfUrl,
		selectedPlanId,
		setContextText,
		setEditInstructions,
		trimmedEditInstructions,
	} = useWorkoutHeaderActionsController();

	if (isLoading) {
		return <WorkoutHeaderActionsSkeleton />;
	}

	return (
		<>
			<div className='ms-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-2'>
				<Button size='sm' onClick={openGenerate}>
					<Sparkles className='me-2 size-4' />
					<span className='hidden md:inline'>{t("generatePlan")}</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={openEditWithAi}
					disabled={!selectedPlanId}
					title={t("editPlanWithAi")}
				>
					<Wand2 className='me-2 size-4' />
					<span className='hidden md:inline'>{t("editPlanWithAi")}</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={handlePreviewPdf}
					disabled={generatePdfMutation.isPending || !selectedPlanId}
					title={t("preview")}
				>
					<Eye className='size-4 md:me-2' />
					<span className='hidden md:inline'>{t("preview")}</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={handleDownloadPdf}
					disabled={generatePdfMutation.isPending || !selectedPlanId}
					title={generatePdfMutation.isPending ? t("generating") : t("download")}
				>
					<Download className='size-4 md:me-2' />
					<span className='hidden md:inline'>
						{generatePdfMutation.isPending ? t("generating") : t("download")}
					</span>
				</Button>
			</div>

			<Credenza open={isGenerateOpen} onOpenChange={(open) => !open && handleCloseGenerate()}>
				<CredenzaPortal>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>{t("generatePlanTitle")}</CredenzaTitle>
							<CredenzaDescription>{t("generatePlanDescription")}</CredenzaDescription>
						</CredenzaHeader>

						<CredenzaBody>
							<Textarea
								value={contextText}
								onChange={(e) => setContextText(e.target.value)}
								placeholder={t("generatePlanPlaceholder")}
								className='min-h-40'
								disabled={generatePlanMutation.isPending}
							/>
						</CredenzaBody>

						<CredenzaFooter>
							<Button
								variant='outline'
								onClick={handleCloseGenerate}
								disabled={generatePlanMutation.isPending}
							>
								{t("cancel")}
							</Button>
							<Button onClick={handleSubmitGenerate} disabled={generatePlanMutation.isPending}>
								<Sparkles className='me-2 size-4' />
								{generatePlanMutation.isPending ? t("generating2") : t("generate")}
							</Button>
						</CredenzaFooter>
					</CredenzaContent>
				</CredenzaPortal>
			</Credenza>

			<Credenza open={isEditWithAiOpen} onOpenChange={(open) => !open && handleCloseEditWithAi()}>
				<CredenzaPortal>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>{t("editPlanTitle")}</CredenzaTitle>
							<CredenzaDescription>{t("editPlanDescription")}</CredenzaDescription>
						</CredenzaHeader>

						<CredenzaBody>
							<Textarea
								value={editInstructions}
								onChange={(e) => setEditInstructions(e.target.value)}
								placeholder={t("editPlanPlaceholder")}
								className='min-h-40'
								disabled={editPlanWithAiMutation.isPending}
							/>
						</CredenzaBody>

						<CredenzaFooter>
							<Button
								variant='outline'
								onClick={handleCloseEditWithAi}
								disabled={editPlanWithAiMutation.isPending}
							>
								{t("cancel")}
							</Button>
							<Button
								onClick={handleSubmitEditWithAi}
								disabled={
									editPlanWithAiMutation.isPending || !trimmedEditInstructions || !selectedPlanId
								}
							>
								<Wand2 className='me-2 size-4' />
								{editPlanWithAiMutation.isPending ? t("revisingPlan") : t("applyEdits")}
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
								<CredenzaTitle>Workout Plan</CredenzaTitle>
								<CredenzaDescription>
									{patient?.firstName} {patient?.lastName}
								</CredenzaDescription>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={handleDownloadPdf}
								disabled={generatePdfMutation.isPending || !selectedPlanId}
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
