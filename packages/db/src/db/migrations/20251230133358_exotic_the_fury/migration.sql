CREATE TYPE "public"."oauth_connection_status" AS ENUM('connected', 'disconnected', 'error', 'expired');--> statement-breakpoint
CREATE TYPE "public"."oauth_provider" AS ENUM('gmail');--> statement-breakpoint
CREATE TABLE "oauth_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"organization_id" text NOT NULL,
	"provider" "oauth_provider" NOT NULL,
	"external_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"picture" text,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"scopes" text[],
	"status" "oauth_connection_status" DEFAULT 'connected' NOT NULL,
	"sync_token" text,
	"synced_at" timestamp with time zone,
	"watch_id" text,
	"watch_resource_id" text,
	"watch_expiration" timestamp with time zone,
	"last_accessed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "oauth_connection_org_level_unique" ON "oauth_connections" USING btree ("external_id","provider","organization_id") WHERE "oauth_connections"."user_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "oauth_connection_user_level_unique" ON "oauth_connections" USING btree ("external_id","provider","organization_id","user_id") WHERE "oauth_connections"."user_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "oauth_connection_user_id_idx" ON "oauth_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "oauth_connection_org_id_idx" ON "oauth_connections" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "oauth_connection_watch_expiration_idx" ON "oauth_connections" USING btree ("watch_expiration");