ALTER TABLE "notes" DROP COLUMN "fts";--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "fts" tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, COALESCE("notes"."body", ''))) STORED;--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "title";--> statement-breakpoint
CREATE INDEX "idx_notes_fts" ON "notes" USING gin ("fts" tsvector_ops);