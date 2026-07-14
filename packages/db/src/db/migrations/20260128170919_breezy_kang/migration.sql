CREATE TYPE "note_mention_resource_type" AS ENUM('patient', 'lab');--> statement-breakpoint
CREATE TABLE "note_mentions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"note_id" uuid NOT NULL,
	"resource_type" "note_mention_resource_type" NOT NULL,
	"resource_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fts" tsvector GENERATED ALWAYS AS (
						to_tsvector(
							'english'::regconfig,
							COALESCE("notes"."title", '') || ' ' ||
							COALESCE("notes"."body", '')
						)
					) STORED NOT NULL
);
--> statement-breakpoint
CREATE INDEX "note_mention_note_id_idx" ON "note_mentions" ("note_id");--> statement-breakpoint
CREATE INDEX "note_mention_resource_idx" ON "note_mentions" ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "note_organization_id_idx" ON "notes" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_notes_fts" ON "notes" USING gin ("fts" tsvector_ops);--> statement-breakpoint
ALTER TABLE "note_mentions" ADD CONSTRAINT "note_mentions_note_id_notes_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;