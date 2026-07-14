import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../../helpers/time.ts";
import { patientWorkoutPlans } from "./patient-workout-plans.ts";

export const patientWorkoutPlanDays = pgTable(
	"patient_workout_plan_days",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		workoutPlanId: uuid("workout_plan_id")
			.notNull()
			.references(() => patientWorkoutPlans.id, { onDelete: "cascade" }),
		dayNumber: integer("day_number").notNull(),
		name: text("name").notNull(),
		focus: text("focus"),
		warmUp: text("warm_up"),
		coolDown: text("cool_down"),
		...timeFields,
	},
	(table) => [index("patient_workout_plan_days_plan_id_idx").on(table.workoutPlanId)]
);

export type PatientWorkoutPlanDay = typeof patientWorkoutPlanDays.$inferSelect;
export type PatientWorkoutPlanDayNew = typeof patientWorkoutPlanDays.$inferInsert;
