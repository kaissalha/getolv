import { sql } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../../auth/organizations.ts";
import { timeFields } from "../../helpers/time.ts";
import {
	type PatientDiagnosisEntry,
	type PatientTodo,
	normalizePatientDiagnosis,
	normalizePatientTodos,
	patients,
} from "../patients.ts";

export const patientSessionStatus = pgEnum("patient_session_status", ["in_progress", "completed"]);

export type PatientSessionIntelligence = {
	visitReason: string | null;
	riskFlags: string[];
	liveNote: string;
	thingsToAsk: Array<{
		id: string;
		question: string;
		category?: string | null;
	}>;
	todos: PatientTodo[];
	workingDx: PatientDiagnosisEntry[];
	differentialDx: PatientDiagnosisEntry[];
	practitionerQaTurns: Array<{
		question: string;
		answer: string;
	}>;
};

export type PatientSessionTranscriptEntity = {
	endMs: number | null;
	startMs: number | null;
	text: string;
	type: string;
};

export type PatientSessionTranscriptWarning = {
	code: string | null;
	message: string;
};

export type PatientSessionTranscriptMetadata = {
	audioDurationSeconds?: number | null;
	confidence?: number | null;
	domain: string;
	entities: PatientSessionTranscriptEntity[];
	keyterms: string[];
	languageCode?: string | null;
	source: "pre_recorded";
	speechModels: string[];
	warnings: PatientSessionTranscriptWarning[];
};

/** Legacy sessions stored `liveNote` as headed sections; normalize to a single string for the UI and prompts. */
export const normalizeLiveNoteFromStorage = (value: unknown): string => {
	if (typeof value === "string") {
		return value.trim();
	}
	if (!Array.isArray(value)) {
		return "";
	}
	return value
		.map((item) => {
			if (!item || typeof item !== "object") {
				return "";
			}
			const heading = "heading" in item && typeof item.heading === "string" ? item.heading.trim() : "";
			const content = "content" in item && typeof item.content === "string" ? item.content.trim() : "";
			if (heading && content) {
				return `${heading}: ${content}`;
			}
			return content || heading;
		})
		.filter(Boolean)
		.join(" ");
};

export const normalizePatientSessionCompletedTodoIds = ({
	completedTodoIds,
	todos,
}: {
	completedTodoIds: string[] | null | undefined;
	todos: PatientTodo[];
}) => {
	const todoIds = new Set(todos.map((todo) => todo.id));

	return Array.from(
		new Set((completedTodoIds ?? []).map((id) => id.trim()).filter((id) => id.length > 0 && todoIds.has(id)))
	);
};

export const normalizePatientSessionIntelligence = (
	intel: PatientSessionIntelligence | null | undefined
): PatientSessionIntelligence | null => {
	if (!intel || typeof intel !== "object") {
		return null;
	}

	const normalizedDiagnosis = normalizePatientDiagnosis({
		workingDx: intel.workingDx,
		differentialDx: intel.differentialDx,
	});
	const normalizedTodos = normalizePatientTodos(intel.todos);

	return {
		...intel,
		liveNote: normalizeLiveNoteFromStorage("liveNote" in intel ? intel.liveNote : undefined),
		todos: normalizedTodos,
		workingDx: normalizedDiagnosis.workingDx,
		differentialDx: normalizedDiagnosis.differentialDx,
	};
};

export const patientSessions = pgTable(
	"patient_sessions",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		status: patientSessionStatus("status").default("in_progress").notNull(),
		title: text("title"),
		summary: text("summary"),
		audioUrl: text("audio_url"),
		finalTranscript: text("final_transcript"),
		transcriptMetadata: jsonb("transcript_metadata").$type<PatientSessionTranscriptMetadata>(),
		intelligence: jsonb("intelligence").$type<PatientSessionIntelligence>(),
		completedTodoIds: jsonb("completed_todo_ids").$type<string[]>(),
		activeDurationSeconds: integer("active_duration_seconds").default(0).notNull(),
		activeSegmentStartedAt: timestamp("active_segment_started_at", { withTimezone: true, mode: "string" }),
		finalizedAt: timestamp("finalized_at", { withTimezone: true, mode: "string" }),
		...timeFields,
	},
	(table) => [
		index("patient_session_organization_id_idx").on(table.organizationId),
		index("patient_session_patient_id_idx").on(table.patientId),
		uniqueIndex("patient_session_single_org_active_idx")
			.on(table.organizationId)
			.where(sql`${table.status} = 'in_progress'`),
	]
);

export type PatientSession = typeof patientSessions.$inferSelect;
