WITH ranked_sessions AS (
	SELECT
		"id",
		row_number() OVER (
			PARTITION BY "organization_id", "patient_id"
			ORDER BY "created_at" DESC, "id" DESC
		) AS "session_rank"
	FROM "patient_sessions"
	WHERE "status" = 'in_progress'
)
UPDATE "patient_sessions"
SET
	"status" = 'completed',
	"finalized_at" = COALESCE("finalized_at", "updated_at", "created_at", NOW())
WHERE "id" IN (
	SELECT "id"
	FROM ranked_sessions
	WHERE "session_rank" > 1
);

CREATE UNIQUE INDEX "patient_session_single_active_idx"
ON "patient_sessions" ("organization_id", "patient_id")
WHERE "status" = 'in_progress';
