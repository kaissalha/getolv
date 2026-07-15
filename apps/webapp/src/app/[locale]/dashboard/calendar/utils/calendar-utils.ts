import type { GoogleCalendarEvent } from "@getolv/app-store";

export const CALENDAR_CONFIG = {
	START_HOUR: 0,
	END_HOUR: 24,
	DEFAULT_START_HOUR: 8,
	HOUR_HEIGHT: 60,
	MIN_EVENT_HEIGHT: 20,
	ALL_DAY_EVENT_HEIGHT: 22,
	ALL_DAY_STACK_GAP: 2,
} as const;

export const TOTAL_HOURS = CALENDAR_CONFIG.END_HOUR - CALENDAR_CONFIG.START_HOUR;
export const TOTAL_HEIGHT = TOTAL_HOURS * CALENDAR_CONFIG.HOUR_HEIGHT;
export const CALENDAR_HOURS = Array.from({ length: TOTAL_HOURS - 1 }, (_, i) => i + 1);
export const CALENDAR_GUTTER_WIDTH = "4rem";
export const CALENDAR_TOTAL_MIN_WIDTH = "56rem";
export const CALENDAR_DAYS_MIN_WIDTH = `calc(${CALENDAR_TOTAL_MIN_WIDTH} - ${CALENDAR_GUTTER_WIDTH})`;

export type CalendarEventWithMeta = GoogleCalendarEvent & {
	calendarId: string;
	calendarName: string;
	calendarColor?: string;
};

export type EventPosition = {
	top: number;
	height: number;
	left: number;
	width: number;
};

export type PositionedEvent = {
	event: CalendarEventWithMeta;
	position: EventPosition;
};

export const getWeekStart = (date: Date): Date => {
	const d = new Date(date);
	d.setDate(d.getDate() - d.getDay());
	d.setHours(0, 0, 0, 0);
	return d;
};

const WEEKDAY_INDEX: Record<string, number> = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6,
};

const getMidnightInTimezone = ({
	year,
	month,
	day,
	timezone,
}: {
	year: number;
	month: number;
	day: number;
	timezone: string;
}): Date => {
	const utcGuessMs = Date.UTC(year, month - 1, day);
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
	const parts = Object.fromEntries(
		formatter.formatToParts(new Date(utcGuessMs)).map((part) => [part.type, part.value])
	);
	const tzHour = Number(parts.hour) === 24 ? 0 : Number(parts.hour);
	const tzAsUtcMs = Date.UTC(
		Number(parts.year),
		Number(parts.month) - 1,
		Number(parts.day),
		tzHour,
		Number(parts.minute),
		Number(parts.second)
	);
	return new Date(utcGuessMs - (tzAsUtcMs - utcGuessMs));
};

export const getCurrentWeekRangeInTimezone = ({ timezone, now = new Date() }: { timezone: string; now?: Date }) => {
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
		weekday: "short",
	});
	const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));
	const weekday = WEEKDAY_INDEX[parts.weekday] ?? 0;
	const localToday = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
	localToday.setUTCDate(localToday.getUTCDate() - weekday);

	const weekStart = getMidnightInTimezone({
		year: localToday.getUTCFullYear(),
		month: localToday.getUTCMonth() + 1,
		day: localToday.getUTCDate(),
		timezone,
	});
	const weekEnd = new Date(weekStart);
	weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

	return {
		timeMin: weekStart.toISOString(),
		timeMax: weekEnd.toISOString(),
	};
};

export const getWeekDays = (weekStart: Date): Date[] =>
	Array.from({ length: 7 }, (_, i) => {
		const d = new Date(weekStart);
		d.setDate(weekStart.getDate() + i);
		return d;
	});

