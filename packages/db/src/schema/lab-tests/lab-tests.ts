import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";

export type LabTestAliases = string[];

export const labTests = pgTable(
	"lab_tests",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		code: text("code").notNull().unique(),
		loincCode: text("loinc_code"),
		name: text("name").notNull(),
		category: text("category").notNull(),
		aliases: jsonb("aliases").notNull().$type<LabTestAliases>(),
		...timeFields,
	},
	(table) => [index("lab_tests_code_idx").on(table.code), index("lab_tests_category_idx").on(table.category)]
);

export type LabTest = typeof labTests.$inferSelect;
export type LabTestNew = typeof labTests.$inferInsert;
