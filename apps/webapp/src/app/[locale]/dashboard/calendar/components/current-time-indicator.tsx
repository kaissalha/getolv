"use client";

import { useEffect, useState } from "react";

import { CALENDAR_GUTTER_WIDTH, getCurrentTimePosition, isSameDay } from "../utils/calendar-utils";

type CurrentTimeIndicatorProps = {
	day: Date;
	columnCount: number;
	columnIndex: number;
	/** Use when the indicator sits inside the day-column area only (time gutter is a sibling). */
	layout?: "withTimeGutter" | "dayColumnsOnly";
};

export const CurrentTimeIndicator = ({
	day,
	columnCount,
	columnIndex,
	layout = "withTimeGutter",
}: CurrentTimeIndicatorProps) => {
	const [position, setPosition] = useState(() => getCurrentTimePosition());
	const isVisible = isSameDay(day, new Date());

	useEffect(() => {
		if (!isVisible) return;

		const update = () => setPosition(getCurrentTimePosition());
		update();
		const interval = setInterval(update, 60000);
		return () => clearInterval(interval);
	}, [isVisible]);

	if (!isVisible) return null;

	const columnGeometry = (() => {
		switch (layout) {
			case "dayColumnsOnly":
				return {
					left: `calc(100% / ${columnCount} * ${columnIndex})`,
					width: `calc(100% / ${columnCount})`,
				};
			case "withTimeGutter":
				return {
					left: `calc(${CALENDAR_GUTTER_WIDTH} + (100% - ${CALENDAR_GUTTER_WIDTH}) / ${columnCount} * ${columnIndex})`,
					width: `calc((100% - ${CALENDAR_GUTTER_WIDTH}) / ${columnCount})`,
				};
			default:
				return layout satisfies never;
		}
	})();

	return (
		<div
			className='pointer-events-none absolute z-30'
			style={{
				top: `${position}px`,
				left: columnGeometry.left,
				width: columnGeometry.width,
			}}
		>
			<div className='absolute -start-1.5 -top-1.5 size-3 rounded-full bg-destructive shadow-sm' />
			<div className='h-0.5 w-full bg-destructive shadow-sm' />
		</div>
	);
};
