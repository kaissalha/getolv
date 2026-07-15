"use client";

import { useTranslations } from "next-intl";

import { CopyCardButton } from "@/app/[locale]/dashboard/patients/[id]/components/copy-card-button";
import { cn } from "@getolv/ui/lib/utils";

type IntelligenceCardProps = {
	title: string;
	icon?: React.ReactNode;
	badge?: React.ReactNode;
	loading?: boolean;
	children: React.ReactNode;
	className?: string;
	getCopyValue?: () => string;
};

export const IntelligenceCard = ({
	title,
	icon,
	badge,
	loading = false,
	children,
	className,
	getCopyValue,
}: IntelligenceCardProps) => (
	<div
		className={cn(
			"group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card p-4 transition-[background-color,box-shadow] duration-200 ease-out hover:bg-accent/40",
			className
		)}
	>
		<div className='mb-3 flex items-center justify-between'>
			<div className='flex min-w-0 items-center gap-2'>
				{icon && <span className='text-muted-foreground'>{icon}</span>}
				<h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
			</div>
			{badge || getCopyValue ? (
				<div className='flex shrink-0 items-center gap-1'>
					{badge}
					{getCopyValue ? <CopyCardButton getValue={getCopyValue} /> : null}
				</div>
			) : null}
		</div>
		<div className='min-h-0 min-w-0 flex-1 overflow-y-auto'>
			{loading ? <IntelligenceCardSkeleton /> : children}
		</div>
	</div>
);

const IntelligenceCardSkeleton = () => {
	const t = useTranslations("sessionIntelligence");

	return (
		<div className='flex flex-col gap-2'>
			<div className='h-3 w-full animate-pulse rounded bg-muted' />
			<div className='h-3 w-4/5 animate-pulse rounded bg-muted' />
			<div className='h-3 w-3/5 animate-pulse rounded bg-muted' />
			<p className='pt-1 text-sm text-muted-foreground'>{t("analyzing")}</p>
		</div>
	);
};
