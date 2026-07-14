"use client";

import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";

import type { PatientLabResultWithStatus } from "@starter/db";
import { Badge } from "@starter/ui/components/badge";
import { Frame, FrameHeader, FrameHeading, FrameIcon, FramePanel, FrameTitle } from "@starter/ui/components/frame";
import { Masonry } from "@starter/ui/components/masonry";

import { LabResultCard } from "./lab-result-card";

type LabsResultsGridProps = {
	labResults: PatientLabResultWithStatus[];
	onEditRanges: (labTestId: string) => void;
};

export const LabsResultsGrid = ({ labResults, onEditRanges }: LabsResultsGridProps) => {
	const t = useTranslations("dashboard.patients.labs");

	const groupedResults = Object.values(
		labResults.reduce<
			Record<
				string,
				{
					category: string;
					criticalCount: number;
					optimalCount: number;
					results: PatientLabResultWithStatus[];
					suboptimalCount: number;
				}
			>
		>((groups, result) => {
			const category = result.category || t("uncategorized");
			const group = groups[category] ?? {
				category,
				criticalCount: 0,
				optimalCount: 0,
				results: [],
				suboptimalCount: 0,
			};

			group.results.push(result);

			if (result.status === "critical") {
				group.criticalCount += 1;
			}
			if (result.status === "optimal") {
				group.optimalCount += 1;
			}
			if (result.status === "suboptimal") {
				group.suboptimalCount += 1;
			}

			groups[category] = group;
			return groups;
		}, {})
	).toSorted((left, right) => right.criticalCount - left.criticalCount);

	return (
		<Masonry minColumnWidth={320} gap={16}>
			{groupedResults.map(({ category, criticalCount, optimalCount, results, suboptimalCount }) => (
				<Frame key={category}>
					<FrameHeader className='flex-row items-start justify-between gap-4'>
						<FrameHeading>
							<FrameIcon>
								<FlaskConical className='h-4 w-4' />
							</FrameIcon>
							<FrameTitle className='shrink-0'>{category}</FrameTitle>
						</FrameHeading>
						<div className='flex flex-wrap justify-end gap-1.5'>
							{criticalCount > 0 && (
								<Badge variant='critical' size='sm' className='whitespace-nowrap'>
									{t("critical", { count: criticalCount })}
								</Badge>
							)}
							{suboptimalCount > 0 && (
								<Badge variant='suboptimal' size='sm' className='whitespace-nowrap'>
									{t("suboptimal", { count: suboptimalCount })}
								</Badge>
							)}
							{optimalCount > 0 && (
								<Badge variant='optimal' size='sm' className='whitespace-nowrap'>
									{t("optimal", { count: optimalCount })}
								</Badge>
							)}
						</div>
					</FrameHeader>
					<FramePanel className='flex flex-col divide-y p-0!'>
						{results
							.toSorted((left, right) => {
								const statusOrder = { critical: 0, suboptimal: 1, optimal: 2 };
								return statusOrder[left.status] - statusOrder[right.status];
							})
							.map((result) => (
								<LabResultCard key={result.id} result={result} onEditRanges={onEditRanges} />
							))}
					</FramePanel>
				</Frame>
			))}
		</Masonry>
	);
};
