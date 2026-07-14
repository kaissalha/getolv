import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";

export const equipments = pgTable("equipments", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull().unique(),
	aliases: jsonb("aliases").notNull().$type<string[]>(),
	...timeFields,
});

export type Equipment = typeof equipments.$inferSelect;
export type EquipmentNew = typeof equipments.$inferInsert;
