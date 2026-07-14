"use client";

import { StethoscopeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	formatCopyCard,
	formatDiagnosisEntryForCopy,
	joinCopySections,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import { cn } from "@starter/ui/lib/utils";

import { IntelligenceCard } from "./intelligence-card";
import type { DiagnosisEntry } from "./types";

type DiagnosisCardProps = {
	workingDx: DiagnosisEntry[];
	differentialDx: DiagnosisEntry[];
	loading?: boolean;
};

export const DiagnosisCard = ({ workingDx, differentialDx, loading }: DiagnosisCardProps) => {
	const t = useTranslations("sessionIntelligence");

	const hasContent = workingDx.length > 0 || differentialDx.length > 0;
	const getCopyValue = () => {
		const workingEntries = workingDx.reduce<string[]>((items, entry) => {
			const formattedEntry = formatDiagnosisEntryForCopy({
				entry,
				labels: {
					evidence: t("evidence"),
					missing: t("missing"),
					reasoning: t("reasoning"),
					verifyNext: t("verifyNext"),
				},
			});

			if (formattedEntry) {
				items.push(formattedEntry);
			}

			return items;
		}, []);
		const differentialEntries = differentialDx.reduce<string[]>((items, entry) => {
			const formattedEntry = formatDiagnosisEntryForCopy({
				entry,
				labels: {
					evidence: t("evidence"),
					missing: t("missing"),
					reasoning: t("reasoning"),
					verifyNext: t("verifyNext"),
				},
			});

			if (formattedEntry) {
				items.push(formattedEntry);
			}

			return items;
		}, []);

		return formatCopyCard({
			title: t("diagnosis"),
			sections: [
				workingEntries.length > 0
					? joinCopySections({
							sections: [t("workingDx"), workingEntries.join("\n")],
						})
					: null,
				differentialEntries.length > 0
					? joinCopySections({
							sections: [t("differentialDx"), differentialEntries.join("\n")],
						})
					: null,
				workingEntries.length === 0 && differentialEntries.length === 0 ? t("noDiagnoses") : null,
			],
		});
	};

	return (
		<IntelligenceCard
			title={t("diagnosis")}
			icon={<StethoscopeIcon className='size-4' />}
			loading={loading}
			className='h-full min-h-0 w-full'
			getCopyValue={getCopyValue}
		>
			{hasContent ? (
				<div className='flex flex-col gap-2'>
					{workingDx.map((entry) => (
						<DiagnosisRow key={entry.name} entry={entry} badge={t("workingDx")} tone='working' />
					))}
					{differentialDx.map((entry) => (
						<DiagnosisRow key={entry.name} entry={entry} badge={t("differentialDx")} tone='differential' />
					))}
				</div>
			) : (
				<p className='text-sm text-muted-foreground'>{t("noDiagnoses")}</p>
			)}
		</IntelligenceCard>
	);
};

const BADGE_TONE_CLASS = {
	working: "bg-destructive/12 text-destructive ring-1 ring-destructive/25",
	differential: "bg-info/12 text-info-foreground ring-1 ring-info/25",
} as const;

const DiagnosisRow = ({
	entry,
	badge,
	tone,
}: {
	entry: DiagnosisEntry;
	badge: string;
	tone: keyof typeof BADGE_TONE_CLASS;
}) => (
	<div className='flex flex-col gap-0.5'>
		<div className='flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5'>
			<p className='min-w-0 text-sm font-medium'>{entry.name}</p>
			<span
				className={cn(
					"shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase leading-none",
					BADGE_TONE_CLASS[tone]
				)}
			>
				{badge}
			</span>
		</div>
		{entry.reasoning && <p className='text-sm leading-snug text-muted-foreground'>{entry.reasoning}</p>}
	</div>
);
