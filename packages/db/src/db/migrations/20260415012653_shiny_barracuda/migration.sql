ALTER TABLE "patient_sessions" ADD COLUMN "active_duration_seconds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "active_segment_started_at" timestamp with time zone;--> statement-breakpoint
UPDATE "patient_sessions"
SET
	"active_duration_seconds" = CASE
		WHEN "status" = 'completed' AND "finalized_at" IS NOT NULL
			THEN GREATEST(0, FLOOR(EXTRACT(EPOCH FROM ("finalized_at" - "created_at")))::integer)
		ELSE 0
	END,
	"active_segment_started_at" = CASE
		WHEN "status" = 'in_progress' THEN "created_at"
		ELSE NULL
	END;
