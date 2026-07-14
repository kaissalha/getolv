import { index, jsonb, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../../auth/organizations.ts";
import { timeFields } from "../../helpers/time.ts";
import { patients } from "../patients.ts";
import { patientSessions } from "./patient-sessions.ts";

type TreatmentPlanMealPlanDayEntries = Partial<Record<"breakfast" | "dinner" | "lunch" | "snacks", string>>;

type TreatmentPlanMealPlan = Partial<
	Record<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun", TreatmentPlanMealPlanDayEntries>
>;

type PatientTreatmentPlanLifestyleRecommendation = {
	description: string;
	title: string;
};

type PatientTreatmentPlanPlateStep = {
	hint?: string;
	items: string[];
	title: string;
};

type PatientTreatmentPlanSupplement = {
	dose: string;
	name: string;
	reason: string;
};

type PatientTreatmentPlanHabit = {
	key: string;
	label: string;
};

type PatientTreatmentPlanRating = {
	key: string;
	label: string;
	max?: number;
	value?: number;
};

export type PatientTreatmentPlanContent = {
	dailyHabits?: PatientTreatmentPlanHabit[];
	dietaryAvoid?: string[];
	dietaryInclude?: string[];
	disclaimer?: string | null;
	lifestyleRecommendations?: PatientTreatmentPlanLifestyleRecommendation[];
	longTermGoals?: string | null;
	mealPlan?: TreatmentPlanMealPlan;
	mindfulnessParagraphs?: string[];
	movementParagraphs?: string[];
	pathologyRecommendations?: string | null;
	pathologyReview?: string | null;
	plateSteps?: PatientTreatmentPlanPlateStep[];
	ratings?: PatientTreatmentPlanRating[];
	shortTermGoals?: string | null;
	summary?: string | null;
	supplements?: PatientTreatmentPlanSupplement[];
	weeklyHabits?: PatientTreatmentPlanHabit[];
};

export const patientTreatmentPlans = pgTable(
	"patient_treatment_plans",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		patientSessionId: uuid("patient_session_id")
			.notNull()
			.references(() => patientSessions.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		data: jsonb("data").$type<PatientTreatmentPlanContent>().notNull(),
		generatedByName: text("generated_by_name"),
		generatedByEmail: text("generated_by_email"),
		...timeFields,
	},
	(table) => [
		index("patient_treatment_plans_patient_id_idx").on(table.patientId),
		index("patient_treatment_plans_organization_id_idx").on(table.organizationId),
		uniqueIndex("patient_treatment_plans_session_id_idx").on(table.patientSessionId),
	]
);

export type PatientTreatmentPlan = typeof patientTreatmentPlans.$inferSelect;
export type PatientTreatmentPlanNew = typeof patientTreatmentPlans.$inferInsert;
