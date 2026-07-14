import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";

export const bodyParts = pgTable("body_parts", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull().unique(),
	...timeFields,
});

export type BodyPart = typeof bodyParts.$inferSelect;
export type BodyPartNew = typeof bodyParts.$inferInsert;
