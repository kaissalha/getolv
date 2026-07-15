"use client";

import { FileTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyCardButton } from "@/app/[locale]/dashboard/patients/[id]/components/copy-card-button";
import { formatCopyCard } from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import type { RouterOutput } from "@getolv/server";
import { Skeleton } from "@getolv/ui/components/skeleton";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type PatientSummaryCardProps = {
	patient: PatientDetails;
};

export const PatientSummaryCardSkeleton = () => (
	<div className='overflow-hidden rounded-sm border border-border bg-card p-5'>
		<div className='flex items-start gap-3'>
			<Skeleton className='mt-0.5 size-9 rounded-full' />
			<div className='flex min-w-0 flex-1 flex-col gap-2'>
				<Skeleton className='h-4 w-32 rounded-sm' />
				<Skeleton className='h-3 w-72 max-w-full rounded-sm' />
			</div>
		</div>
		<div className='mt-5 flex flex-col gap-2'>
			<Skeleton className='h-4 w-full rounded-sm' />
			<Skeleton className='h-4 w-full rounded-sm' />
			<Skeleton className='h-4 w-11/12 rounded-sm' />
		</div>
	</div>
);

export const PatientSummaryCard = ({ patient }: PatientSummaryCardProps) => {
	const tOverview = useTranslations("dashboard.patients.overview");
	const summary = patient.summary?.trim();
	const getCopyValue = () =>
		formatCopyCard({
			title: tOverview("patientSummaryTitle"),
			sections: [summary ?? tOverview("patientSummaryPlaceholder")],
		});

	return (
		<section className='group overflow-hidden rounded-sm border border-border bg-card p-5 transition-[background-color,box-shadow] duration-200 ease-out hover:bg-accent/20'>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex min-w-0 items-start gap-3'>
					<div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/55 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground'>
						<FileTextIcon className='size-4' />
					</div>
					<div className='min-w-0 flex-1'>
						<h2 className='text-sm font-medium text-muted-foreground'>
							{tOverview("patientSummaryTitle")}
						</h2>
						<p className='mt-1 text-sm text-muted-foreground'>{tOverview("patientSummaryDescription")}</p>
					</div>
				</div>
				<CopyCardButton getValue={getCopyValue} />
			</div>
			<div className='mt-5'>
				{summary ? (
					<p className='max-w-5xl whitespace-pre-wrap text-sm leading-7 text-foreground/90'>{summary}</p>
				) : (
					<p className='max-w-3xl text-sm leading-7 text-muted-foreground'>
						{tOverview("patientSummaryPlaceholder")}
					</p>
				)}
			</div>
		</section>
	);
};
