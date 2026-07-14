ALTER TABLE "note_mentions" ALTER COLUMN "resource_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "note_mention_resource_type";--> statement-breakpoint
CREATE TYPE "note_mention_resource_type" AS ENUM('patient');--> statement-breakpoint
ALTER TABLE "note_mentions" ALTER COLUMN "resource_type" SET DATA TYPE "note_mention_resource_type" USING "resource_type"::"note_mention_resource_type";