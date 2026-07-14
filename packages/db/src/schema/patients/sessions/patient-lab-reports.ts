import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../../auth/organizations.ts";
import { timeFields } from "../../helpers/time.ts";
import { patients } from "../patients.ts";
import { patientSessions } from "./patient-sessions.ts";

export const patientLabReports = pgTable(
	"patient_lab_reports",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		patientSessionId: uuid("patient_session_id").references(() => patientSessions.id, {
			onDelete: "set null",
		}),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		summary: text("summary"),
		reportDate: timestamp("report_date", { withTimezone: true, mode: "string" }),
		...timeFields,
	},
	(table) => [
		index("patient_lab_reports_patient_id_idx").on(table.patientId),
		index("patient_lab_reports_patient_session_id_idx").on(table.patientSessionId),
		index("patient_lab_reports_organization_id_idx").on(table.organizationId),
	]
);

export type PatientLabReport = typeof patientLabReports.$inferSelect;
export type PatientLabReportNew = typeof patientLabReports.$inferInsert;
