import { index, integer, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { organizations } from "../../auth/organizations.ts";
import { timeFields } from "../../helpers/time.ts";
import { patientSessions } from "./patient-sessions.ts";

export const transcriptSpeaker = pgEnum("transcript_speaker", ["practitioner", "patient", "unknown"]);

export type SessionTranscriptTurnMetadata = {
	confidence?: number | null;
	endMs?: number | null;
	languageCode?: string | null;
	rawSpeakerLabel?: string | null;
	source: "pre_recorded" | "streaming";
	startMs?: number | null;
	streamTurnOrder?: number | null;
};

export const sessionTranscriptTurns = pgTable(
	"session_transcript_turns",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		sessionId: uuid("session_id")
			.notNull()
			.references(() => patientSessions.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		metadata: jsonb("metadata").$type<SessionTranscriptTurnMetadata>(),
		speaker: transcriptSpeaker("speaker").default("unknown").notNull(),
		text: text("text").notNull(),
		turnOrder: integer("turn_order").notNull(),
		...timeFields,
	},
	(table) => [
		index("session_transcript_turn_session_id_idx").on(table.sessionId),
		index("session_transcript_turn_org_id_idx").on(table.organizationId),
	]
);

export type SessionTranscriptTurn = typeof sessionTranscriptTurns.$inferSelect;
