"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { CALENDAR_ID_SEARCH_PARAM, CALENDAR_EVENT_ID_SEARCH_PARAM } from "@/lib/calendar-url-state";
import { useTRPC } from "@/lib/trpc";
import { toast } from "@getolv/ui/components/sonner";

import {
	getAllDayColumnContentHeight,
	getDefaultTimedScrollTop,
	getLocalDateKey,
	getWeekDays,
	getWeekStart,
	groupAllDayEventsByDay,
	groupEventsByDay,
} from "../utils/calendar-utils";
import type { CalendarEventWithMeta } from "../utils/calendar-utils";
import { useCalendarScrollSync } from "./use-calendar-scroll-sync";

const getEventStartDate = ({ startKey }: { startKey: string }) => {
	const isAllDayKey = /^\d{4}-\d{2}-\d{2}$/.test(startKey);
	const start = isAllDayKey ? new Date(`${startKey}T12:00:00`) : new Date(startKey);

	if (Number.isNaN(start.getTime())) {
		return null;
	}

	return start;
};

type CalendarInitialRange = {
	timeMin: string;
	timeMax: string;
};

export const useCalendarPageController = ({ initialRange }: { initialRange: CalendarInitialRange }) => {
	const t = useTranslations("calendar");
	const tCommon = useTranslations("common");
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const {
		allDayHScrollRef,
		applyTimedScrollTop,
		handleHorizontalScroll,
		handleTimeGutterScroll,
		handleTimedAreaScroll,
		headerHScrollRef,
		scrollRef,
		timeGutterScrollRef,
	} = useCalendarScrollSync();

	const [currentDay, setCurrentDay] = useState<Date>(() => new Date(initialRange.timeMin));
	const [calendarId, setCalendarId] = useQueryState(CALENDAR_ID_SEARCH_PARAM, parseAsString);
	const [eventId, setEventId] = useQueryState(CALENDAR_EVENT_ID_SEARCH_PARAM, parseAsString);
	const lastAutoScrolledWeekKeyRef = useRef<string | null>(null);
	const drawerOpen = Boolean(calendarId && eventId);
	const today = useMemo(() => {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
		return currentDate;
	}, []);
	const connectStatus = searchParams.get("googleCalendarStatus");

	useEffect(() => {
		if (!connectStatus) {
			return;
		}

		if (connectStatus === "success") {
			toast.success(t("connectSuccess"));
			queryClient.invalidateQueries({ queryKey: trpc.googleCalendar.getStatus.queryKey() });
		} else {
			toast.error(t("connectFailed"));
		}

		const nextUrl = new URL(window.location.href);
		nextUrl.searchParams.delete("googleCalendarStatus");
		window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
	}, [connectStatus, queryClient, t, trpc.googleCalendar.getStatus]);

	const statusQuery = useQuery(trpc.googleCalendar.getStatus.queryOptions());
	const currentWeekStart = useMemo(() => getWeekStart(currentDay), [currentDay]);
	const currentWeekKey = getLocalDateKey(currentWeekStart);
	const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);
	const weekEnd = useMemo(() => {
		const end = new Date(currentWeekStart);
		end.setDate(end.getDate() + 7);
		return end;
	}, [currentWeekStart]);

	const eventsQuery = useQuery(
		trpc.googleCalendar.listAllEvents.queryOptions(
			{ timeMin: currentWeekStart.toISOString(), timeMax: weekEnd.toISOString() },
			{ enabled: statusQuery.data?.connected === true, placeholderData: keepPreviousData }
		)
	);

	const eventsByDay = useMemo(() => {
		const events = eventsQuery.data?.events ?? [];
		return groupEventsByDay(events, weekDays);
	}, [eventsQuery.data, weekDays]);
	const visibleTimedEvents = useMemo(() => Object.values(eventsByDay).flat(), [eventsByDay]);

	const allDayByDay = useMemo(() => {
		const events = eventsQuery.data?.events ?? [];
		return groupAllDayEventsByDay(events, weekDays);
	}, [eventsQuery.data, weekDays]);
	const defaultTimedScrollTop = useMemo(() => {
		if (!eventsQuery.data?.events) {
			return null;
		}

		return getDefaultTimedScrollTop({ events: visibleTimedEvents });
	}, [eventsQuery.data, visibleTimedEvents]);

	const hasAnyAllDay = useMemo(() => Object.values(allDayByDay).some((list) => list.length > 0), [allDayByDay]);
	const allDayStripMinHeightPx = useMemo(() => {
		const maxCount = Math.max(0, ...weekDays.map((day) => (allDayByDay[getLocalDateKey(day)] ?? []).length));
		return getAllDayColumnContentHeight(maxCount) + 8;
	}, [allDayByDay, weekDays]);

	const eventFromWeek = useMemo(() => {
		if (!calendarId || !eventId || !eventsQuery.data?.events) {
			return undefined;
		}

		return eventsQuery.data.events.find((event) => event.calendarId === calendarId && event.id === eventId);
	}, [calendarId, eventId, eventsQuery.data]);

	const detailQuery = useQuery({
		...trpc.googleCalendar.getEvent.queryOptions({ calendarId: calendarId ?? "", eventId: eventId ?? "" }),
		enabled:
			statusQuery.data?.connected === true &&
			drawerOpen &&
			Boolean(calendarId) &&
			Boolean(eventId) &&
			!eventFromWeek &&
			eventsQuery.isFetched,
	});

	const drawerEvent: CalendarEventWithMeta | null = eventFromWeek ?? detailQuery.data ?? null;
	const isDrawerLoading = drawerOpen && !drawerEvent && (detailQuery.isPending || detailQuery.isFetching);

	useEffect(() => {
		if (!detailQuery.isError) {
			return;
		}

		toast.error(tCommon("errors.somethingWentWrong"));
		void setCalendarId(null);
		void setEventId(null);
	}, [detailQuery.isError, setCalendarId, setEventId, tCommon]);

	useEffect(() => {
		const startKey = detailQuery.data?.start.dateTime ?? detailQuery.data?.start.date;

		if (!startKey) {
			return;
		}

		const start = getEventStartDate({ startKey });

		if (!start) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			const eventWeekStart = getWeekStart(start);

			setCurrentDay((previousDay) => {
				const previousWeekStart = getWeekStart(previousDay);

				if (previousWeekStart.getTime() === eventWeekStart.getTime()) {
					return previousDay;
				}

				return start;
			});
		});

		return () => {
			window.cancelAnimationFrame(frame);
		};
	}, [detailQuery.data]);

	useEffect(() => {
		if (statusQuery.data?.connected !== true || !eventsQuery.isFetched || defaultTimedScrollTop === null) {
			return;
		}

		if (lastAutoScrolledWeekKeyRef.current === currentWeekKey) {
			return;
		}

		lastAutoScrolledWeekKeyRef.current = currentWeekKey;
		applyTimedScrollTop({ top: defaultTimedScrollTop });
	}, [
		applyTimedScrollTop,
		currentWeekKey,
		defaultTimedScrollTop,
		eventsQuery.isFetched,
		statusQuery.data?.connected,
	]);

	const handlePrevious = useCallback(() => {
		setCurrentDay((previousDay) => {
			const nextDay = new Date(previousDay);
			nextDay.setDate(nextDay.getDate() - 7);
			return nextDay;
		});
	}, []);

	const handleNext = useCallback(() => {
		setCurrentDay((previousDay) => {
			const nextDay = new Date(previousDay);
			nextDay.setDate(nextDay.getDate() + 7);
			return nextDay;
		});
	}, []);

	const handleToday = useCallback(() => {
		const nextDay = new Date();
		const nextWeekKey = getLocalDateKey(getWeekStart(nextDay));

		lastAutoScrolledWeekKeyRef.current = null;
		setCurrentDay(nextDay);

		if (nextWeekKey === currentWeekKey && defaultTimedScrollTop !== null) {
			applyTimedScrollTop({ behavior: "smooth", top: defaultTimedScrollTop });
		}
	}, [applyTimedScrollTop, currentWeekKey, defaultTimedScrollTop]);

	const handleSelectEvent = useCallback(
		(event: CalendarEventWithMeta) => {
			void setCalendarId(event.calendarId);
			void setEventId(event.id);
		},
		[setCalendarId, setEventId]
	);

	const handleDrawerOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				return;
			}

			void setCalendarId(null);
			void setEventId(null);
		},
		[setCalendarId, setEventId]
	);

	return {
		allDayByDay,
		allDayHScrollRef,
		allDayStripMinHeightPx,
		currentWeekStart,
		drawerEvent,
		drawerOpen,
		eventsByDay,
		handleDrawerOpenChange,
		handleHorizontalScroll,
		handleNext,
		handlePrevious,
		handleSelectEvent,
		handleTimeGutterScroll,
		handleTimedAreaScroll,
		handleToday,
		hasAnyAllDay,
		headerHScrollRef,
		isConnected: statusQuery.data?.connected === true,
		isDrawerLoading,
		isFetchingEvents: eventsQuery.isFetching,
		isInitialLoading: statusQuery.isLoading || (statusQuery.data?.connected === true && eventsQuery.isLoading),
		scrollRef,
		timeGutterScrollRef,
		today,
		weekDays,
	};
};
