"use client";

import type { RefObject } from "react";

import { CALENDAR_DAYS_MIN_WIDTH, getLocalDateKey, TOTAL_HEIGHT } from "../utils/calendar-utils";
import type { CalendarEventWithMeta } from "../utils/calendar-utils";
import { CalendarColumn } from "./calendar-column";
import { CurrentTimeIndicator } from "./current-time-indicator";

type CalendarTimedGridProps = {
	eventsByDay: Record<string, CalendarEventWithMeta[]>;
	onHorizontalScroll: ({ source }: { source: HTMLDivElement }) => void;
	onSelectEvent: (event: CalendarEventWithMeta) => void;
	onTimedAreaScroll: () => void;
	scrollRef: RefObject<HTMLDivElement | null>;
	today: Date;
	weekDays: Date[];
};

export const CalendarTimedGrid = ({
	eventsByDay,
	onHorizontalScroll,
	onSelectEvent,
	onTimedAreaScroll,
	scrollRef,
	today,
	weekDays,
}: CalendarTimedGridProps) => {
	const todayKey = getLocalDateKey(today);

	return (
		<div
			ref={scrollRef}
			className='no-scrollbar min-h-0 min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain'
			style={{ gridColumnStart: 2, gridRowStart: 3 }}
			onScroll={(event) => {
				onTimedAreaScroll();
				onHorizontalScroll({ source: event.currentTarget });
			}}
		>
			<div className='relative' style={{ height: `${TOTAL_HEIGHT}px`, minWidth: CALENDAR_DAYS_MIN_WIDTH }}>
				<div className='grid h-full grid-cols-7'>
					{weekDays.map((day) => {
						const dayKey = getLocalDateKey(day);
						return (
							<CalendarColumn
								key={dayKey}
								events={eventsByDay[dayKey] ?? []}
								isPastDay={dayKey < todayKey}
								onEventSelect={onSelectEvent}
							/>
						);
					})}
				</div>

				{weekDays.map((day, index) => (
					<CurrentTimeIndicator
						key={`time-${day.toISOString()}`}
						day={day}
						columnCount={7}
						columnIndex={index}
						layout='dayColumnsOnly'
					/>
				))}
			</div>
		</div>
	);
};
