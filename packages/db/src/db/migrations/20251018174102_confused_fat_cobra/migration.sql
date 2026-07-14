CREATE TYPE "public"."patient_session_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "status" "patient_session_status" DEFAULT 'in_progress' NOT NULL;