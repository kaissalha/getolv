"use client";

import { useMemo } from "react";

import { cn } from "@starter/ui/lib/utils";

import type { CalendarEventWithMeta } from "../utils/calendar-utils";
import { calculateEventPositions, CALENDAR_CONFIG, TOTAL_HEIGHT } from "../utils/calendar-utils";
import { CalendarEvent } from "./calendar-event";

type CalendarColumnProps = {
	events: CalendarEventWithMeta[];
	isPastDay: boolean;
	onEventSelect: (event: CalendarEventWithMeta) => void;
};

export const CalendarColumn = ({ events, isPastDay, onEventSelect }: CalendarColumnProps) => {
	const positionedEvents = useMemo(() => calculateEventPositions(events), [events]);

	return (
		<div
			className={cn("relative border-e border-border bg-background last:border-e-0", isPastDay && "bg-muted/25")}
			style={{ height: `${TOTAL_HEIGHT}px` }}
		>
			{Array.from({ length: TOTAL_HEIGHT / CALENDAR_CONFIG.HOUR_HEIGHT }).map((_, i) => (
				<div
					key={`hour-${i}`}
					className='absolute inset-inline-0 border-b border-border/50'
					style={{ top: `${i * CALENDAR_CONFIG.HOUR_HEIGHT}px`, height: `${CALENDAR_CONFIG.HOUR_HEIGHT}px` }}
				/>
			))}

			{Array.from({ length: TOTAL_HEIGHT / CALENDAR_CONFIG.HOUR_HEIGHT }).map((_, i) => (
				<div
					key={`half-${i}`}
					className='absolute inset-inline-0 border-b border-dashed border-border/30'
					style={{ top: `${i * CALENDAR_CONFIG.HOUR_HEIGHT + CALENDAR_CONFIG.HOUR_HEIGHT / 2}px` }}
				/>
			))}

			{positionedEvents.map((pe) => (
				<CalendarEvent
					key={`${pe.event.calendarId}-${pe.event.id}`}
					positionedEvent={pe}
					onSelect={onEventSelect}
				/>
			))}
		</div>
	);
};
