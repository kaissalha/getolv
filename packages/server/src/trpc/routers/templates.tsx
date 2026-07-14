import { TreatmentPlanPdf, renderToBuffer } from "@starter/pdf";
import type { TreatmentPlanMealPlan, TreatmentPlanRating, TreatmentPlanSupplement } from "@starter/pdf";

import type { StarterRouterFactoryOptions } from "../shared";

const formatDate = (date: Date) => date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const sampleMealPlan: TreatmentPlanMealPlan = {
	Mon: {
		breakfast: "Greek yoghurt, berries, chia seeds",
		lunch: "Chicken salad with quinoa",
		dinner: "Baked salmon, greens, sweet potato",
		snacks: "Apple with almond butter",
	},
	Tue: {
		breakfast: "Veg omelette with avocado",
		lunch: "Turkey bowl with brown rice",
		dinner: "Beef stir-fry with broccoli",
		snacks: "Carrot sticks and hummus",
	},
	Wed: {
		breakfast: "Protein oats with cinnamon",
		lunch: "Salmon leftovers and salad",
		dinner: "Lentil curry with greens",
		snacks: "Handful of walnuts",
	},
	Thu: {
		breakfast: "Smoothie with protein and berries",
		lunch: "Chicken soup and sourdough",
		dinner: "Turkey meatballs and veg",
		snacks: "Boiled eggs and cucumber",
	},
	Fri: {
		breakfast: "Eggs, spinach, and feta",
		lunch: "Tuna salad with crackers",
		dinner: "Grilled fish tacos in lettuce cups",
		snacks: "Pear with pumpkin seeds",
	},
	Sat: {
		breakfast: "Yoghurt parfait with granola",
		lunch: "Quinoa bowl with roast veg",
		dinner: "Chicken skewers with rice",
		snacks: "Dark chocolate and berries",
	},
	Sun: {
		breakfast: "Poached eggs on toast",
		lunch: "Leftover protein and salad",
		dinner: "Slow-cooked lamb with carrots",
		snacks: "Kefir and kiwi fruit",
	},
};

const sampleSupplements: TreatmentPlanSupplement[] = [
	{
		name: "Vitamin D3",
		dose: "2000 IU daily",
		reason: "Support vitamin D status and immune health",
	},
	{
		name: "Magnesium glycinate",
		dose: "300 mg nightly",
		reason: "Support sleep quality, stress, and muscle relaxation",
	},
	{
		name: "Omega-3 fish oil",
		dose: "2 capsules daily",
		reason: "Support inflammation balance and cardiovascular health",
	},
];

const sampleRatings: TreatmentPlanRating[] = [
	{ key: "energy", label: "Energy", max: 10 },
	{ key: "sleepQuality", label: "Sleep quality", max: 10 },
	{ key: "stress", label: "Stress level", max: 10 },
	{ key: "digestion", label: "Digestion", max: 10 },
	{ key: "mood", label: "Mood", max: 10 },
	{ key: "pain", label: "Pain", max: 10 },
];

export const createTemplatesRouter = ({ createTRPCRouter, organizationProcedure }: StarterRouterFactoryOptions) =>
	createTRPCRouter({
		generateTreatmentPlanPreview: organizationProcedure.mutation(async () => {
			const sessionDate = formatDate(new Date());
			const practitionerName = "Dr. Jane Smith, ND";
			const pdfBuffer = await renderToBuffer(
				<TreatmentPlanPdf
					patient={{
						firstName: "John",
						lastName: "Doe",
						email: "john.doe@example.com",
					}}
					practitioner={{
						name: practitionerName,
						email: "jane.smith@example.com",
					}}
					sessionDate={sessionDate}
					summary="Sample consult summary. Replace with your patient's goals and key observations from today."
					shortTermGoals='Improve sleep quality and establish a consistent morning routine within 4 weeks.'
					longTermGoals='Rebalance hormones and support sustainable energy over the next 6–12 months.'
					pathologyReview='Mild iron deficiency and suboptimal vitamin D noted on recent bloods.'
					mealPlan={sampleMealPlan}
					supplements={sampleSupplements}
					ratings={sampleRatings}
					pathologyRecommendations='Repeat vitamin D, ferritin, B12, and thyroid markers in 8–12 weeks to assess response to treatment.'
					signedBy={practitionerName}
					signedDate={sessionDate}
					locale='en'
				/>
			);

			return {
				base64: Buffer.from(pdfBuffer).toString("base64"),
				filename: "treatment-plan-preview.pdf",
			};
		}),
	});
