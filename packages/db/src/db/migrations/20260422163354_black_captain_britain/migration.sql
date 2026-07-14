CREATE TABLE "patient_treatment_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"patient_id" uuid NOT NULL,
	"patient_session_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"generated_by_name" text,
	"generated_by_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "patient_treatment_plans_patient_id_idx" ON "patient_treatment_plans" ("patient_id");--> statement-breakpoint
CREATE INDEX "patient_treatment_plans_organization_id_idx" ON "patient_treatment_plans" ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "patient_treatment_plans_session_id_idx" ON "patient_treatment_plans" ("patient_session_id");--> statement-breakpoint
ALTER TABLE "patient_treatment_plans" ADD CONSTRAINT "patient_treatment_plans_patient_id_patients_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_treatment_plans" ADD CONSTRAINT "patient_treatment_plans_XMjGeY4cIsbi_fkey" FOREIGN KEY ("patient_session_id") REFERENCES "patient_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_treatment_plans" ADD CONSTRAINT "patient_treatment_plans_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;