CREATE TYPE "uploaded_media_access" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "uploaded_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"url" text NOT NULL,
	"content_type" text NOT NULL,
	"access" "uploaded_media_access" DEFAULT 'public'::"uploaded_media_access" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "uploaded_media_organization_id_idx" ON "uploaded_media" ("organization_id");--> statement-breakpoint
CREATE INDEX "uploaded_media_url_idx" ON "uploaded_media" ("url");--> statement-breakpoint
CREATE INDEX "uploaded_media_created_at_idx" ON "uploaded_media" ("created_at");--> statement-breakpoint
ALTER TABLE "uploaded_media" ADD CONSTRAINT "uploaded_media_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;