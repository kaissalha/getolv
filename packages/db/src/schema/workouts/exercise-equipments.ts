import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { equipments } from "./equipments.ts";
import { exercises } from "./exercises.ts";

export const exerciseEquipments = pgTable(
	"exercise_equipments",
	{
		exerciseId: uuid("exercise_id")
			.notNull()
			.references(() => exercises.id, { onDelete: "cascade" }),
		equipmentId: uuid("equipment_id")
			.notNull()
			.references(() => equipments.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.exerciseId, table.equipmentId] }),
		index("exercise_equipments_equipment_id_idx").on(table.equipmentId),
	]
);

export type ExerciseEquipment = typeof exerciseEquipments.$inferSelect;
export type ExerciseEquipmentNew = typeof exerciseEquipments.$inferInsert;
