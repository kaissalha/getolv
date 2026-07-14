"use client";

import type { ReactNode } from "react";

import { CopyCardButton } from "@/app/[locale]/dashboard/patients/[id]/components/copy-card-button";
import { Skeleton } from "@starter/ui/components/skeleton";
import { cn } from "@starter/ui/lib/utils";

type OverviewSidebarCardProps = {
	actions?: ReactNode;
	children: ReactNode;
	getCopyValue?: () => string;
	icon: ReactNode;
	title: string;
};

type OverviewSidebarCardSkeletonProps = {
	rows?: number;
};

type SectionLabelProps = {
	children: ReactNode;
};

type DetailRowProps = {
	icon: ReactNode;
	label: string;
	toneClassName?: string;
	value: ReactNode;
};

export const OverviewSidebarCard = ({ actions, children, getCopyValue, icon, title }: OverviewSidebarCardProps) => (
	<div className='group flex min-h-60 flex-col overflow-hidden rounded-sm border border-border bg-card p-4 transition-[background-color,box-shadow] duration-200 ease-out hover:bg-accent/40'>
		<div className='mb-4 flex items-center justify-between gap-3'>
			<div className='flex min-w-0 items-center gap-2'>
				<span className='text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground'>
					{icon}
				</span>
				<h3 className='truncate text-sm font-medium text-muted-foreground'>{title}</h3>
			</div>
			{getCopyValue || actions ? (
				<div className='flex shrink-0 items-center gap-1'>
					{getCopyValue ? <CopyCardButton getValue={getCopyValue} /> : null}
					{actions ? <div className='shrink-0'>{actions}</div> : null}
				</div>
			) : null}
		</div>
		<div className='flex flex-1 flex-col gap-4'>{children}</div>
	</div>
);

export const OverviewSidebarCardSkeleton = ({ rows = 3 }: OverviewSidebarCardSkeletonProps) => (
	<div className='flex min-h-60 flex-col rounded-sm border border-border bg-card p-4'>
		<div className='mb-4 flex items-center gap-2'>
			<Skeleton className='size-4 rounded-full' />
			<Skeleton className='h-4 w-24 rounded-sm' />
		</div>
		<div className='flex flex-col gap-4'>
			<div className='flex items-center gap-3'>
				<Skeleton className='size-12 rounded-full' />
				<div className='flex flex-1 flex-col gap-2'>
					<Skeleton className='h-5 w-32 rounded-sm' />
					<Skeleton className='h-4 w-24 rounded-sm' />
				</div>
			</div>
			<Skeleton className='h-px w-full' />
			<div className='flex flex-col gap-3'>
				{Array.from({ length: rows }).map((_, index) => (
					<div key={index} className='flex items-start gap-3'>
						<Skeleton className='size-7 shrink-0 rounded-full' />
						<div className='flex flex-1 flex-col gap-2 pt-1'>
							<Skeleton className='h-3 w-24 rounded-sm' />
							<Skeleton className='h-4 w-full rounded-sm' />
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

export const SectionLabel = ({ children }: SectionLabelProps) => (
	<span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>{children}</span>
);

export const DetailRow = ({ icon, label, toneClassName, value }: DetailRowProps) => (
	<div className='flex items-start gap-3 text-sm'>
		<div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/50", toneClassName)}>
			{icon}
		</div>
		<div className='flex min-w-0 flex-col gap-0.5 pt-0.5'>
			<span className='text-xs font-medium text-muted-foreground'>{label}</span>
			<div className='whitespace-pre-wrap font-medium leading-relaxed'>{value}</div>
		</div>
	</div>
);
