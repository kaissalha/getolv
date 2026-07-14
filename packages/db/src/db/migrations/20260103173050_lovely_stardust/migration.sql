DROP INDEX "oauth_connection_org_level_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "oauth_connection_org_level_unique" ON "oauth_connections" ("external_id","provider","organization_id") WHERE "user_id" IS NULL;--> statement-breakpoint
DROP INDEX "oauth_connection_user_level_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "oauth_connection_user_level_unique" ON "oauth_connections" ("external_id","provider","organization_id","user_id") WHERE "user_id" IS NOT NULL;