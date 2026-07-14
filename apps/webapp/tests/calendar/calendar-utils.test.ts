import { describe, expect, it } from "vitest";

import {
	getDefaultTimedScrollTop,
	getWeekDays,
	groupEventsByDay,
} from "@/app/[locale]/dashboard/calendar/utils/calendar-utils";
import type { CalendarEventWithMeta } from "@/app/[locale]/dashboard/calendar/utils/calendar-utils";

type TimedEventInput = {
	end: string;
	id: string;
	start: string;
};

const createTimedEvent = ({ end, id, start }: TimedEventInput) =>
	({
		calendarId: "primary",
		calendarName: "Primary",
		end: { dateTime: end },
		id,
		start: { dateTime: start },
		summary: id,
	}) satisfies CalendarEventWithMeta;

describe("calendar utils", () => {
	describe("getDefaultTimedScrollTop", () => {
		it("defaults to padded 8am when visible timed events start later", () => {
			const events = [
				createTimedEvent({
					end: "2026-04-14T09:30:00",
					id: "standup",
					start: "2026-04-14T09:00:00",
				}),
			];

			expect(getDefaultTimedScrollTop({ events })).toBe(465);
		});

		it("starts before the earliest visible timed event when it is earlier than 8am", () => {
			const events = [
				createTimedEvent({
					end: "2026-04-14T07:30:00",
					id: "early-call",
					start: "2026-04-14T07:00:00",
				}),
			];

			expect(getDefaultTimedScrollTop({ events })).toBe(405);
		});

		it("does not let fetched but hidden overlapping events affect the visible week scroll", () => {
			const weekDays = getWeekDays(new Date("2026-04-12T00:00:00"));
			const eventsByDay = groupEventsByDay(
				[
					createTimedEvent({
						end: "2026-04-12T01:00:00",
						id: "previous-week-overlap",
						start: "2026-04-11T06:00:00",
					}),
					createTimedEvent({
						end: "2026-04-14T09:30:00",
						id: "visible-standup",
						start: "2026-04-14T09:00:00",
					}),
				],
				weekDays
			);
			const visibleTimedEvents = Object.values(eventsByDay).flat();

			expect(visibleTimedEvents.map((event) => event.id)).toEqual(["visible-standup"]);
			expect(getDefaultTimedScrollTop({ events: visibleTimedEvents })).toBe(465);
		});
	});
});
