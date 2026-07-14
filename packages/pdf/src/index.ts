import "./components/styles";

export { renderToBuffer, renderToStream } from "@react-pdf/renderer";

export { Footer } from "./components/footer";
export { Logo } from "./components/logo";
export { baseStyles } from "./components/styles";
export type { Locale } from "./locales";
export { getI18n } from "./locales";

export type {
	LabResult,
	LabResultRange,
	LabResultsPdfProps,
	PatientInfo,
	PractitionerInfo,
} from "./templates/lab-results";
export { LabResultsPdf } from "./templates/lab-results";

export type {
	TreatmentPlanHabit,
	TreatmentPlanLifestyleRecommendation,
	TreatmentPlanMealPlan,
	TreatmentPlanPatientInfo,
	TreatmentPlanPdfProps,
	TreatmentPlanPlateStep,
	TreatmentPlanPractitionerInfo,
	TreatmentPlanRating,
	TreatmentPlanSupplement,
} from "./templates/treatment-plan";
export { TreatmentPlanPdf } from "./templates/treatment-plan";

export type { WorkoutPlanPdfProps } from "./templates/workout-plan";
export { WorkoutPlanPdf } from "./templates/workout-plan";
