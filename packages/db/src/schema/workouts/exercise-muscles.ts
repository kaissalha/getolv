import { index, pgEnum, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { exercises } from "./exercises.ts";
import { muscles } from "./muscles.ts";

export const exerciseMuscleRoleEnum = pgEnum("exercise_muscle_role", ["target", "secondary"]);

export const exerciseMuscles = pgTable(
	"exercise_muscles",
	{
		exerciseId: uuid("exercise_id")
			.notNull()
			.references(() => exercises.id, { onDelete: "cascade" }),
		muscleId: uuid("muscle_id")
			.notNull()
			.references(() => muscles.id, { onDelete: "cascade" }),
		role: exerciseMuscleRoleEnum("role").notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.exerciseId, table.muscleId, table.role] }),
		index("exercise_muscles_muscle_id_idx").on(table.muscleId),
		index("exercise_muscles_role_idx").on(table.role),
	]
);

export type ExerciseMuscle = typeof exerciseMuscles.$inferSelect;
export type ExerciseMuscleNew = typeof exerciseMuscles.$inferInsert;
