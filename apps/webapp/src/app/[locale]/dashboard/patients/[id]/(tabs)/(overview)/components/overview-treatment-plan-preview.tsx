"use client";

import dynamic from "next/dynamic";

import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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

const PdfViewer = dynamic(() => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer), {
	ssr: false,
	loading: () => <Skeleton className='h-full w-full' />,
});

export const OverviewTreatmentPlanPreview = ({
	isOpen,
	onClose,
	onDownload,
	patientName,
	pdfUrl,
}: {
	isOpen: boolean;
	onClose: () => void;
	onDownload: () => void;
	patientName: string;
	pdfUrl: string | null;
}) => {
	const tCommon = useTranslations("common");
	const tOverview = useTranslations("dashboard.patients.overview");

	return (
		<Credenza type='drawer' open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<CredenzaPortal>
				<CredenzaContent>
					<CredenzaHeader className='flex-row items-start justify-between gap-4'>
						<div className='flex flex-1 flex-col gap-1'>
							<CredenzaTitle>{tOverview("treatmentPlanTitle")}</CredenzaTitle>
							<CredenzaDescription>{patientName}</CredenzaDescription>
						</div>
						<Button variant='outline' size='sm' onClick={onDownload} disabled={!pdfUrl}>
							<DownloadIcon className='me-2 size-4' />
							{tCommon("download")}
						</Button>
					</CredenzaHeader>

					<CredenzaBody className='flex-1 max-h-full w-fit max-w-screen overflow-scroll px-0 pb-6 md:mx-auto'>
						{pdfUrl ? <PdfViewer url={pdfUrl} /> : <Skeleton className='h-[70vh] w-[min(90vw,56rem)]' />}
					</CredenzaBody>
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};
