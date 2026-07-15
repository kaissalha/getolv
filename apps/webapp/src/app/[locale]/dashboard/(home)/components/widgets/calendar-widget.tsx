"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { buildCalendarEventHref } from "@/lib/calendar-url-state";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@getolv/ui/components/button";

import { BaseWidget } from "./base-widget";

const GOOGLE_CALENDAR_CONNECT_URL = "/api/integrations/google-calendar/connect";

type CalendarWidgetTodayRange = {
	timeMin: string;
	timeMax: string;
};

const sortByStart = <T extends { start: { dateTime?: string; date?: string } }>(a: T, b: T) => {
	const ta = a.start.dateTime
		? new Date(a.start.dateTime).getTime()
		: a.start.date
			? new Date(`${a.start.date}T00:00:00`).getTime()
			: 0;
	const tb = b.start.dateTime
		? new Date(b.start.dateTime).getTime()
		: b.start.date
			? new Date(`${b.start.date}T00:00:00`).getTime()
			: 0;
	return ta - tb;
};

const CalendarWidgetToday = ({ timeMin, timeMax }: CalendarWidgetTodayRange) => {
	const t = useTranslations("dashboard.widgets.calendar");
	const tNoTitle = useTranslations("calendar.eventDetail");
	const trpc = useTRPC();

	const { data, isLoading } = useQuery(trpc.googleCalendar.listAllEvents.queryOptions({ timeMin, timeMax }));

	if (isLoading) return <CalendarWidgetSkeleton />;

	const sorted = [...(data?.events ?? [])].sort(sortByStart);
	const totalToday = sorted.length;
	const events = sorted.slice(0, 5);
	const fallbackTitle = tNoTitle("noTitle");

	return (
		<BaseWidget
			title={t("title")}
			icon={<CalendarIcon className='size-3.5' />}
			action={events.length > 0 ? { label: t("viewAll"), href: "/dashboard/calendar" } : undefined}
		>
			{events.length === 0 ? (
				<div className='flex flex-col items-start gap-2'>
					<p className='text-sm text-muted-foreground'>{t("empty")}</p>
					<Button type='button' variant='outline' size='sm' asChild>
						<Link href='/dashboard/calendar'>
							<PlusIcon className='size-3.5' />
							{t("goToCalendar")}
						</Link>
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-1'>
					<p className='mb-1 text-2xl font-normal text-foreground'>
						{t("eventsToday", { count: totalToday })}
					</p>
					{events.map((event) => {
						const title = event.summary ?? fallbackTitle;
						const color = event.calendarColor ?? "var(--color-primary)";
						const isAllDay = Boolean(event.start.date && !event.start.dateTime);
						const timeLabel = isAllDay
							? t("allDay")
							: event.start.dateTime
								? new Date(event.start.dateTime).toLocaleTimeString(undefined, {
										hour: "numeric",
										minute: "2-digit",
									})
								: "";

						return (
							<Link
								key={`${event.calendarId}-${event.id}`}
								href={buildCalendarEventHref({
									calendarId: event.calendarId,
									eventId: event.id,
								})}
								className='flex items-center gap-2 rounded-md md:p-1 text-sm transition-colors hover:bg-accent'
							>
								<span
									className='h-full min-h-5 w-0.5 shrink-0 rounded-full'
									style={{ backgroundColor: color }}
									aria-hidden
								/>
								<span className='w-14 shrink-0 text-xs tabular-nums text-muted-foreground'>
									{timeLabel}
								</span>
								<span className='line-clamp-1 min-w-0 flex-1 text-foreground'>{title}</span>
							</Link>
						);
					})}
				</div>
			)}
		</BaseWidget>
	);
};

const CalendarWidgetDisconnected = () => {
	const t = useTranslations("dashboard.widgets.calendar");
	const tCalendar = useTranslations("calendar");

	return (
		<BaseWidget title={t("title")} icon={<CalendarIcon className='size-3.5' />}>
			<div className='flex flex-col items-start gap-2'>
				<p className='text-sm text-muted-foreground'>{t("notConnected")}</p>
				<Button type='button' variant='outline' size='sm' asChild>
					<a href={GOOGLE_CALENDAR_CONNECT_URL}>
						<CalendarIcon className='size-3.5' />
						{tCalendar("connectButton")}
					</a>
				</Button>
			</div>
		</BaseWidget>
	);
};

export const CalendarWidget = () => {
	const trpc = useTRPC();
	const { data: status, isLoading } = useQuery(trpc.googleCalendar.getStatus.queryOptions());
	const [todayRange] = useState<CalendarWidgetTodayRange | null>(() => {
		const now = new Date();

		const start = new Date(now);
		start.setHours(0, 0, 0, 0);

		const end = new Date(start);
		end.setDate(end.getDate() + 1);

		return {
			timeMin: start.toISOString(),
			timeMax: end.toISOString(),
		};
	});

	if (isLoading) return <CalendarWidgetSkeleton />;

	if (!status?.connected) {
		return <CalendarWidgetDisconnected />;
	}

	if (!todayRange) {
		return <CalendarWidgetSkeleton />;
	}

	return <CalendarWidgetToday timeMin={todayRange.timeMin} timeMax={todayRange.timeMax} />;
};

export const CalendarWidgetSkeleton = () => {
	const t = useTranslations("dashboard.widgets.calendar");

	return (
		<BaseWidget title={t("title")} icon={<CalendarIcon className='size-3.5' />}>
			<div className='flex flex-col gap-2'>
				<div className='h-8 w-24 animate-pulse rounded bg-muted' />
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/5 animate-pulse rounded bg-muted' />
			</div>
		</BaseWidget>
	);
};
