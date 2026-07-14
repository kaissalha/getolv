import { index, jsonb, pgEnum, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";
import type { PatientLabResultStatus } from "../patients/sessions/patient-lab-results.ts";
import { labTests } from "./lab-tests.ts";

export const countryEnum = pgEnum("country", ["US", "CA"]);

export const countryEnumValues = countryEnum.enumValues;

export type Country = (typeof countryEnumValues)[number];

export type ReferenceRange = {
	min: number;
	max: number;
	status: PatientLabResultStatus;
};

export type ReferenceRanges = ReferenceRange[];

export const labTestReferenceRanges = pgTable(
	"lab_test_reference_ranges",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		labTestId: uuid("lab_test_id")
			.notNull()
			.references(() => labTests.id, { onDelete: "cascade" }),
		country: countryEnum("country").notNull(),
		unit: text("unit").notNull(),
		ranges: jsonb("ranges").notNull().$type<ReferenceRanges>(),
		source: text("source"),
		...timeFields,
	},
	(table) => [
		index("lab_test_reference_ranges_lab_test_id_idx").on(table.labTestId),
		index("lab_test_reference_ranges_country_idx").on(table.country),
		unique("lab_test_reference_ranges_lab_test_country_idx").on(table.labTestId, table.country),
	]
);

export type LabTestReferenceRange = typeof labTestReferenceRanges.$inferSelect;
export type LabTestReferenceRangeNew = typeof labTestReferenceRanges.$inferInsert;
