import { Output, generateText } from "ai";
import { and, desc, eq, gte, lt } from "drizzle-orm";

import { models } from "@starter/ai/models";
import {
	buildDailySummaryActionsPrompt,
	buildDailySummaryStoryPrompt,
	buildDailySummarySummaryPrompt,
	buildDailySummaryTitlePrompt,
	dailySummaryActionsOutputSchema,
	type DailySummaryPromptInput,
} from "@starter/ai/prompts";
import { db, notes } from "@starter/db";
import { dailySummaries } from "@starter/db/schema";
import { logger } from "@starter/logger/server";

import { getCalendarConnection, listAllCalendarEvents } from "./google-calendar";
import { getMailConnection, listMailThreads, readInitialMailThreadListPage, type MailThreadListPage } from "./mail";

const TEXT_PREVIEW_MAX_LENGTH = 220;

type SummaryRangeInput = {
	end: string;
	label: string;
	mailAfter: string;
	mailBefore: string;
	start: string;
};

type DailySummaryInput = {
	organizationId: string;
	now?: Date;
	userId: string;
};

type SummarySourceData = {
	calendarEvents: Awaited<ReturnType<typeof listAllCalendarEvents>>["events"];
	mailThreads: MailThreadListPage["threads"];
	missingSources: Array<"calendar" | "mail">;
	notes: Array<{
		body: string;
		id: string;
		updatedAt: string;
	}>;
};

export type DailySummaryContent = {
	actions: string[];
	story: string;
	summary: string;
	title: string;
};

export type DailySummaryResult = {
	content: DailySummaryContent;
	counts: {
		calendar: number;
		mail: number;
		notes: number;
	};
	missingConnections: Array<"calendar" | "mail">;
	missingSources: Array<"calendar" | "mail">;
	needsConnection: boolean;
	period: "day" | "week";
	periodLabel: string;
	range: {
		end: string;
		start: string;
	};
	usedWeeklyFallback: boolean;
};

type PersistedDailySummary = typeof dailySummaries.$inferSelect;

