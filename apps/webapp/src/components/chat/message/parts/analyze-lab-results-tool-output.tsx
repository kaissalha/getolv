"use client";

import { FlaskConicalIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@starter/ui/components/badge";
import { Spinner } from "@starter/ui/components/spinner";

import type { AnalyzeLabResultsOutputData, LabResult } from "./tool-part-types";

export const AnalyzeLabResultsToolOutput = ({ output }: { output: AnalyzeLabResultsOutputData }) => {
	const t = useTranslations("components.chat.message.tool.labResults");

	if (!output || output.stage === "noData") {
		return null;
	}

	if (output.stage === "processing") {
		return (
			<div className='flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3'>
				<Spinner className='size-4 text-muted-foreground' />
				<span className='text-sm text-muted-foreground'>{t("analyzing")}</span>
			</div>
		);
	}

	const { labResults } = output;

	if (!labResults || labResults.length === 0) {
		return (
			<div className='flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3'>
				<FlaskConicalIcon className='size-4 text-muted-foreground' />
				<span className='text-sm text-muted-foreground'>{t("noResults")}</span>
			</div>
		);
	}

	const groupedResults = labResults.reduce<Record<string, LabResult[]>>((acc, result) => {
		const category = result.category || t("uncategorized");
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(result);
		return acc;
	}, {});

	return (
		<div className='w-full space-y-4 rounded-2xl border border-border/50 bg-muted/30 p-4'>
			<div className='flex items-center gap-2'>
				<FlaskConicalIcon className='size-4 text-muted-foreground' />
				<span className='text-sm font-medium'>{t("title")}</span>
				<Badge variant='default' size='sm'>
					{labResults.length} {t("resultsCount", { count: labResults.length })}
				</Badge>
			</div>

			<div className='space-y-4'>
				{Object.entries(groupedResults).map(([category, results]) => (
					<div key={category} className='space-y-2'>
						<h4 className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							{category}
						</h4>
						<div className='grid gap-2 bg-background/50'>
							{results.map((result) => (
								<LabResultItem
									key={`${result.category}-${result.name}-${result.value}-${result.unit}`}
									result={result}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const LabResultItem = ({ result }: { result: LabResult }) => {
	return (
		<div className='flex items-center justify-between rounded-lg px-3 py-2'>
			<div className='flex items-center gap-3'>
				<span className='text-sm font-medium'>{result.name}</span>
				<Badge variant={result.status} size='sm'>
					{result.status}
				</Badge>
			</div>
			<div className='text-end'>
				<span className='text-sm font-medium'>
					{result.value} {result.unit}
				</span>
			</div>
		</div>
	);
};
