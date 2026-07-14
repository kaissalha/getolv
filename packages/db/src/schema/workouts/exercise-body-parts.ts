import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { bodyParts } from "./body-parts.ts";
import { exercises } from "./exercises.ts";

export const exerciseBodyParts = pgTable(
	"exercise_body_parts",
	{
		exerciseId: uuid("exercise_id")
			.notNull()
			.references(() => exercises.id, { onDelete: "cascade" }),
		bodyPartId: uuid("body_part_id")
			.notNull()
			.references(() => bodyParts.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.exerciseId, table.bodyPartId] }),
		index("exercise_body_parts_body_part_id_idx").on(table.bodyPartId),
	]
);

export type ExerciseBodyPart = typeof exerciseBodyParts.$inferSelect;
export type ExerciseBodyPartNew = typeof exerciseBodyParts.$inferInsert;
