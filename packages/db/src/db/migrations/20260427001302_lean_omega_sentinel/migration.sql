CREATE TYPE "daily_summary_period" AS ENUM('day', 'week');--> statement-breakpoint
CREATE TABLE "daily_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"period" "daily_summary_period" NOT NULL,
	"period_label" text NOT NULL,
	"range_start" timestamp with time zone NOT NULL,
	"range_end" timestamp with time zone NOT NULL,
	"content" jsonb NOT NULL,
	"source_counts" jsonb NOT NULL,
	"missing_sources" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "daily_summaries_organization_id_idx" ON "daily_summaries" ("organization_id");--> statement-breakpoint
CREATE INDEX "daily_summaries_user_id_idx" ON "daily_summaries" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_summaries_user_org_period_range_idx" ON "daily_summaries" ("organization_id","user_id","period","range_start","range_end");--> statement-breakpoint
ALTER TABLE "daily_summaries" ADD CONSTRAINT "daily_summaries_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "daily_summaries" ADD CONSTRAINT "daily_summaries_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;