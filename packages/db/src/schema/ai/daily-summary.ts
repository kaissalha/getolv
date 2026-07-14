import { index, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../auth/organizations.ts";
import { users } from "../auth/users.ts";
import { timeFields } from "../helpers/time.ts";

export const dailySummaryPeriod = pgEnum("daily_summary_period", ["day", "week"]);

export type DailySummaryContent = {
	actions: string[];
	story: string;
	summary: string;
	title: string;
};

export type DailySummarySourceCounts = {
	calendar: number;
	mail: number;
	notes: number;
};

export const dailySummaries = pgTable(
	"daily_summaries",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		period: dailySummaryPeriod("period").notNull(),
		periodLabel: text("period_label").notNull(),
		rangeStart: timestamp("range_start", { withTimezone: true, mode: "string" }).notNull(),
		rangeEnd: timestamp("range_end", { withTimezone: true, mode: "string" }).notNull(),
		content: jsonb("content").$type<DailySummaryContent>().notNull(),
		sourceCounts: jsonb("source_counts").$type<DailySummarySourceCounts>().notNull(),
		missingSources: jsonb("missing_sources").$type<Array<"calendar" | "mail">>().notNull().default([]),
		...timeFields,
	},
	(table) => [
		index("daily_summaries_organization_id_idx").on(table.organizationId),
		index("daily_summaries_user_id_idx").on(table.userId),
		uniqueIndex("daily_summaries_user_org_period_range_idx").on(
			table.organizationId,
			table.userId,
			table.period,
			table.rangeStart,
			table.rangeEnd
		),
	]
);

export type DailySummary = typeof dailySummaries.$inferSelect;
export type NewDailySummary = typeof dailySummaries.$inferInsert;
