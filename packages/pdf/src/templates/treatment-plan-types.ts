export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type TreatmentPlanMealPlanDayEntries = Partial<Record<"breakfast" | "lunch" | "dinner" | "snacks", string>>;

export type TreatmentPlanRatingKey = "energy" | "sleepQuality" | "stress" | "digestion" | "mood" | "pain";

export type TreatmentPlanPatientInfo = {
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth?: string;
};

export type TreatmentPlanPractitionerInfo = {
	name: string;
	title?: string;
	email?: string;
};

export type TreatmentPlanLifestyleRecommendation = {
	title: string;
	description: string;
};

export type TreatmentPlanPlateStep = {
	title: string;
	hint?: string;
	items: string[];
};

export type TreatmentPlanMealPlan = Partial<Record<DayOfWeek, TreatmentPlanMealPlanDayEntries>>;

export type TreatmentPlanSupplement = {
	name: string;
	dose: string;
	reason: string;
};

export type TreatmentPlanHabit = {
	key: string;
	label: string;
};

export type TreatmentPlanRating = {
	key: TreatmentPlanRatingKey | string;
	label: string;
	value?: number | null;
	max?: number;
};

export type TreatmentPlanPdfProps = {
	patient: TreatmentPlanPatientInfo;
	practitioner: TreatmentPlanPractitionerInfo;
	sessionDate: string;
	summary?: string | null;
	shortTermGoals?: string | null;
	longTermGoals?: string | null;
	pathologyReview?: string | null;
	lifestyleRecommendations?: TreatmentPlanLifestyleRecommendation[];
	movementParagraphs?: string[];
	mindfulnessParagraphs?: string[];
	dietaryInclude?: string[];
	dietaryAvoid?: string[];
	plateSteps?: TreatmentPlanPlateStep[];
	mealPlan?: TreatmentPlanMealPlan;
	supplements?: TreatmentPlanSupplement[];
	dailyHabits?: TreatmentPlanHabit[];
	weeklyHabits?: TreatmentPlanHabit[];
	ratings?: TreatmentPlanRating[];
	disclaimer?: string | null;
	nextAppointment?: string | null;
	pathologyRecommendations?: string | null;
	signedBy?: string | null;
	signedDate?: string | null;
	locale?: string;
};
