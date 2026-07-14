CREATE TYPE "country" AS ENUM('US', 'CA');--> statement-breakpoint
CREATE TABLE "lab_test_range_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lab_test_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"ranges" jsonb NOT NULL,
	"unit" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lab_test_range_overrides_lab_test_patient_idx" UNIQUE("lab_test_id","patient_id")
);
--> statement-breakpoint
CREATE TABLE "lab_test_reference_ranges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lab_test_id" uuid NOT NULL,
	"country" "country" NOT NULL,
	"unit" text NOT NULL,
	"ranges" jsonb NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lab_test_reference_ranges_lab_test_country_idx" UNIQUE("lab_test_id","country")
);
--> statement-breakpoint
CREATE TABLE "lab_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL UNIQUE,
	"loinc_code" text,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"aliases" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_lab_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"patient_id" uuid NOT NULL,
	"patient_session_id" uuid,
	"organization_id" text NOT NULL,
	"summary" text,
	"report_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patient_lab_results" ADD COLUMN "lab_test_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_lab_results" ADD COLUMN "lab_report_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "lab_test_range_overrides_lab_test_id_idx" ON "lab_test_range_overrides" ("lab_test_id");--> statement-breakpoint
CREATE INDEX "lab_test_range_overrides_patient_id_idx" ON "lab_test_range_overrides" ("patient_id");--> statement-breakpoint
CREATE INDEX "lab_test_reference_ranges_lab_test_id_idx" ON "lab_test_reference_ranges" ("lab_test_id");--> statement-breakpoint
CREATE INDEX "lab_test_reference_ranges_country_idx" ON "lab_test_reference_ranges" ("country");--> statement-breakpoint
CREATE INDEX "lab_tests_code_idx" ON "lab_tests" ("code");--> statement-breakpoint
CREATE INDEX "lab_tests_category_idx" ON "lab_tests" ("category");--> statement-breakpoint
CREATE INDEX "patient_lab_reports_patient_id_idx" ON "patient_lab_reports" ("patient_id");--> statement-breakpoint
CREATE INDEX "patient_lab_reports_patient_session_id_idx" ON "patient_lab_reports" ("patient_session_id");--> statement-breakpoint
CREATE INDEX "patient_lab_reports_organization_id_idx" ON "patient_lab_reports" ("organization_id");--> statement-breakpoint
CREATE INDEX "patient_lab_result_lab_test_id_idx" ON "patient_lab_results" ("lab_test_id");--> statement-breakpoint
CREATE INDEX "patient_lab_result_lab_report_id_idx" ON "patient_lab_results" ("lab_report_id");--> statement-breakpoint
ALTER TABLE "lab_test_range_overrides" ADD CONSTRAINT "lab_test_range_overrides_lab_test_id_lab_tests_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "lab_tests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lab_test_range_overrides" ADD CONSTRAINT "lab_test_range_overrides_patient_id_patients_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lab_test_reference_ranges" ADD CONSTRAINT "lab_test_reference_ranges_lab_test_id_lab_tests_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "lab_tests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_lab_reports" ADD CONSTRAINT "patient_lab_reports_patient_id_patients_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_lab_reports" ADD CONSTRAINT "patient_lab_reports_patient_session_id_patient_sessions_id_fkey" FOREIGN KEY ("patient_session_id") REFERENCES "patient_sessions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "patient_lab_reports" ADD CONSTRAINT "patient_lab_reports_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "patient_lab_results" ADD CONSTRAINT "patient_lab_results_lab_test_id_lab_tests_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "lab_tests"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "patient_lab_results" ADD CONSTRAINT "patient_lab_results_lab_report_id_patient_lab_reports_id_fkey" FOREIGN KEY ("lab_report_id") REFERENCES "patient_lab_reports"("id") ON DELETE CASCADE;