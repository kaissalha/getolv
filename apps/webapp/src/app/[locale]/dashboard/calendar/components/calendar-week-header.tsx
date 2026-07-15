"use client";

import type { RefObject } from "react";

import { useLocale } from "next-intl";

import { cn } from "@getolv/ui/lib/utils";

import { CALENDAR_DAYS_MIN_WIDTH, getLocalDateKey, isSameDay } from "../utils/calendar-utils";

type CalendarWeekHeaderProps = {
	onHorizontalScroll: ({ source }: { source: HTMLDivElement }) => void;
	scrollRef: RefObject<HTMLDivElement | null>;
	today: Date;
	weekDays: Date[];
};

export const CalendarWeekHeader = ({ onHorizontalScroll, scrollRef, today, weekDays }: CalendarWeekHeaderProps) => {
	const locale = useLocale();

	return (
		<div
			ref={scrollRef}
			className='no-scrollbar min-h-0 min-w-0 overflow-x-auto overscroll-x-contain border-b border-border bg-background'
			style={{ gridColumnStart: 2, gridRowStart: 1 }}
			onScroll={(event) => onHorizontalScroll({ source: event.currentTarget })}
		>
			<div className='grid grid-cols-7' style={{ minWidth: CALENDAR_DAYS_MIN_WIDTH }}>
				{weekDays.map((day) => {
					const dayKey = getLocalDateKey(day);
					const dayName = day.toLocaleDateString(locale, { weekday: "short" });
					const dayNum = day.getDate();
					const isToday = isSameDay(day, today);

					return (
						<div key={dayKey} className='flex h-11 items-center justify-center gap-1.5 px-2'>
							<span
								className={cn(
									"text-sm font-medium",
									isToday ? "text-foreground" : "text-muted-foreground"
								)}
							>
								{dayName}
							</span>
							<span
								className={cn(
									"flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm font-medium tabular-nums",
									isToday ? "bg-destructive text-destructive-foreground" : "text-muted-foreground"
								)}
							>
								{dayNum}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
