import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../../auth/organizations.ts";
import { timeFields } from "../../helpers/time.ts";
import { patients } from "../patients.ts";
import { patientSessions } from "./patient-sessions.ts";

export const patientWorkoutPlans = pgTable(
	"patient_workout_plans",
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
		title: text("title").notNull(),
		summary: text("summary"),
		durationWeeks: integer("duration_weeks"),
		daysPerWeek: integer("days_per_week"),
		...timeFields,
	},
	(table) => [
		index("patient_workout_plans_patient_id_idx").on(table.patientId),
		index("patient_workout_plans_session_id_idx").on(table.patientSessionId),
		index("patient_workout_plans_organization_id_idx").on(table.organizationId),
	]
);

export type PatientWorkoutPlan = typeof patientWorkoutPlans.$inferSelect;
export type PatientWorkoutPlanNew = typeof patientWorkoutPlans.$inferInsert;
