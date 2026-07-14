CREATE TABLE "patient_workout_plan_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_plan_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"name" text NOT NULL,
	"focus" text,
	"warm_up" text,
	"cool_down" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_workout_plan_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_plan_day_id" uuid NOT NULL,
	"exercise_id" uuid,
	"exercise_name" text NOT NULL,
	"order_index" integer NOT NULL,
	"sets" integer,
	"reps" text,
	"rest_seconds" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_workout_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"patient_id" uuid NOT NULL,
	"patient_session_id" uuid,
	"organization_id" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"goal" text,
	"duration_weeks" integer,
	"days_per_week" integer,
	"coaching_notes" text,
	"precautions" text,
	"progression" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"exercise_id" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"gif_url" text,
	"target_muscles" jsonb NOT NULL,
	"body_parts" jsonb NOT NULL,
	"equipments" jsonb NOT NULL,
	"secondary_muscles" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "patient_workout_plan_days_plan_id_idx" ON "patient_workout_plan_days" ("workout_plan_id");--> statement-breakpoint
CREATE INDEX "patient_workout_plan_exercises_day_id_idx" ON "patient_workout_plan_exercises" ("workout_plan_day_id");--> statement-breakpoint
CREATE INDEX "patient_workout_plan_exercises_exercise_id_idx" ON "patient_workout_plan_exercises" ("exercise_id");--> statement-breakpoint
CREATE INDEX "patient_workout_plans_patient_id_idx" ON "patient_workout_plans" ("patient_id");--> statement-breakpoint
CREATE INDEX "patient_workout_plans_session_id_idx" ON "patient_workout_plans" ("patient_session_id");--> statement-breakpoint
CREATE INDEX "patient_workout_plans_organization_id_idx" ON "patient_workout_plans" ("organization_id");--> statement-breakpoint
CREATE INDEX "exercises_exercise_id_idx" ON "exercises" ("exercise_id");--> statement-breakpoint
CREATE INDEX "exercises_name_idx" ON "exercises" ("name");--> statement-breakpoint
ALTER TABLE "patient_workout_plan_days" ADD CONSTRAINT "patient_workout_plan_days_qlKXvOSrtBxc_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "patient_workout_plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_workout_plan_exercises" ADD CONSTRAINT "patient_workout_plan_exercises_3UjH3kTZhblk_fkey" FOREIGN KEY ("workout_plan_day_id") REFERENCES "patient_workout_plan_days"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_workout_plan_exercises" ADD CONSTRAINT "patient_workout_plan_exercises_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "patient_workout_plans" ADD CONSTRAINT "patient_workout_plans_patient_id_patients_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_workout_plans" ADD CONSTRAINT "patient_workout_plans_Dvd6jy1NmHmD_fkey" FOREIGN KEY ("patient_session_id") REFERENCES "patient_sessions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "patient_workout_plans" ADD CONSTRAINT "patient_workout_plans_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;