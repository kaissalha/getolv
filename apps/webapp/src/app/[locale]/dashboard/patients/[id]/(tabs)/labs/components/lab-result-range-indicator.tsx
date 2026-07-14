"use client";

import { useMemo } from "react";

import type { PatientLabResultRanges } from "@starter/db";

const rangeStatusColor = {
	critical: "var(--destructive)",
	optimal: "var(--success)",
	suboptimal: "var(--warning)",
} as const;

type LabResultRangeIndicatorProps = {
	ranges: PatientLabResultRanges;
	value: number;
};

export const LabResultRangeIndicator = ({ ranges, value }: LabResultRangeIndicatorProps) => {
	const sortedRanges = useMemo(() => [...ranges].sort((left, right) => left.min - right.min), [ranges]);

	const { valuePosition, rangeWidths } = useMemo(() => {
		const rangeMin = Math.min(...sortedRanges.map((range) => range.min));
		const rangeMax = Math.max(...sortedRanges.map((range) => range.max));
		const rangeSpan = rangeMax - rangeMin;
		let min = rangeMin;
		let max = rangeMax;

		if (value < rangeMin) {
			min = Math.max(value, rangeMin - rangeSpan);
		}

		if (value > rangeMax) {
			max = Math.min(value, rangeMax + rangeSpan);
		}

		const totalRange = max - min;
		const position = totalRange > 0 ? ((value - min) / totalRange) * 100 : 50;
		const widths = sortedRanges.map((range) => ({
			left: totalRange > 0 ? ((range.min - min) / totalRange) * 100 : 0,
			status: range.status,
			width: totalRange > 0 ? ((range.max - range.min) / totalRange) * 100 : 33,
		}));

		return {
			rangeWidths: widths,
			valuePosition: Math.min(Math.max(position, 5), 95),
		};
	}, [sortedRanges, value]);

	return (
		<div className='relative h-2 w-full min-w-24 overflow-hidden rounded-full bg-muted'>
			{rangeWidths.map((range) => (
				<div
					key={`${range.status}-${range.left}-${range.width}`}
					className='absolute top-0 h-full'
					style={{
						backgroundColor: rangeStatusColor[range.status],
						left: `${range.left}%`,
						opacity: 0.3,
						width: `${range.width}%`,
					}}
				/>
			))}
			<div
				className='absolute top-0 h-full w-1 -translate-x-1/2 rounded-full bg-foreground'
				style={{ left: `${valuePosition}%` }}
			/>
		</div>
	);
};
