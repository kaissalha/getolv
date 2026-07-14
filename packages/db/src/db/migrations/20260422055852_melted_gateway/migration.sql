ALTER TABLE "patient_sessions" ADD COLUMN "transcript_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "session_transcript_turns" ADD COLUMN "metadata" jsonb;