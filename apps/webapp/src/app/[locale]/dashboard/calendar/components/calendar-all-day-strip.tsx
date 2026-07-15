"use client";

import type { RefObject } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@getolv/ui/lib/utils";

import { CALENDAR_DAYS_MIN_WIDTH, calculateAllDayPositions, getLocalDateKey } from "../utils/calendar-utils";
import type { CalendarEventWithMeta } from "../utils/calendar-utils";
import { CalendarEvent } from "./calendar-event";

type CalendarAllDayStripProps = {
	allDayByDay: Record<string, CalendarEventWithMeta[]>;
	minHeightPx: number;
	onHorizontalScroll: ({ source }: { source: HTMLDivElement }) => void;
	onSelectEvent: (event: CalendarEventWithMeta) => void;
	scrollRef: RefObject<HTMLDivElement | null>;
	today: Date;
	weekDays: Date[];
};

export const CalendarAllDayStrip = ({
	allDayByDay,
	minHeightPx,
	onHorizontalScroll,
	onSelectEvent,
	scrollRef,
	today,
	weekDays,
}: CalendarAllDayStripProps) => {
	const t = useTranslations("calendar.eventDetail");
	const expandedRowMinHeight = Math.max(44, minHeightPx);
	const todayKey = getLocalDateKey(today);

	return (
		<>
			<div
				className='flex min-h-8 items-center justify-end border-e border-b border-border bg-background pe-2'
				style={{ gridColumnStart: 1, gridRowStart: 2 }}
			>
				<span className='whitespace-nowrap text-xs font-medium text-muted-foreground'>{t("allDay")}</span>
			</div>
			<div
				ref={scrollRef}
				className='no-scrollbar min-h-0 min-w-0 overflow-x-auto overscroll-x-contain border-b border-border bg-background'
				style={{ gridColumnStart: 2, gridRowStart: 2 }}
				onScroll={(event) => onHorizontalScroll({ source: event.currentTarget })}
			>
				<div
					className='grid grid-cols-7'
					style={{ minHeight: `${expandedRowMinHeight}px`, minWidth: CALENDAR_DAYS_MIN_WIDTH }}
				>
					{weekDays.map((day) => {
						const dayKey = getLocalDateKey(day);
						const allDayEvents = allDayByDay[dayKey] ?? [];
						const isPastDay = dayKey < todayKey;

						return (
							<div
								key={`allday-${dayKey}`}
								className={cn(
									"relative border-e border-border last:border-e-0",
									isPastDay && "bg-muted/25"
								)}
							>
								{calculateAllDayPositions(allDayEvents).map((positionedEvent) => (
									<CalendarEvent
										key={`allday-${positionedEvent.event.calendarId}-${positionedEvent.event.id}-${dayKey}`}
										positionedEvent={positionedEvent}
										onSelect={onSelectEvent}
									/>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};
