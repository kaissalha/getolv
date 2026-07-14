"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { useLogger } from "@starter/logger/client";
import { Button } from "@starter/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@starter/ui/components/credenza";
import { Skeleton } from "@starter/ui/components/skeleton";
import { toast } from "@starter/ui/components/sonner";
import { Spinner } from "@starter/ui/components/spinner";

import { usePdfBlobPreview } from "../../patients/[id]/(tabs)/components/use-pdf-blob-preview";

const treatmentPlanCoverStripPositions = ["50% 18%", "50% 33%", "50% 48%", "50% 65%", "50% 83%"];
const treatmentPlanPreviewPatientName = "John Doe";
const treatmentPlanPreviewDateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

const PdfViewer = dynamic(() => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer), {
	ssr: false,
	loading: () => <Skeleton className='h-full w-full' />,
});

const TreatmentPlanCoverPreview = () => {
	const t = useTranslations("dashboard.template.gallery.preview");
	const previewDate = treatmentPlanPreviewDateFormatter.format(new Date());

	return (
		<div
			aria-hidden
			className='pointer-events-none absolute inset-0 overflow-hidden text-white'
			style={{ backgroundColor: "#c2c6bb" }}
		>
			<div className='absolute inset-x-0 top-[9.5%] h-px bg-white/95' />
			<div className='absolute inset-x-0 bottom-[9.5%] h-px bg-white/95' />

			<div className='flex h-full flex-col items-center px-[9.5%] pt-[20%] pb-[13%]'>
				<span className='text-xs tracking-widest'>{previewDate}</span>

				<div className='mt-[7%] flex flex-col items-center'>
					<span className='font-display text-4xl leading-none tracking-wide uppercase'>
						{t("titleLine1")}
					</span>
					<span className='font-display text-4xl leading-none tracking-wide uppercase'>
						{t("titleLine2")}
					</span>
				</div>

				<div className='mt-[6.5%] flex w-[49%] flex-col gap-1'>
					{treatmentPlanCoverStripPositions.map((position) => (
						<div key={position} className='relative h-9 overflow-hidden'>
							<Image
								src='/template-previews/treatment-plan-cover-pears.jpg'
								alt=''
								fill
								sizes='140px'
								className='object-cover'
								style={{ objectPosition: position }}
							/>
						</div>
					))}
				</div>

				<span className='mt-[7.5%] text-xs tracking-widest uppercase'>{treatmentPlanPreviewPatientName}</span>
			</div>
		</div>
	);
};

export const TemplateGallery = () => {
	const t = useTranslations("dashboard.template.gallery");
	const trpc = useTRPC();
	const logger = useLogger();

	const { closePreview, downloadPdf, isPreviewOpen, openPreview, pdfUrl } = usePdfBlobPreview();

	const generatePreviewMutation = useMutation(
		trpc.templates.generateTreatmentPlanPreview.mutationOptions({
			onError: (error) => {
				const errorMessage = error.message.trim();
				const detail = errorMessage.length > 0 ? error.message : t("errors.previewFailedGeneric");
				logger.error({
					error,
					message: "Failed to generate treatment plan preview",
					metadata: { detail },
				});
				if (process.env.NODE_ENV === "development") {
					// DevTools: full tRPC / stack for PDF render failures
					// eslint-disable-next-line no-console
					console.error("[templates.generateTreatmentPlanPreview]", error);
				}
				toast.error(t("errors.previewFailed"), { description: detail });
			},
			onSuccess: ({ base64 }) => {
				openPreview({ base64 });
			},
		})
	);

	const handleOpenPreview = () => {
		if (generatePreviewMutation.isPending) {
			return;
		}

		generatePreviewMutation.mutate();
	};

	const handleDownload = async () => {
		try {
			const result = await generatePreviewMutation.mutateAsync();
			downloadPdf({ base64: result.base64, filename: result.filename });
		} catch {
			// `mutationOptions.onError` already logs and shows a toast
		}
	};

	return (
		<section className='mt-10'>
			<header className='mb-4 flex flex-col gap-1'>
				<h2 className='text-base font-semibold text-foreground'>{t("heading")}</h2>
				<p className='text-sm text-muted-foreground'>{t("subheading")}</p>
			</header>

			<button
				type='button'
				onClick={handleOpenPreview}
				aria-label={t("openPreview")}
				className='group inline-flex flex-col gap-3 text-start outline-none'
			>
				<div
					className='relative overflow-hidden rounded-xl bg-stone-100 shadow-sm ring-1 ring-black/5 transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background'
					style={{ width: 280, aspectRatio: "210 / 297" }}
				>
					<TreatmentPlanCoverPreview />
					{generatePreviewMutation.isPending && (
						<div className='absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm'>
							<Spinner className='size-8 text-black/60' />
						</div>
					)}
					<div className='absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/55 via-black/20 to-transparent px-4 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
						<span className='text-xs font-medium text-white'>{t("openPreview")}</span>
						<span className='text-xs font-medium text-white/85'>{t("pdf")}</span>
					</div>
				</div>
				<div className='flex flex-col px-0.5'>
					<span className='text-sm font-medium text-foreground'>{t("treatmentPlan")}</span>
					<span className='text-xs text-muted-foreground'>{t("treatmentPlanDescription")}</span>
				</div>
			</button>

			<Credenza type='drawer' open={isPreviewOpen} onOpenChange={(open) => !open && closePreview()}>
				<CredenzaPortal>
					<CredenzaContent>
						<CredenzaHeader className='flex-row items-start justify-between gap-4'>
							<div className='flex flex-1 flex-col gap-1'>
								<CredenzaTitle>{t("treatmentPlan")}</CredenzaTitle>
								<CredenzaDescription>{t("treatmentPlanDescription")}</CredenzaDescription>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={handleDownload}
								disabled={generatePreviewMutation.isPending}
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
		</section>
	);
};
