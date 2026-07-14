import { type SQL, sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";
import { tsvector } from "../helpers/tsvector.ts";

export const exercises = pgTable(
	"exercises",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		exerciseId: text("exercise_id").notNull().unique(),
		name: text("name").notNull(),
		gifUrl: text("gif_url"),
		instructions: jsonb("instructions").notNull().$type<string[]>(),
		fts: tsvector("fts")
			.notNull()
			.generatedAlwaysAs((): SQL => sql`to_tsvector('english'::regconfig, COALESCE(${exercises.name}, ''))`),
		...timeFields,
	},
	(table) => [
		index("exercises_exercise_id_idx").on(table.exerciseId),
		index("exercises_name_idx").on(table.name),
		index("idx_exercises_fts").using("gin", table.fts.asc().nullsLast().op("tsvector_ops")),
	]
);

export type Exercise = typeof exercises.$inferSelect;
export type ExerciseNew = typeof exercises.$inferInsert;
