import { index, jsonb, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../helpers/time.ts";
import { patients } from "../patients/patients.ts";
import type { ReferenceRanges } from "./lab-test-reference-ranges.ts";
import { labTests } from "./lab-tests.ts";

export const labTestRangeOverrides = pgTable(
	"lab_test_range_overrides",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		labTestId: uuid("lab_test_id")
			.notNull()
			.references(() => labTests.id, { onDelete: "cascade" }),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		ranges: jsonb("ranges").notNull().$type<ReferenceRanges>(),
		unit: text("unit"),
		...timeFields,
	},
	(table) => [
		index("lab_test_range_overrides_lab_test_id_idx").on(table.labTestId),
		index("lab_test_range_overrides_patient_id_idx").on(table.patientId),
		unique("lab_test_range_overrides_lab_test_patient_idx").on(table.labTestId, table.patientId),
	]
);

export type LabTestRangeOverride = typeof labTestRangeOverrides.$inferSelect;
export type LabTestRangeOverrideNew = typeof labTestRangeOverrides.$inferInsert;
