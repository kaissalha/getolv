"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import type { PatientLabResultWithStatus } from "@getolv/db";
import { Badge } from "@getolv/ui/components/badge";

import { LabResultRangeIndicator } from "./lab-result-range-indicator";
import { LabResultTrend } from "./lab-result-trend";

type LabResultCardProps = {
	result: PatientLabResultWithStatus;
	onEditRanges?: (labTestId: string) => void;
};

export const LabResultCard = ({ result, onEditRanges }: LabResultCardProps) => {
	const { id: patientId } = useParams<{ id: string }>();
	const t = useTranslations("dashboard.patients.labs");
	const trpc = useTRPC();
	const optimalRange = result.ranges.find((r) => r.status === "optimal");

	const { data: history = [] } = useQuery({
		...trpc.labs.getLabTestHistory.queryOptions({
			patientId,
			labTestId: result.labTestId,
		}),
		enabled: !!result.labTestId,
	});

	const handleEditClick = () => {
		if (result.labTestId && onEditRanges) {
			onEditRanges(result.labTestId);
		}
	};

	return (
		<div className='group/card relative flex flex-col gap-2 px-4 py-3'>
			{result.labTestId && onEditRanges && (
				<button
					type='button'
					onClick={handleEditClick}
					className='absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-lg bg-background/50 opacity-0 transition-opacity group-hover/card:opacity-100'
				>
					<span className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
						<Pencil className='size-4' />
						{t("editRanges")}
					</span>
				</button>
			)}

			<div className='flex items-start justify-between gap-4'>
				<div className='flex min-w-0 flex-1 flex-col gap-0.5'>
					<div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
						<span className='text-sm font-medium'>{result.name}</span>
						<Badge
							variant={result.status}
							size='sm'
							className='h-5 shrink-0 px-1.5 text-xs uppercase tracking-wider'
						>
							{result.status}
						</Badge>
					</div>
					{optimalRange && (
						<span className='text-xs text-muted-foreground'>
							{t("optimalRange")} {optimalRange.min} - {optimalRange.max} {result.unit}
						</span>
					)}
				</div>
				<div className='flex flex-col items-end gap-1'>
					<div className='flex flex-wrap items-baseline justify-end gap-1'>
						<span className='text-lg font-semibold tabular-nums'>{result.value}</span>
						<span className='text-xs text-muted-foreground'>{result.unit}</span>
					</div>
					{history.length > 1 && <LabResultTrend history={history} />}
				</div>
			</div>
			<LabResultRangeIndicator value={result.value} ranges={result.ranges} />
		</div>
	);
};
