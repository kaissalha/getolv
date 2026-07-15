"use client";

import { useTranslations } from "next-intl";

import { cn } from "@getolv/ui/lib/utils";

import type { PositionedEvent } from "../utils/calendar-utils";

type CalendarEventProps = {
	positionedEvent: PositionedEvent;
	onSelect: (event: PositionedEvent["event"]) => void;
};

export const CalendarEvent = ({ positionedEvent, onSelect }: CalendarEventProps) => {
	const t = useTranslations("calendar.eventDetail");
	const { event, position } = positionedEvent;
	const showTime = position.height >= 28;
	const isCompact = position.height < 35;
	const color = event.calendarColor ?? "var(--color-primary)";

	const startTime = event.start.dateTime
		? new Date(event.start.dateTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
		: null;

	const title = event.summary ?? t("noTitle");

	return (
		<div
			className='absolute z-10'
			style={{
				top: `${position.top}px`,
				height: `${position.height}px`,
				left: `calc(${position.left}% + 2px)`,
				width: `calc(${position.width}% - 4px)`,
			}}
		>
			<button
				type='button'
				onClick={() => onSelect(event)}
				className={cn(
					"relative flex h-full w-full flex-col overflow-hidden rounded-sm border text-start transition-[filter,transform] duration-150 ease-out",
					"outline-hidden hover:brightness-95 active:scale-98 focus-visible:ring-2 focus-visible:ring-ring/50",
					!showTime && "justify-center",
					isCompact ? "px-1.5 py-0.5" : "px-2 py-1"
				)}
				style={{
					backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`,
					borderColor: `color-mix(in oklch, ${color} 24%, transparent)`,
				}}
			>
				<span
					aria-hidden
					className='absolute inset-y-1 start-1 w-0.5 rounded-full'
					style={{ backgroundColor: color }}
				/>
				<span className='truncate ps-1.5 text-xs font-medium leading-tight text-foreground'>{title}</span>
				{showTime && startTime && (
					<span className='truncate ps-1.5 text-xs leading-tight' style={{ color }}>
						{startTime}
					</span>
				)}
			</button>
		</div>
	);
};
