export const CALENDAR_ID_SEARCH_PARAM = "calendarId";
export const CALENDAR_EVENT_ID_SEARCH_PARAM = "eventId";

export const buildCalendarEventHref = ({ calendarId, eventId }: { calendarId: string; eventId: string }) =>
	`/dashboard/calendar?${CALENDAR_ID_SEARCH_PARAM}=${encodeURIComponent(calendarId)}&${CALENDAR_EVENT_ID_SEARCH_PARAM}=${encodeURIComponent(eventId)}`;
