import { type ReactNode, Suspense } from "react";

import { HydrateClient } from "@/lib/server/react-query";

import { CalendarWidget, CalendarWidgetSkeleton } from "./widgets/calendar-widget";
import { DailySummaryWidget, DailySummaryWidgetSkeleton } from "./widgets/daily-summary-widget";
import { MailWidget, MailWidgetSkeleton } from "./widgets/mail-widget";
import { NotesWidget, NotesWidgetSkeleton } from "./widgets/notes-widget";
import { PatientsWidget, PatientsWidgetSkeleton } from "./widgets/patients-widget";
import { WidgetStaggerWrapper } from "./widgets/widget-stagger-wrapper";

export const DashboardWidgetGrid = ({ children }: { children: ReactNode }) => (
	<div className='grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4'>{children}</div>
);

export const Widgets = () => {
	return (
		<HydrateClient>
			<DashboardWidgetGrid>
				<WidgetStaggerWrapper index={0} className='md:col-span-2 xl:col-span-2'>
					<Suspense fallback={<DailySummaryWidgetSkeleton />}>
						<DailySummaryWidget />
					</Suspense>
				</WidgetStaggerWrapper>
				<WidgetStaggerWrapper index={1}>
					<Suspense fallback={<PatientsWidgetSkeleton />}>
						<PatientsWidget />
					</Suspense>
				</WidgetStaggerWrapper>
				<WidgetStaggerWrapper index={2}>
					<Suspense fallback={<NotesWidgetSkeleton />}>
						<NotesWidget />
					</Suspense>
				</WidgetStaggerWrapper>
				<WidgetStaggerWrapper index={3}>
					<Suspense fallback={<MailWidgetSkeleton />}>
						<MailWidget />
					</Suspense>
				</WidgetStaggerWrapper>
				<WidgetStaggerWrapper index={4}>
					<Suspense fallback={<CalendarWidgetSkeleton />}>
						<CalendarWidget />
					</Suspense>
				</WidgetStaggerWrapper>
			</DashboardWidgetGrid>
		</HydrateClient>
	);
};
