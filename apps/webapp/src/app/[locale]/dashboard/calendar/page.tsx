import { Suspense } from "react";

import { getQueryClient, HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";
import { getTimezone } from "@getolv/server";

import { CalendarPageClient } from "./components/calendar-page-client";
import { CalendarSkeleton } from "./components/calendar-skeleton";
import { getCurrentWeekRangeInTimezone } from "./utils/calendar-utils";

export default async function CalendarPage() {
	const timezone = await getTimezone();
	const initialRange = getCurrentWeekRangeInTimezone({ timezone });
	const queryClient = getQueryClient();

	const status = await queryClient.fetchQuery(trpcServer.googleCalendar.getStatus.queryOptions());

	if (status.connected) {
		prefetch(trpcServer.googleCalendar.listAllEvents.queryOptions(initialRange));
	}

	return (
		<HydrateClient>
			<Suspense fallback={<CalendarSkeleton />}>
				<CalendarPageClient initialRange={initialRange} />
			</Suspense>
		</HydrateClient>
	);
}
