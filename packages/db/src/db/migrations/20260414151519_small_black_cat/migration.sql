ALTER TABLE "patients" ADD COLUMN "diagnosis" jsonb;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "todos" jsonb;--> statement-breakpoint
ALTER TABLE "patient_sessions" ADD COLUMN "completed_todo_ids" jsonb;