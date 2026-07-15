"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@getolv/ui/components/tooltip";

type LabResultHistoryEntry = {
	createdAt: string;
	value: number;
};

type LabResultSparklineProps = {
	history: LabResultHistoryEntry[];
};

const labResultSparklineWidth = 60;
const labResultSparklineHeight = 20;
const labResultSparklinePadding = 2;

const LabResultSparkline = ({ history }: LabResultSparklineProps) => {
	if (history.length < 2) {
		return null;
	}

	const values = history.toReversed().map((entry) => entry.value);
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min || 1;
	const lastValue = values[values.length - 1];
	const drawableWidth = labResultSparklineWidth - 2 * labResultSparklinePadding;
	const drawableHeight = labResultSparklineHeight - 2 * labResultSparklinePadding;
	const points = values
		.map((value, index) => {
			const x = labResultSparklinePadding + (index / (values.length - 1)) * drawableWidth;
			const y = labResultSparklineHeight - labResultSparklinePadding - ((value - min) / range) * drawableHeight;
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<svg width={labResultSparklineWidth} height={labResultSparklineHeight} className='opacity-60'>
			<polyline
				points={points}
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<circle
				cx={labResultSparklineWidth - labResultSparklinePadding}
				cy={labResultSparklineHeight - labResultSparklinePadding - ((lastValue - min) / range) * drawableHeight}
				r='2'
				fill='currentColor'
			/>
		</svg>
	);
};

export const LabResultTrend = ({ history }: LabResultSparklineProps) => {
	const t = useTranslations("dashboard.patients.labs");

	if (history.length < 2) {
		return null;
	}

	const currentValue = history[0].value;
	const previousValue = history[1].value;
	const percentChange = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
	const TrendIcon = percentChange > 0 ? TrendingUp : percentChange < 0 ? TrendingDown : Minus;
	const trendColor =
		percentChange > 5 ? "text-destructive" : percentChange < -5 ? "text-success" : "text-muted-foreground";

	return (
		<div className='flex items-center gap-2'>
			<LabResultSparkline history={history} />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger
						render={
							<div className={`flex cursor-default items-center gap-1 ${trendColor}`}>
								<TrendIcon className='size-3.5' />
								<span className='text-xs font-medium'>{Math.abs(percentChange).toFixed(1)}%</span>
							</div>
						}
					/>
					<TooltipContent>
						<p className='text-xs'>
							{t("previousValue")}: {previousValue} ({history.length} {t("readings")})
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