const normalizeText = ({ maxLength, text }: { maxLength: number; text: string | null | undefined }) => {
	if (!text) {
		return null;
	}

	const normalized = text
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!normalized) {
		return null;
	}

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, maxLength - 1)}...`;
};

const parseTime = ({ value }: { value: string | undefined }) => {
	if (!value) {
		return 0;
	}

	const time = new Date(value).getTime();
	return Number.isNaN(time) ? 0 : time;
};

const getGmailUtcDate = ({ date }: { date: Date }) => {
	return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
};

const getUtcDateLabel = ({ date }: { date: Date }) =>
	new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		timeZone: "UTC",
		year: "numeric",
	}).format(date);

export const getDailySummaryRanges = ({ now = new Date() }: { now?: Date } = {}) => {
	const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const dayEnd = new Date(dayStart);
	dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

	const weekStart = new Date(dayStart);
	const daysSinceMonday = (weekStart.getUTCDay() + 6) % 7;
	weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);

	const weekEnd = new Date(weekStart);
	weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

	return {
		day: {
			end: dayEnd.toISOString(),
			label: getUtcDateLabel({ date: dayStart }),
			mailAfter: getGmailUtcDate({ date: dayStart }),
			mailBefore: getGmailUtcDate({ date: dayEnd }),
			start: dayStart.toISOString(),
		},
		week: {
			end: weekEnd.toISOString(),
			label: `${getUtcDateLabel({ date: weekStart })} - ${getUtcDateLabel({
				date: new Date(weekEnd.getTime() - 1),
			})}`,
			mailAfter: getGmailUtcDate({ date: weekStart }),
			mailBefore: getGmailUtcDate({ date: weekEnd }),
			start: weekStart.toISOString(),
		},
	};
};

const sortCalendarEvents = (events: Awaited<ReturnType<typeof listAllCalendarEvents>>["events"]) => {
	return [...events].sort((eventA, eventB) => {
		const eventATime = parseTime({ value: eventA.start.dateTime ?? eventA.start.date });
		const eventBTime = parseTime({ value: eventB.start.dateTime ?? eventB.start.date });
		return eventATime - eventBTime;
	});
};

const hasSourceData = ({ calendarEvents, mailThreads, notes: sourceNotes }: SummarySourceData) => {
	return calendarEvents.length + mailThreads.length + sourceNotes.length > 0;
};

const mapPersistedSummary = ({ summary }: { summary: PersistedDailySummary }): DailySummaryResult => {
	return {
		content: summary.content,
		counts: summary.sourceCounts,
		missingConnections: [],
		missingSources: summary.missingSources,
		needsConnection: false,
		period: summary.period,
		periodLabel: summary.periodLabel,
		range: {
			end: summary.rangeEnd,
			start: summary.rangeStart,
		},
		usedWeeklyFallback: summary.period === "week",
	};
};

const getSummaryConnectionState = async ({ organizationId, userId }: { organizationId: string; userId: string }) => {
	const [calendarConnection, mailConnection] = await Promise.all([
		getCalendarConnection({ organizationId }),
		getMailConnection({ organizationId, userId }),
	]);
	const missingConnections: DailySummaryResult["missingConnections"] = [];

	if (!calendarConnection) {
		missingConnections.push("calendar");
	}

	if (!mailConnection) {
		missingConnections.push("mail");
	}

	return {
		calendarConnection,
		mailConnection,
		missingConnections,
	};
};

const getConnectionRequiredSummary = ({
	missingConnections,
	range,
}: {
	missingConnections: DailySummaryResult["missingConnections"];
	range: SummaryRangeInput;
}): DailySummaryResult => ({
	content: {
		actions: [],
		story: "",
		summary: "Connect Google Calendar and Gmail to generate your daily summary.",
		title: "Connect sources",
	},
	counts: {
		calendar: 0,
		mail: 0,
		notes: 0,
	},
	missingConnections,
	missingSources: missingConnections,
	needsConnection: true,
	period: "day",
	periodLabel: range.label,
	range: {
		end: range.end,
		start: range.start,
	},
	usedWeeklyFallback: false,
});

const getPersistedDailySummary = async ({
	organizationId,
	period,
	range,
	userId,
}: {
	organizationId: string;
	period: DailySummaryResult["period"];
	range: SummaryRangeInput;
	userId: string;
}) => {
	const [summary] = await db
		.select()
		.from(dailySummaries)
		.where(
			and(
				eq(dailySummaries.organizationId, organizationId),
				eq(dailySummaries.userId, userId),
				eq(dailySummaries.period, period),
				eq(dailySummaries.rangeStart, range.start),
				eq(dailySummaries.rangeEnd, range.end)
			)
		)
		.limit(1);

	return summary ? mapPersistedSummary({ summary }) : null;
};

const persistDailySummary = async ({
	content,
	data,
	organizationId,
	period,
	range,
	userId,
}: {
	content: DailySummaryContent;
	data: SummarySourceData;
	organizationId: string;
	period: DailySummaryResult["period"];
	range: SummaryRangeInput;
	userId: string;
}) => {
	const sourceCounts = {
		calendar: data.calendarEvents.length,
		mail: data.mailThreads.length,
		notes: data.notes.length,
	};
	const now = new Date().toISOString();
	const [summary] = await db
		.insert(dailySummaries)
		.values({
			content,
			missingSources: data.missingSources,
			organizationId,
			period,
			periodLabel: range.label,
			rangeEnd: range.end,
			rangeStart: range.start,
			sourceCounts,
			userId,
		})
		.onConflictDoUpdate({
			target: [
				dailySummaries.organizationId,
				dailySummaries.userId,
				dailySummaries.period,
				dailySummaries.rangeStart,
				dailySummaries.rangeEnd,
			],
			set: {
				content,
				missingSources: data.missingSources,
				periodLabel: range.label,
				sourceCounts,
				updatedAt: now,
			},
		})
		.returning();

	return summary ? mapPersistedSummary({ summary }) : null;
};

const readCalendarEvents = async ({ organizationId, range }: { organizationId: string; range: SummaryRangeInput }) => {
	try {
		const connection = await getCalendarConnection({ organizationId });

		if (!connection) {
			return {
				events: [],
				missing: true,
			};
		}

		const { events } = await listAllCalendarEvents({
			organizationId,
			timeMax: range.end,
			timeMin: range.start,
		});

		return {
			events: sortCalendarEvents(events).slice(0, 10),
			missing: false,
		};
	} catch (error) {
		logger.warn({
			error,
			message: "Failed to read calendar events for daily summary",
			metadata: {
				organizationId,
				periodLabel: range.label,
			},
		});

		return {
			events: [],
			missing: true,
		};
	}
};

const readMailThreads = async ({
	organizationId,
	range,
	userId,
}: {
	organizationId: string;
	range: SummaryRangeInput;
	userId: string;
}) => {
	try {
		const connection = await getMailConnection({ organizationId, userId });

		if (!connection) {
			return {
				missing: true,
				threads: [],
			};
		}

		const page = await readInitialMailThreadListPage({
			stream: listMailThreads({
				connectionId: connection.id,
				folder: "all",
				maxResults: 10,
				organizationId,
				query: `after:${range.mailAfter} before:${range.mailBefore}`,
			}),
		});

		return {
			missing: false,
			threads: page?.threads ?? [],
		};
	} catch (error) {
		logger.warn({
			error,
			message: "Failed to read mail threads for daily summary",
			metadata: {
				organizationId,
				periodLabel: range.label,
			},
		});

		return {
			missing: true,
			threads: [],
		};
	}
};

const readNotes = async ({ organizationId, range }: { organizationId: string; range: SummaryRangeInput }) => {
	return db
		.select({
			body: notes.body,
			id: notes.id,
			updatedAt: notes.updatedAt,
		})
		.from(notes)
		.where(
			and(
				eq(notes.organizationId, organizationId),
				gte(notes.updatedAt, range.start),
				lt(notes.updatedAt, range.end)
			)
		)
		.orderBy(desc(notes.updatedAt))
		.limit(10);
};

const readSourceData = async ({
	organizationId,
	range,
	userId,
}: {
	organizationId: string;
	range: SummaryRangeInput;
	userId: string;
}): Promise<SummarySourceData> => {
	const [calendarResult, mailResult, noteRows] = await Promise.all([
		readCalendarEvents({ organizationId, range }),
		readMailThreads({ organizationId, range, userId }),
		readNotes({ organizationId, range }),
	]);

	const missingSources: SummarySourceData["missingSources"] = [];

	if (calendarResult.missing) {
		missingSources.push("calendar");
	}

	if (mailResult.missing) {
		missingSources.push("mail");
	}

	return {
		calendarEvents: calendarResult.events,
		mailThreads: mailResult.threads,
		missingSources,
		notes: noteRows,
	};
};

const buildCalendarBlock = ({ events }: { events: Awaited<ReturnType<typeof listAllCalendarEvents>>["events"] }) => {
	const lines = events.flatMap((event) => {
		const title = normalizeText({ maxLength: 120, text: event.summary }) ?? "Untitled event";
		const start = event.start.dateTime ?? event.start.date ?? "No start time";
		const attendees = event.attendees?.length ? `, ${event.attendees.length} attendees` : "";
		const location = normalizeText({ maxLength: 80, text: event.location });

		return [`- ${start}: ${title} (${event.calendarName}${attendees}${location ? `, ${location}` : ""})`];
	});

	return lines.length ? lines.join("\n") : "No calendar events found.";
};

const buildMailBlock = ({ threads }: { threads: MailThreadListPage["threads"] }) => {
	const lines = threads.flatMap((thread) => {
		const subject = normalizeText({ maxLength: 120, text: thread.subject }) ?? "No subject";
		const snippet = normalizeText({ maxLength: TEXT_PREVIEW_MAX_LENGTH, text: thread.snippet });
		const senderName = thread.sender.name?.trim();
		const sender = senderName && senderName !== thread.sender.email ? senderName : thread.sender.email;
		const state = thread.isUnread ? "unread" : "read";
		const label = thread.classificationLabel?.name ? `, ${thread.classificationLabel.name}` : "";

		return [
			`- ${thread.receivedOn}: ${subject} from ${sender} (${state}${label})${snippet ? ` - ${snippet}` : ""}`,
		];
	});

	return lines.length ? lines.join("\n") : "No mail threads found.";
};

const buildNotesBlock = ({ sourceNotes }: { sourceNotes: SummarySourceData["notes"] }) => {
	const lines = sourceNotes.flatMap((note) => {
		const body = normalizeText({ maxLength: TEXT_PREVIEW_MAX_LENGTH, text: note.body });

		return body ? [`- ${note.updatedAt}: ${body}`] : [];
	});

	return lines.length ? lines.join("\n") : "No notes found.";
};

const buildPromptInput = ({
	data,
	period,
	range,
}: {
	data: SummarySourceData;
	period: DailySummaryResult["period"];
	range: SummaryRangeInput;
}): DailySummaryPromptInput => ({
	calendarBlock: buildCalendarBlock({ events: data.calendarEvents }),
	mailBlock: buildMailBlock({ threads: data.mailThreads }),
	notesBlock: buildNotesBlock({ sourceNotes: data.notes }),
	periodLabel: range.label,
	periodType: period,
	sourceCounts: {
		calendar: data.calendarEvents.length,
		mail: data.mailThreads.length,
		notes: data.notes.length,
	},
});

const getFallbackContent = ({
	input,
	period,
}: {
	input: DailySummaryPromptInput;
	period: DailySummaryResult["period"];
}): DailySummaryContent => {
	const periodCopy = period === "day" ? "today" : "this week";
	const hasCalendar = input.sourceCounts.calendar > 0;
	const hasMail = input.sourceCounts.mail > 0;
	const hasNotes = input.sourceCounts.notes > 0;

	if (!hasCalendar && !hasMail && !hasNotes) {
		return {
			actions: ["Connect calendar or Gmail, or add notes to build a richer summary"],
			story: `No practice activity was found ${periodCopy}`,
			summary: `No calendar events, mail threads, or notes were found ${periodCopy}. Once those sources have activity, this summary will highlight the most important schedule, inbox, and note context for the practice.`,
			title: `No activity found ${periodCopy}`,
		};
	}

	const sourceParts = [
		hasCalendar ? `${input.sourceCounts.calendar} calendar events` : null,
		hasMail ? `${input.sourceCounts.mail} mail threads` : null,
		hasNotes ? `${input.sourceCounts.notes} notes` : null,
	].filter((part): part is string => Boolean(part));

	return {
		actions: ["Review the source items that need follow-up before the next patient block"],
		story: "Start with the source that has the clearest follow-up signal",
		summary: `The summary found ${sourceParts.join(", ")} ${periodCopy}. Review the calendar, mail, and notes together so scheduling context, inbox follow-ups, and documentation stay connected.`,
		title: `${input.periodLabel} has practice activity to review`,
	};
};

const generateDailySummaryContent = async ({
	input,
	period,
}: {
	input: DailySummaryPromptInput;
	period: DailySummaryResult["period"];
}) => {
	try {
		const [titleResult, summaryResult, storyResult, actionsResult] = await Promise.all([
			generateText({
				model: models.fast.model,
				prompt: buildDailySummaryTitlePrompt(input),
				temperature: 0.3,
			}),
			generateText({
				model: models.fast.model,
				prompt: buildDailySummarySummaryPrompt(input),
				temperature: 0.3,
			}),
			generateText({
				model: models.fast.model,
				prompt: buildDailySummaryStoryPrompt(input),
				temperature: 0.4,
			}),
			generateText({
				model: models.fast.model,
				output: Output.object({
					schema: dailySummaryActionsOutputSchema,
				}),
				prompt: buildDailySummaryActionsPrompt(input),
				temperature: 0.2,
			}),
		]);

		return {
			actions: actionsResult.output?.actions ?? [],
			story: storyResult.text.trim().replace(/^["']|["']$/g, ""),
			summary: summaryResult.text.trim(),
			title: titleResult.text.trim().replace(/^["']|["']$/g, ""),
		};
	} catch (error) {
		logger.error({
			error,
			message: "Failed to generate daily summary content",
			metadata: {
				period,
				periodLabel: input.periodLabel,
			},
		});

		return getFallbackContent({ input, period });
	}
};

export const getDailySummary = async ({
	now,
	organizationId,
	userId,
}: DailySummaryInput): Promise<DailySummaryResult> => {
	const { day, week } = getDailySummaryRanges({ now });
	const { missingConnections } = await getSummaryConnectionState({ organizationId, userId });

	if (missingConnections.length > 0) {
		return getConnectionRequiredSummary({ missingConnections, range: day });
	}

	const persistedDaySummary = await getPersistedDailySummary({
		organizationId,
		period: "day",
		range: day,
		userId,
	});

	if (persistedDaySummary) {
		return persistedDaySummary;
	}

	const dayData = await readSourceData({ organizationId, range: day, userId });
	const useWeeklyFallback = !hasSourceData(dayData);
	const period = useWeeklyFallback ? "week" : "day";
	const range = useWeeklyFallback ? week : day;

	if (useWeeklyFallback) {
		const persistedWeekSummary = await getPersistedDailySummary({
			organizationId,
			period: "week",
			range: week,
			userId,
		});

		if (persistedWeekSummary) {
			return persistedWeekSummary;
		}
	}

	const data = useWeeklyFallback ? await readSourceData({ organizationId, range: week, userId }) : dayData;
	const promptInput = buildPromptInput({ data, period, range });
	const content = await generateDailySummaryContent({ input: promptInput, period });
	const persistedSummary = await persistDailySummary({
		content,
		data,
		organizationId,
		period,
		range,
		userId,
	});

	if (persistedSummary) {
		return persistedSummary;
	}

	return {
		content,
		counts: promptInput.sourceCounts,
		missingConnections: [],
		missingSources: data.missingSources,
		needsConnection: false,
		period,
		periodLabel: range.label,
		range: {
			end: range.end,
			start: range.start,
		},
		usedWeeklyFallback: useWeeklyFallback,
	};
};