export const isSameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const getLocalDateKey = (date: Date): string => {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

export const timeToPixels = (hours: number, minutes: number): number =>
	(((hours - CALENDAR_CONFIG.START_HOUR) * 60 + minutes) / 60) * CALENDAR_CONFIG.HOUR_HEIGHT;

export const formatHour = (hour: number): string => {
	if (hour === 0 || hour === 24) return "12 AM";
	if (hour === 12) return "12 PM";
	if (hour > 12) return `${hour - 12} PM`;
	return `${hour} AM`;
};

export const isAllDayEvent = (event: CalendarEventWithMeta): boolean =>
	Boolean(event.start.date && !event.start.dateTime);

const getEventTimes = (event: CalendarEventWithMeta) => {
	if (event.start.dateTime && event.end.dateTime) {
		const start = new Date(event.start.dateTime);
		const end = new Date(event.end.dateTime);
		return {
			startMinutes: start.getHours() * 60 + start.getMinutes(),
			durationMinutes: Math.round((end.getTime() - start.getTime()) / 60000),
			isAllDay: false,
		};
	}
	return { startMinutes: 0, durationMinutes: 24 * 60, isAllDay: true };
};

const eventsOverlap = (a: CalendarEventWithMeta, b: CalendarEventWithMeta): boolean => {
	const at = getEventTimes(a);
	const bt = getEventTimes(b);
	return (
		at.startMinutes < bt.startMinutes + bt.durationMinutes && bt.startMinutes < at.startMinutes + at.durationMinutes
	);
};

export const getAllDayColumnContentHeight = (eventCount: number): number => {
	if (eventCount <= 0) return 0;
	const { ALL_DAY_EVENT_HEIGHT, ALL_DAY_STACK_GAP } = CALENDAR_CONFIG;
	return eventCount * ALL_DAY_EVENT_HEIGHT + (eventCount - 1) * ALL_DAY_STACK_GAP;
};

export const calculateAllDayPositions = (events: CalendarEventWithMeta[]): PositionedEvent[] => {
	if (events.length === 0) return [];

	const sorted = [...events].sort(
		(a, b) =>
			(a.summary ?? "").localeCompare(b.summary ?? "") || a.id.localeCompare(b.id, undefined, { numeric: true })
	);

	const { ALL_DAY_EVENT_HEIGHT, ALL_DAY_STACK_GAP } = CALENDAR_CONFIG;

	return sorted.map((event, rowIdx) => ({
		event,
		position: {
			top: rowIdx * (ALL_DAY_EVENT_HEIGHT + ALL_DAY_STACK_GAP),
			height: ALL_DAY_EVENT_HEIGHT,
			left: 0,
			width: 100,
		},
	}));
};

export const calculateEventPositions = (events: CalendarEventWithMeta[]): PositionedEvent[] => {
	const timed = events.filter((e) => !getEventTimes(e).isAllDay);
	if (timed.length === 0) return [];

	const sorted = [...timed].sort((a, b) => getEventTimes(a).startMinutes - getEventTimes(b).startMinutes);

	const groups: CalendarEventWithMeta[][] = [];
	const visited = new Set<string>();

	for (const event of sorted) {
		if (visited.has(event.id)) continue;

		const group: CalendarEventWithMeta[] = [];
		const queue = [event];
		visited.add(event.id);

		while (queue.length > 0) {
			const current = queue.shift()!;
			group.push(current);
			for (const other of sorted) {
				if (!visited.has(other.id) && eventsOverlap(current, other)) {
					visited.add(other.id);
					queue.push(other);
				}
			}
		}
		groups.push(group);
	}

	const positioned: PositionedEvent[] = [];

	for (const group of groups) {
		const columns: CalendarEventWithMeta[][] = [];

		for (const event of group) {
			let placed = false;
			for (const col of columns) {
				if (col.every((other) => !eventsOverlap(event, other))) {
					col.push(event);
					placed = true;
					break;
				}
			}
			if (!placed) columns.push([event]);
		}

		const totalColumns = columns.length;
		const gap = 2;
		const totalGaps = (totalColumns - 1) * gap;
		const widthPerCol = (100 - totalGaps) / totalColumns;

		for (let colIdx = 0; colIdx < columns.length; colIdx++) {
			for (const event of columns[colIdx]) {
				const { startMinutes, durationMinutes } = getEventTimes(event);
				const hours = Math.floor(startMinutes / 60);
				const minutes = startMinutes % 60;

				positioned.push({
					event,
					position: {
						top: timeToPixels(hours, minutes),
						height: Math.max(
							(durationMinutes / 60) * CALENDAR_CONFIG.HOUR_HEIGHT,
							CALENDAR_CONFIG.MIN_EVENT_HEIGHT
						),
						left: colIdx * (widthPerCol + gap),
						width: widthPerCol,
					},
				});
			}
		}
	}

	return positioned;
};

export const getCurrentTimePosition = (): number => {
	const now = new Date();
	return timeToPixels(now.getHours(), now.getMinutes());
};

export const getDefaultTimedScrollTop = ({ events }: { events: CalendarEventWithMeta[] }) => {
	const defaultStartMinutes = CALENDAR_CONFIG.DEFAULT_START_HOUR * 60;
	const earliestStartMinutes = events
		.flatMap((event) => {
			if (!event.start.dateTime) return [];

			const start = new Date(event.start.dateTime);
			if (Number.isNaN(start.getTime())) return [];

			return [start.getHours() * 60 + start.getMinutes()];
		})
		.reduce<number | null>((earliest, startMinutes) => {
			if (earliest === null || startMinutes < earliest) {
				return startMinutes;
			}

			return earliest;
		}, null);

	const targetStartMinutes =
		earliestStartMinutes === null || earliestStartMinutes >= defaultStartMinutes
			? defaultStartMinutes
			: earliestStartMinutes;
	const paddedStartMinutes = Math.max(CALENDAR_CONFIG.START_HOUR * 60, targetStartMinutes - 15);

	return timeToPixels(Math.floor(paddedStartMinutes / 60), paddedStartMinutes % 60);
};

export const groupAllDayEventsByDay = (events: CalendarEventWithMeta[], weekDays: Date[]) => {
	const grouped: Record<string, CalendarEventWithMeta[]> = {};
	for (const day of weekDays) {
		grouped[getLocalDateKey(day)] = [];
	}

	for (const event of events) {
		if (!isAllDayEvent(event) || !event.start.date) continue;
		const startKey = event.start.date;
		const endExclusive = event.end.date
			? event.end.date
			: (() => {
					const d = new Date(`${startKey}T12:00:00`);
					d.setDate(d.getDate() + 1);
					return getLocalDateKey(d);
				})();

		for (const day of weekDays) {
			const key = getLocalDateKey(day);
			if (key >= startKey && key < endExclusive) {
				grouped[key].push(event);
			}
		}
	}

	return grouped;
};

export const groupEventsByDay = (events: CalendarEventWithMeta[], weekDays: Date[]) => {
	const grouped: Record<string, CalendarEventWithMeta[]> = {};
	for (const day of weekDays) {
		grouped[getLocalDateKey(day)] = [];
	}

	for (const event of events) {
		if (isAllDayEvent(event)) continue;

		const dateStr = event.start.dateTime
			? new Date(event.start.dateTime)
			: event.start.date
				? new Date(event.start.date + "T00:00:00")
				: null;

		if (!dateStr) continue;

		const key = getLocalDateKey(dateStr);
		if (grouped[key]) {
			grouped[key].push(event);
		}
	}

	return grouped;
};
