CREATE TYPE "transcript_speaker" AS ENUM('practitioner', 'patient', 'unknown');--> statement-breakpoint
CREATE TABLE "session_transcript_turns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"speaker" "transcript_speaker" DEFAULT 'unknown'::"transcript_speaker" NOT NULL,
	"text" text NOT NULL,
	"turn_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patient_sessions" DROP CONSTRAINT "patient_sessions_chat_id_ai_chats_id_fk";--> statement-breakpoint
DROP INDEX "patient_session_chat_id_idx";--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "status" "patient_session_status" DEFAULT 'in_progress'::"patient_session_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "audio_url" text;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "final_transcript" text;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "finalized_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "patient_sessions" DROP COLUMN "chat_id";--> statement-breakpoint
CREATE INDEX "session_transcript_turn_session_id_idx" ON "session_transcript_turns" ("session_id");--> statement-breakpoint
CREATE INDEX "session_transcript_turn_org_id_idx" ON "session_transcript_turns" ("organization_id");--> statement-breakpoint
ALTER TABLE "session_transcript_turns" ADD CONSTRAINT "session_transcript_turns_session_id_patient_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "patient_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session_transcript_turns" ADD CONSTRAINT "session_transcript_turns_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;