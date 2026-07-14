import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { bodyParts } from "./body-parts.ts";
import { muscles } from "./muscles.ts";

export const muscleBodyParts = pgTable(
	"muscle_body_parts",
	{
		muscleId: uuid("muscle_id")
			.notNull()
			.references(() => muscles.id, { onDelete: "cascade" }),
		bodyPartId: uuid("body_part_id")
			.notNull()
			.references(() => bodyParts.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.muscleId, table.bodyPartId] }),
		index("muscle_body_parts_body_part_id_idx").on(table.bodyPartId),
	]
);

export type MuscleBodyPart = typeof muscleBodyParts.$inferSelect;
export type MuscleBodyPartNew = typeof muscleBodyParts.$inferInsert;
