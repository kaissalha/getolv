import { index, jsonb, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../../helpers/time.ts";
import { labTests } from "../../lab-tests/lab-tests.ts";
import { patients } from "../patients.ts";
import { patientLabReports } from "./patient-lab-reports.ts";
import { patientSessions } from "./patient-sessions.ts";

export type PatientLabResultStatus = "optimal" | "suboptimal" | "critical";

export type PatientLabResultRange = {
	min: number;
	max: number;
	status: PatientLabResultStatus;
};

export type PatientLabResultRanges = Array<PatientLabResultRange>;

export const patientLabResults = pgTable(
	"patient_lab_results",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientSessionId: uuid("patient_session_id").references(() => patientSessions.id, {
			onDelete: "set null",
		}),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		labTestId: uuid("lab_test_id")
			.notNull()
			.references(() => labTests.id, { onDelete: "restrict" }),
		labReportId: uuid("lab_report_id")
			.notNull()
			.references(() => patientLabReports.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		category: text("category").notNull(),
		value: numeric("value", {
			mode: "number",
		}).notNull(),
		unit: text("unit").notNull(),
		ranges: jsonb("ranges").notNull().$type<PatientLabResultRanges>(),
		...timeFields,
	},
	(table) => [
		index("patient_lab_result_patient_session_id_idx").on(table.patientSessionId),
		index("patient_lab_result_lab_test_id_idx").on(table.labTestId),
		index("patient_lab_result_lab_report_id_idx").on(table.labReportId),
	]
);

// Types
export type PatientLabResult = typeof patientLabResults.$inferSelect;
export type PatientLabResultNew = typeof patientLabResults.$inferInsert;

/** Lab result with computed status field (used in read operations) */
export type PatientLabResultWithStatus = PatientLabResult & { status: PatientLabResultStatus };
