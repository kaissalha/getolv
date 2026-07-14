import { type SQL, sql } from "drizzle-orm";
import { date, index, jsonb, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../auth/organizations.ts";
import { timeFields } from "../helpers/time.ts";
import { tsvector } from "../helpers/tsvector.ts";

export type PatientTodo = {
	id: string;
	text: string;
	category: string | null;
};

export type PatientDiagnosisEntry = {
	name: string;
	reasoning: string | null;
	evidence: string | null;
	missing: string | null;
	verifyNext: string | null;
};

export type PatientDiagnosis = {
	workingDx: PatientDiagnosisEntry[];
	differentialDx: PatientDiagnosisEntry[];
};

type PatientTodoInput = {
	id?: string | null;
	text?: string | null;
	category?: string | null;
};

type PatientDiagnosisEntryInput = {
	name?: string | null;
	reasoning?: string | null;
	evidence?: string | null;
	missing?: string | null;
	verifyNext?: string | null;
};

type PatientDiagnosisInput = {
	workingDx?: PatientDiagnosisEntryInput[] | null;
	differentialDx?: PatientDiagnosisEntryInput[] | null;
};

const normalizeDiagnosisEntry = (value: PatientDiagnosisEntryInput | null | undefined) => {
	const name = value?.name?.trim();

	if (!name) {
		return null;
	}

	return {
		name,
		reasoning: value?.reasoning?.trim() || null,
		evidence: value?.evidence?.trim() || null,
		missing: value?.missing?.trim() || null,
		verifyNext: value?.verifyNext?.trim() || null,
	};
};

const normalizeDiagnosisEntries = (value: PatientDiagnosisEntryInput[] | null | undefined): PatientDiagnosisEntry[] =>
	(value ?? []).reduce<PatientDiagnosisEntry[]>((entries, entry) => {
		const normalizedEntry = normalizeDiagnosisEntry(entry);

		return normalizedEntry ? [...entries, normalizedEntry] : entries;
	}, []);

export const normalizePatientDiagnosis = (value: PatientDiagnosisInput | null | undefined): PatientDiagnosis => ({
	workingDx: normalizeDiagnosisEntries(value?.workingDx),
	differentialDx: normalizeDiagnosisEntries(value?.differentialDx),
});

export const normalizePatientTodos = (value: PatientTodoInput[] | null | undefined): PatientTodo[] =>
	(value ?? []).reduce<PatientTodo[]>((todos, todo) => {
		const id = todo?.id?.trim();
		const text = todo?.text?.trim();

		if (!id || !text) {
			return todos;
		}

		return [
			...todos,
			{
				id,
				text,
				category: todo.category?.trim() || null,
			},
		];
	}, []);

export const normalizePatientClinicalState = ({
	diagnosis,
	todos,
}: {
	diagnosis: PatientDiagnosisInput | null | undefined;
	todos: PatientTodoInput[] | null | undefined;
}) => ({
	diagnosis: normalizePatientDiagnosis(diagnosis),
	todos: normalizePatientTodos(todos),
});

export const patients = pgTable(
	"patients",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		email: text("email").notNull(),
		phoneNumber: text("phone_number"),
		dateOfBirth: date("date_of_birth"),
		gender: text("gender"),
		allergies: text("allergies"),
		currentMedications: text("current_medications"),
		pastMedicalHistory: text("past_medical_history"),
		familyMedicalHistory: text("family_medical_history"),
		additionalContext: text("additional_context"),
		summary: text("summary"),
		diagnosis: jsonb("diagnosis").$type<PatientDiagnosis>(),
		todos: jsonb("todos").$type<PatientTodo[]>(),
		...timeFields,
		fts: tsvector("fts")
			.notNull()
			.generatedAlwaysAs(
				(): SQL =>
					sql`
						to_tsvector(
							'english'::regconfig,
							COALESCE(${patients.firstName}, '') || ' ' ||
							COALESCE(${patients.lastName}, '') || ' ' ||
							COALESCE(${patients.email}, '') || ' ' ||
							COALESCE(${patients.phoneNumber}, '')
						)
					`
			),
	},
	(table) => [
		index("patient_organization_id_idx").on(table.organizationId),
		unique("patient_organization_email_idx").on(table.organizationId, table.email),
		index("idx_patients_fts").using("gin", table.fts.asc().nullsLast().op("tsvector_ops")),
	]
);

export type Patient = typeof patients.$inferSelect;
