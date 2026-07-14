"use client";

import { CALENDAR_GUTTER_WIDTH } from "../utils/calendar-utils";
import { CalendarAllDayStrip } from "./calendar-all-day-strip";
import { CalendarConnectCard } from "./calendar-connect-card";
import { CalendarEventDetailDrawer } from "./calendar-event-detail-drawer";
import { CalendarPageHeader } from "./calendar-page-header";
import { CalendarSkeleton } from "./calendar-skeleton";
import { CalendarTimeGutter } from "./calendar-time-gutter";
import { CalendarTimedGrid } from "./calendar-timed-grid";
import { CalendarWeekHeader } from "./calendar-week-header";
import { useCalendarPageController } from "./use-calendar-page-controller";

type CalendarPageClientProps = {
	initialRange: {
		timeMin: string;
		timeMax: string;
	};
};

export const CalendarPageClient = ({ initialRange }: CalendarPageClientProps) => {
	const calendar = useCalendarPageController({ initialRange });

	if (calendar.isInitialLoading) {
		return <CalendarSkeleton />;
	}

	if (!calendar.isConnected) {
		return (
			<div className='flex h-dvh w-full flex-col bg-background'>
				<CalendarConnectCard />
			</div>
		);
	}

	return (
		<div className='flex h-dvh w-full flex-col overflow-hidden bg-background'>
			<CalendarEventDetailDrawer
				event={calendar.drawerEvent}
				open={calendar.drawerOpen}
				isLoading={calendar.isDrawerLoading}
				onOpenChange={calendar.handleDrawerOpenChange}
			/>

			<CalendarPageHeader
				currentDate={calendar.currentWeekStart}
				isLoading={calendar.isFetchingEvents}
				onPrevious={calendar.handlePrevious}
				onNext={calendar.handleNext}
				onToday={calendar.handleToday}
			/>

			<div
				className='grid min-h-0 flex-1 overflow-hidden'
				style={{
					gridTemplateColumns: `${CALENDAR_GUTTER_WIDTH} minmax(0, 1fr)`,
					gridTemplateRows: "auto auto minmax(0,1fr)",
				}}
			>
				<div className='border-b border-border bg-background' style={{ gridColumnStart: 1, gridRowStart: 1 }} />
				<CalendarWeekHeader
					onHorizontalScroll={calendar.handleHorizontalScroll}
					scrollRef={calendar.headerHScrollRef}
					today={calendar.today}
					weekDays={calendar.weekDays}
				/>

				<CalendarAllDayStrip
					allDayByDay={calendar.allDayByDay}
					minHeightPx={calendar.allDayStripMinHeightPx}
					onHorizontalScroll={calendar.handleHorizontalScroll}
					onSelectEvent={calendar.handleSelectEvent}
					scrollRef={calendar.allDayHScrollRef}
					today={calendar.today}
					weekDays={calendar.weekDays}
				/>

				<CalendarTimeGutter
					onScroll={calendar.handleTimeGutterScroll}
					scrollRef={calendar.timeGutterScrollRef}
				/>
				<CalendarTimedGrid
					eventsByDay={calendar.eventsByDay}
					onHorizontalScroll={calendar.handleHorizontalScroll}
					onSelectEvent={calendar.handleSelectEvent}
					onTimedAreaScroll={calendar.handleTimedAreaScroll}
					scrollRef={calendar.scrollRef}
					today={calendar.today}
					weekDays={calendar.weekDays}
				/>
			</div>
		</div>
	);
};
