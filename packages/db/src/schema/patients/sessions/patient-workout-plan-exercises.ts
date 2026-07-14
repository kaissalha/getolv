import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timeFields } from "../../helpers/time.ts";
import { exercises } from "../../workouts/exercises.ts";
import { patientWorkoutPlanDays } from "./patient-workout-plan-days.ts";

export const patientWorkoutPlanExercises = pgTable(
	"patient_workout_plan_exercises",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		workoutPlanDayId: uuid("workout_plan_day_id")
			.notNull()
			.references(() => patientWorkoutPlanDays.id, { onDelete: "cascade" }),
		exerciseId: uuid("exercise_id").references(() => exercises.id, {
			onDelete: "set null",
		}),
		exerciseName: text("exercise_name").notNull(),
		orderIndex: integer("order_index").notNull(),
		sets: integer("sets"),
		reps: text("reps"),
		restSeconds: integer("rest_seconds"),
		notes: text("notes"),
		...timeFields,
	},
	(table) => [
		index("patient_workout_plan_exercises_day_id_idx").on(table.workoutPlanDayId),
		index("patient_workout_plan_exercises_exercise_id_idx").on(table.exerciseId),
	]
);

export type PatientWorkoutPlanExercise = typeof patientWorkoutPlanExercises.$inferSelect;
export type PatientWorkoutPlanExerciseNew = typeof patientWorkoutPlanExercises.$inferInsert;
