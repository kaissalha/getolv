"use client";

import type { RefObject, UIEventHandler } from "react";

import { CALENDAR_CONFIG, CALENDAR_HOURS, formatHour, TOTAL_HEIGHT } from "../utils/calendar-utils";

type CalendarTimeGutterProps = {
	onScroll: UIEventHandler<HTMLDivElement>;
	scrollRef: RefObject<HTMLDivElement | null>;
};

export const CalendarTimeGutter = ({ onScroll, scrollRef }: CalendarTimeGutterProps) => (
	<div
		ref={scrollRef}
		className='no-scrollbar min-h-0 overflow-y-auto border-e border-border bg-background'
		style={{ gridColumnStart: 1, gridRowStart: 3 }}
		onScroll={onScroll}
	>
		<div className='pointer-events-none relative' style={{ height: `${TOTAL_HEIGHT}px` }}>
			{CALENDAR_HOURS.map((hour) => (
				<div
					key={hour}
					className='absolute end-0 flex items-start justify-end pe-2'
					style={{ top: `${hour * CALENDAR_CONFIG.HOUR_HEIGHT}px` }}
				>
					<span className='-mt-2 text-xs font-medium text-muted-foreground'>{formatHour(hour)}</span>
				</div>
			))}
		</div>
	</div>
);
