import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";

export const muscles = pgTable("muscles", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull().unique(),
	aliases: jsonb("aliases").notNull().$type<string[]>(),
	...timeFields,
});

export type Muscle = typeof muscles.$inferSelect;
export type MuscleNew = typeof muscles.$inferInsert;
