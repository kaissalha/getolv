import * as React from "react";

import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { KeepTogether } from "../components/ui/keep-together";
import { getI18n } from "../locales";
import {
	BulletCard,
	ClosingField,
	DietaryItem,
	HabitTracker,
	MealPlanTable,
	PlateCard,
	SupplementTable,
	TextFieldBox,
	splitTreatmentPlanParagraphs,
} from "./treatment-plan-renderers";
import type {
	TreatmentPlanHabit,
	TreatmentPlanLifestyleRecommendation,
	TreatmentPlanMealPlan,
	TreatmentPlanPdfProps,
	TreatmentPlanPlateStep,
	TreatmentPlanRating,
	TreatmentPlanSupplement,
} from "./treatment-plan-types";
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
} from "./treatment-plan-types";

const registerTreatmentPlanFonts = () => {
	Font.register({
		family: "Cormorant Garamond",
		fonts: [
			{
				src: "https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.2.9/files/cormorant-garamond-latin-400-normal.woff",
				fontWeight: 400,
				fontStyle: "normal",
			},
			{
				src: "https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.2.9/files/cormorant-garamond-latin-600-normal.woff",
				fontWeight: 600,
				fontStyle: "normal",
			},
		],
	});

	Font.register({
		family: "DM Sans",
		fonts: [
			{
				src: "https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.2.8/files/dm-sans-latin-400-normal.woff",
				fontWeight: 400,
				fontStyle: "normal",
			},
			{
				src: "https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.2.8/files/dm-sans-latin-700-normal.woff",
				fontWeight: 700,
				fontStyle: "normal",
			},
		],
	});

	Font.registerHyphenationCallback((word) => {
		if (!word) {
			return [""];
		}

		return [word];
	});
};

registerTreatmentPlanFonts();

const treatmentPlanAssetDirectory = [
	resolve(process.cwd(), "packages/pdf/src/templates/assets/treatment-plan"),
	resolve(process.cwd(), "../../packages/pdf/src/templates/assets/treatment-plan"),
	resolve(process.cwd(), "../packages/pdf/src/templates/assets/treatment-plan"),
	resolve(process.cwd(), "src/templates/assets/treatment-plan"),
].find((dir) => existsSync(dir));

const getTreatmentPlanAssetDataUri = ({ name }: { name: string }) => {
	if (!treatmentPlanAssetDirectory) {
		throw new Error("Unable to locate treatment plan assets");
	}

	const assetPath = resolve(treatmentPlanAssetDirectory, name);
	const mimeType = name.endsWith(".png") ? "image/png" : "image/jpeg";

	return `data:${mimeType};base64,${readFileSync(assetPath).toString("base64")}`;
};

const treatmentPlanImages = {
	cover: getTreatmentPlanAssetDataUri({ name: "cover-pears.jpg" }),
	movement: getTreatmentPlanAssetDataUri({ name: "movement-pomegranates.jpg" }),
	dietary: getTreatmentPlanAssetDataUri({ name: "dietary-vegetables.jpg" }),
	plateProtein: getTreatmentPlanAssetDataUri({ name: "plate-protein.jpg" }),
	plateVegetables: getTreatmentPlanAssetDataUri({ name: "plate-vegetables.jpg" }),
	plateCarbs: getTreatmentPlanAssetDataUri({ name: "plate-carbs.jpg" }),
	plateFats: getTreatmentPlanAssetDataUri({ name: "plate-fats.jpg" }),
};

const colors = {
	sage: "#c2c6bb",
	paper: "#f6f4ef",
	title: "#a1a79c",
	text: "#5d4c44",
	line: "#c8ccc3",
	lightLine: "#d9ddd5",
	white: "#fbfaf6",
	placeholder: "#786b64",
};

const coverStripPositions = ["50% 18%", "50% 33%", "50% 48%", "50% 65%", "50% 83%"];
const movementStripPositions = ["50% 10%", "50% 34%", "50% 58%", "50% 82%"];
const styles = StyleSheet.create({
	coverPage: {
		backgroundColor: colors.sage,
		paddingTop: 84,
		paddingBottom: 86,
		paddingHorizontal: 56,
		position: "relative",
		color: colors.white,
	},
	coverLineTop: {
		position: "absolute",
		top: 80,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: colors.white,
	},
	coverLineBottom: {
		position: "absolute",
		bottom: 80,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: colors.white,
	},
	coverDateLabel: {
		fontFamily: "DM Sans",
		fontSize: 22,
		textAlign: "center",
		color: colors.white,
		letterSpacing: 0.6,
	},
	coverTitleWrap: {
		marginTop: 36,
		alignItems: "center",
		paddingHorizontal: 24,
	},
	coverTitle: {
		fontFamily: "Cormorant Garamond",
		fontSize: 76,
		lineHeight: 0.82,
		fontWeight: 600,
		color: colors.white,
		textAlign: "center",
	},
	coverImageColumn: {
		width: 290,
		alignSelf: "center",
		marginTop: 22,
		gap: 8,
	},
	coverImageStrip: {
		width: 290,
		height: 74,
		overflow: "hidden",
	},
	coverImage: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	},
	coverPatientLabel: {
		marginTop: 28,
		fontFamily: "DM Sans",
		fontSize: 22,
		textAlign: "center",
		color: colors.white,
		textTransform: "uppercase",
		letterSpacing: 1.5,
	},
	lightPage: {
		backgroundColor: colors.paper,
		paddingTop: 58,
		paddingBottom: 58,
		paddingHorizontal: 54,
		position: "relative",
		color: colors.text,
	},
	lightTopBand: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 40,
		backgroundColor: colors.sage,
	},
	lightBottomBand: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 40,
		backgroundColor: colors.sage,
	},
	sagePage: {
		backgroundColor: colors.sage,
		paddingTop: 56,
		paddingBottom: 56,
		paddingHorizontal: 54,
		position: "relative",
		color: colors.text,
	},
	summaryPage: {
		backgroundColor: colors.sage,
		paddingTop: 52,
		paddingBottom: 52,
		paddingLeft: 26,
		paddingRight: 116,
		position: "relative",
		color: colors.text,
	},
	summarySideTitle: {
		position: "absolute",
		top: 232,
		right: -154,
		width: 390,
		fontFamily: "Cormorant Garamond",
		fontSize: 96,
		lineHeight: 0.86,
		fontWeight: 400,
		color: colors.white,
		textAlign: "center",
		transform: "rotate(90deg)",
	},
	summarySideLine: {
		position: "absolute",
		top: 552,
		right: 52,
		width: 1.2,
		height: 310,
		backgroundColor: colors.white,
	},
	summaryFields: {
		width: 426,
		gap: 20,
	},
	summaryFieldTitle: {
		fontFamily: "DM Sans",
		fontSize: 18,
		color: colors.white,
		textTransform: "uppercase",
		letterSpacing: 1.2,
		marginBottom: 8,
	},
	summaryFieldBox: {
		backgroundColor: colors.paper,
		paddingTop: 28,
		paddingBottom: 24,
		paddingHorizontal: 30,
	},
	summaryFieldLarge: {
		height: 234,
	},
	summaryFieldMedium: {
		height: 234,
	},
	summaryFieldSmall: {
		height: 236,
	},
	fieldPromptRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 14,
	},
	fieldPromptBullet: {
		fontFamily: "DM Sans",
		fontSize: 20,
		lineHeight: 1,
		color: colors.text,
	},
	fieldPromptText: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 16,
		lineHeight: 1.45,
		color: colors.placeholder,
	},
	fieldValueParagraph: {
		fontFamily: "DM Sans",
		fontSize: 15.5,
		lineHeight: 1.55,
		color: colors.text,
		marginBottom: 10,
	},
	lightTitleRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 18,
		marginTop: 34,
	},
	lightTitle: {
		fontFamily: "Cormorant Garamond",
		fontSize: 66,
		lineHeight: 0.88,
		fontWeight: 400,
		color: colors.title,
	},
	lifestyleTitle: {
		width: 430,
		fontFamily: "Cormorant Garamond",
		fontSize: 54,
		lineHeight: 0.9,
		fontWeight: 400,
		color: colors.title,
	},
	lightTitleCentered: {
		fontFamily: "Cormorant Garamond",
		fontSize: 70,
		lineHeight: 0.88,
		fontWeight: 400,
		color: colors.title,
		textAlign: "center",
	},
	lightTitleLine: {
		flex: 1,
		height: 1.2,
		backgroundColor: colors.title,
		marginTop: 30,
	},
	sageTitleRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 18,
	},
	sageTitle: {
		fontFamily: "Cormorant Garamond",
		fontSize: 70,
		lineHeight: 0.88,
		fontWeight: 400,
		color: colors.white,
	},
	sageTitleLine: {
		flex: 1,
		height: 1.2,
		backgroundColor: colors.white,
		marginTop: 30,
	},
	lifestyleList: {
		marginTop: 34,
	},
	lifestyleRow: {
		flexDirection: "row",
		gap: 22,
		paddingVertical: 18,
		borderBottomWidth: 1.2,
		borderBottomColor: colors.text,
	},
	lifestyleNumber: {
		width: 42,
		fontFamily: "DM Sans",
		fontSize: 18,
		fontWeight: 700,
		color: colors.text,
		textAlign: "center",
		paddingTop: 8,
	},
	lifestyleBody: {
		flex: 1,
	},
	lifestyleItemTitle: {
		fontFamily: "DM Sans",
		fontSize: 19,
		fontWeight: 700,
		color: colors.text,
		marginBottom: 4,
	},
	lifestyleItemText: {
		fontFamily: "DM Sans",
		fontSize: 15.5,
		lineHeight: 1.5,
		color: colors.text,
	},
	movementPage: {
		backgroundColor: colors.sage,
		paddingTop: 62,
		paddingBottom: 54,
		paddingLeft: 62,
		paddingRight: 62,
		position: "relative",
		color: colors.text,
	},
	movementStrips: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		width: 140,
		gap: 12,
	},
	movementStrip: {
		flex: 1,
		overflow: "hidden",
	},
	movementStripImage: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	},
	movementContent: {
		width: 340,
	},
	movementSection: {
		marginBottom: 34,
	},
	movementTitle: {
		width: 340,
		fontFamily: "Cormorant Garamond",
		fontSize: 58,
		lineHeight: 0.9,
		fontWeight: 400,
		color: colors.white,
		marginBottom: 18,
	},
	copyCard: {
		backgroundColor: colors.paper,
		paddingTop: 22,
		paddingBottom: 22,
		paddingHorizontal: 26,
	},
	copyBulletRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 18,
	},
	copyBullet: {
		fontFamily: "DM Sans",
		fontSize: 20,
		lineHeight: 1,
		color: colors.text,
	},
	copyBulletText: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 16,
		lineHeight: 1.6,
		color: colors.text,
	},
	copyBulletLead: {
		fontWeight: 700,
	},
	dietaryHeaderImageWrap: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 136,
		overflow: "hidden",
	},
	dietaryHeaderImage: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		objectPosition: "50% 35%",
	},
	dietaryContent: {
		marginTop: 146,
	},
	dietaryColumns: {
		flexDirection: "row",
		gap: 36,
		marginTop: 42,
	},
	dietaryColumn: {
		flex: 1,
		gap: 28,
	},
	dietaryRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 18,
	},
	dietaryIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.title,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 4,
	},
	dietaryText: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 15.5,
		lineHeight: 1.55,
		color: colors.text,
	},
	dietaryLead: {
		fontWeight: 700,
	},
	plateCards: {
		marginTop: 34,
		gap: 14,
	},
	plateCard: {
		flexDirection: "row",
		backgroundColor: colors.paper,
	},
	plateImage: {
		width: 96,
		height: 118,
		objectFit: "cover",
	},
	plateCardBody: {
		flex: 1,
		paddingTop: 14,
		paddingBottom: 12,
		paddingHorizontal: 20,
	},
	plateCardTitle: {
		fontFamily: "DM Sans",
		fontSize: 18,
		fontWeight: 700,
		color: colors.text,
		marginBottom: 4,
	},
	plateCardHint: {
		fontFamily: "DM Sans",
		fontSize: 15.5,
		lineHeight: 1.4,
		color: colors.text,
		marginBottom: 4,
	},
	plateChooseLabel: {
		fontFamily: "DM Sans",
		fontSize: 15.5,
		lineHeight: 1.4,
		color: colors.text,
		marginBottom: 2,
	},
	plateItemText: {
		fontFamily: "DM Sans",
		fontSize: 15.2,
		lineHeight: 1.45,
		color: colors.text,
		marginBottom: 2,
	},
	plateItemLead: {
		fontWeight: 700,
	},
	tableWrap: {
		marginTop: 40,
	},
	mealPlanTitle: {
		fontFamily: "Cormorant Garamond",
		fontSize: 62,
		lineHeight: 0.9,
		fontWeight: 400,
		color: colors.title,
		textAlign: "center",
	},
	mealPlanTableWrap: {
		marginTop: 62,
	},
	mealPlanTable: {
		borderWidth: 1.2,
		borderColor: colors.line,
	},
	mealPlanHeaderRow: {
		flexDirection: "row",
	},
	mealPlanBlankHeader: {
		width: 74,
		height: 48,
		backgroundColor: colors.sage,
		borderRightWidth: 1.2,
		borderRightColor: colors.line,
	},
	mealPlanHeaderCell: {
		flex: 1,
		height: 48,
		backgroundColor: colors.sage,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1.2,
		borderRightColor: colors.line,
	},
	mealPlanHeaderCellLast: {
		borderRightWidth: 0,
	},
	mealPlanHeaderText: {
		fontFamily: "DM Sans",
		fontSize: 13,
		fontWeight: 700,
		color: colors.text,
	},
	mealPlanRow: {
		flexDirection: "row",
		borderTopWidth: 1.2,
		borderTopColor: colors.line,
	},
	mealPlanDayCell: {
		width: 74,
		minHeight: 80,
		backgroundColor: colors.sage,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1.2,
		borderRightColor: colors.line,
		paddingHorizontal: 8,
	},
	mealPlanDayText: {
		fontFamily: "DM Sans",
		fontSize: 14,
		fontWeight: 700,
		color: colors.text,
	},
	mealPlanCell: {
		flex: 1,
		minHeight: 80,
		borderRightWidth: 1.2,
		borderRightColor: colors.line,
		paddingTop: 10,
		paddingBottom: 10,
		paddingHorizontal: 10,
	},
	mealPlanCellLast: {
		borderRightWidth: 0,
	},
	mealPlanCellText: {
		fontFamily: "DM Sans",
		fontSize: 12.5,
		lineHeight: 1.4,
		color: colors.text,
	},
	supplementTable: {
		marginTop: 48,
		borderWidth: 1.6,
		borderColor: colors.lightLine,
	},
	supplementTitle: {
		width: 356,
		fontFamily: "Cormorant Garamond",
		fontSize: 56,
		lineHeight: 0.88,
		fontWeight: 400,
		color: colors.white,
	},
	supplementTableWrap: {
		marginTop: 26,
	},
	supplementHeaderRow: {
		flexDirection: "row",
		backgroundColor: colors.paper,
	},
	supplementRow: {
		flexDirection: "row",
		borderTopWidth: 1.6,
		borderTopColor: colors.lightLine,
	},
	supplementHeaderCell: {
		height: 54,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1.6,
		borderRightColor: colors.lightLine,
	},
	supplementCell: {
		minHeight: 82,
		paddingTop: 16,
		paddingBottom: 16,
		paddingHorizontal: 14,
		borderRightWidth: 1.6,
		borderRightColor: colors.lightLine,
	},
	supplementNameColumn: {
		width: "34%",
	},
	supplementDoseColumn: {
		width: "22%",
	},
	supplementReasonColumn: {
		flex: 1,
		borderRightWidth: 0,
	},
	supplementHeaderText: {
		fontFamily: "DM Sans",
		fontSize: 13,
		fontWeight: 700,
		color: colors.text,
	},
	supplementCellText: {
		fontFamily: "DM Sans",
		fontSize: 14,
		lineHeight: 1.45,
		color: colors.text,
	},
	habitPageContent: {
		marginTop: 24,
	},
	habitDateRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 12,
		marginBottom: 18,
		paddingHorizontal: 20,
	},
	habitDateLabel: {
		fontFamily: "DM Sans",
		fontSize: 18,
		color: colors.text,
	},
	habitDateLine: {
		width: 160,
		borderBottomWidth: 1,
		borderBottomColor: colors.text,
	},
	habitDailyHeader: {
		height: 46,
		backgroundColor: colors.sage,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	habitDailyTitle: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 17,
		color: colors.text,
		textTransform: "uppercase",
		letterSpacing: 3,
	},
	habitHeaderDay: {
		width: 36,
		textAlign: "center",
		fontFamily: "DM Sans",
		fontSize: 14,
		color: colors.text,
		letterSpacing: 1.2,
	},
	habitDailyRows: {
		marginTop: 20,
	},
	habitDailyRow: {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 38,
	},
	habitLabel: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 16,
		color: colors.text,
		paddingStart: 20,
	},
	habitCell: {
		width: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	habitSquare: {
		width: 24,
		height: 24,
		borderWidth: 1.2,
		borderColor: colors.line,
	},
	habitFooterRow: {
		flexDirection: "row",
		gap: 26,
		marginTop: 28,
	},
	habitFooterColumn: {
		flex: 1,
	},
	habitFooterHeader: {
		height: 44,
		backgroundColor: colors.sage,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 14,
	},
	habitFooterHeaderText: {
		fontFamily: "DM Sans",
		fontSize: 16,
		color: colors.text,
		textTransform: "uppercase",
		letterSpacing: 3,
	},
	weeklyHabitRow: {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 36,
	},
	weeklyHabitLabel: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 15.5,
		color: colors.text,
		paddingStart: 20,
	},
	weeklyHabitBoxWrap: {
		width: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	weeklyHabitBox: {
		width: 24,
		height: 24,
		borderWidth: 1.2,
		borderColor: colors.line,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 36,
		paddingStart: 20,
		paddingEnd: 18,
	},
	ratingLabel: {
		flex: 1,
		fontFamily: "DM Sans",
		fontSize: 15.5,
		color: colors.text,
	},
	ratingText: {
		fontFamily: "DM Sans",
		fontSize: 15.5,
		color: colors.line,
	},
	closingContent: {
		marginTop: 54,
		gap: 20,
	},
	closingField: {
		backgroundColor: colors.paper,
		paddingTop: 18,
		paddingBottom: 18,
		paddingHorizontal: 22,
	},
	closingMediumField: {
		height: 192,
	},
	closingLargeField: {
		minHeight: 306,
	},
	closingFieldLabel: {
		fontFamily: "DM Sans",
		fontSize: 19,
		color: colors.text,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 12,
	},
	closingFieldText: {
		fontFamily: "DM Sans",
		fontSize: 14.8,
		lineHeight: 1.65,
		color: colors.text,
		marginBottom: 10,
	},
	disclaimerLead: {
		fontWeight: 700,
	},
	signatureRow: {
		flexDirection: "row",
		gap: 24,
	},
	signatureField: {
		flex: 1,
		height: 98,
		backgroundColor: colors.paper,
		paddingTop: 18,
		paddingBottom: 18,
		paddingHorizontal: 18,
	},
	signatureLabel: {
		fontFamily: "DM Sans",
		fontSize: 18,
		color: colors.text,
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	signatureValue: {
		marginTop: 18,
		fontFamily: "DM Sans",
		fontSize: 15.2,
		lineHeight: 1.45,
		color: colors.text,
	},
});

const emptyMealPlan: TreatmentPlanMealPlan = {};
const emptySupplements: TreatmentPlanSupplement[] = [];

const defaultLifestyle: TreatmentPlanLifestyleRecommendation[] = [
	{
		title: "Prioritise quality sleep",
		description:
			"Aim for 7-9 hours of sleep per night. Create a relaxing bedtime routine and avoid caffeine & alcohol 4-6 hrs before bed. Use warm dim lighting at night and limit screens.",
	},
	{
		title: "Optimise sun exposure",
		description:
			"Get 10 minutes of morning sunlight upon waking to help calibrate your circadian rhythm & hormones. Expose your skin to direct sun for 20 minutes during the day for vitamin D.",
	},
	{
		title: "Reduce toxin exposure",
		description:
			"Switch to natural, 'phthalate & paraben free' cosmetics, personal care & cleaning products. Use stainless or glass instead of plastic. Invest in a good water filter.",
	},
	{
		title: "Prioritise hydration and electrolytes",
		description:
			"Begin your day with a glass of water and a pinch of sea salt or electrolyte powder. Sip water throughout the day aiming for 2.5L. Mix it up with a splash of fruit juice or lemon & mint.",
	},
	{
		title: "Reduce alcohol intake",
		description:
			"Alcohol is highly toxic to the body and places a burden on the liver, so it's important to limit it as much as possible. Limit to less than 1-2 drinks per day and less than 5 per week.",
	},
];

const defaultMovement = [
	"30 minutes moderate intensity exercise daily: This can include brisk walking, jogging, cycling, swimming, pilates, skipping or rebounding. Moderate-intensity exercise enhances circulation and cardiovascular health.",
	"Strength training 2-3x weekly: This can include body-weight exercises such as pushups, squats, lunges, lifting weights or reformer pilates. Strength training is important for metabolism, bone density, and muscle maintenance.",
];

const defaultMindfulness = [
	"30 minutes daily mindfulness practice: This can include journaling, deep breathing exercises, or mindful meditation. These activities reduce stress, promote emotional clarity, and help ground your thoughts, enhancing overall mental well-being.",
	"30 minutes in nature daily: Engage in a walk through nature or spend time in a park. Nature helps reduce cortisol levels, improves mood, and enhances creativity, to support overall mood and nervous system regulation.",
];

const defaultInclude = [
	"High quality protein: eggs, halloumi, feta, Greek yoghurt, fish (salmon, sardines, mackerel), chicken, turkey, grass fed meats.",
	"Omega-3 fats: salmon, mackerel, sardines, anchovies, chia seeds, flaxseeds, walnuts, hemp seeds, and algae oil.",
	"Zinc-rich foods: oysters, red meat (beef, lamb, turkey), chickpeas, cashews, pumpkin seeds, hemp seeds, and quinoa.",
	"Magnesium-rich foods: almonds, pumpkin seeds, spinach, dark chocolate, sunflower seeds, cashews, chia seeds, avocados, and legumes.",
	"Fermented foods: sauerkraut, kimchi, kefir, kombucha, miso, tempeh, yoghurt.",
];

const defaultAvoid = [
	"Refined Sugars: Soft drinks, lollies, baked goods (cakes, pastries), cereals, fruit juice and sugary, processed snacks.",
	"Refined Carbohydrates: White bread, white pasta, baked goods, and other refined grain products that lack fibre.",
	"Refined Vegetable Oils: Soybean oil, canola oil, corn oil, sunflower oil, safflower oil, grapeseed oil, and rice bran oil.",
	"Additives & Preservatives: MSG, sodium benzoate, nitrates, nitrites, artificial colours, flavours, sweeteners.",
	"Excess Sodium: Processed snacks, canned soups, fast food, instant noodles, and condiments (soy sauce, table salt, stocks).",
];

const defaultPlateSteps: TreatmentPlanPlateStep[] = [
	{
		title: "Begin with the protein",
		hint: "Include a palm-sized portion at each meal.",
		items: [
			"Animal protein: eggs, halloumi, feta, Greek yoghurt, fish (salmon, sardines, mackerel), chicken, turkey, grass fed meats",
			"Plant protein: tempeh, tofu, beans, lentils, chickpeas, edamame, quinoa, buckwheat, protein powder, nuts & seeds.",
		],
	},
	{
		title: "Add your vegetables",
		hint: "Aim for half your plate to be full of veg.",
		items: [
			"Cruciferous veg: broccoli, Brussels sprouts, cauliflower, cabbage",
			"Leafy greens: kale, silverbeet, spinach, bok choy",
			"Colourful veg: carrots, capsicum, radish, onion, tomato, pumpkin, beetroot, asparagus, fennel, green beans",
		],
	},
	{
		title: "Add your carbs",
		hint: "Aim for 1/4 of your plate to be complex carbs.",
		items: [
			"Wholegrains & legumes: oats, brown rice, quinoa, buckwheat, beans, lentils, chickpeas, rye, spelt, polenta",
			"Fruit & veg: potato, sweet potato, pumpkin, beetroot, parsnip, corn, berries, banana, pineapple, dates, mango, kiwi, stonefruit",
		],
	},
	{
		title: "Add your healthy fats",
		hint: "Aim for 1-2 tablespoons of healthy fats at every meal.",
		items: [
			"Good quality extra virgin olive oil, coconut oil, coconut cream, avocado oil, flax oil",
			"Nuts & seeds: walnuts, almonds, cashews, Brazil nuts, hempseeds flaxseeds, pepitas",
			"Oily fish: salmon, sardines, mackerel, tuna, trout",
		],
	},
];

const defaultDailyHabits: TreatmentPlanHabit[] = [
	{ key: "morningSunlight", label: "Morning sunlight" },
	{ key: "supplements", label: "Supplements" },
	{ key: "balancedBreakfast", label: "Balanced breakfast" },
	{ key: "sixServesVegetables", label: "6 serves vegetables" },
	{ key: "proteinEveryMeal", label: "Protein at every meal" },
	{ key: "sleep", label: "7-9 hours sleep" },
	{ key: "socialConnection", label: "Social connection" },
	{ key: "steps", label: "8000 steps" },
	{ key: "exercise", label: "30 minutes exercise" },
	{ key: "mindfulness", label: "10 minutes mindfulness" },
	{ key: "water", label: "2.5 L filtered water" },
];

const defaultWeeklyHabits: TreatmentPlanHabit[] = [
	{ key: "plantDiversity", label: "30 different plants" },
	{ key: "mealPrep", label: "Meal plan & prep" },
	{ key: "strengthTraining", label: "2-3x strength training" },
	{ key: "digitalDetox", label: "1x digital detox day" },
	{ key: "oilyFish", label: "3 serves oily fish" },
	{ key: "alcohol", label: "< 3 alcoholic drinks" },
];

const defaultRatings: TreatmentPlanRating[] = [
	{ key: "energy", label: "Energy", max: 10 },
	{ key: "sleepQuality", label: "Sleep quality", max: 10 },
	{ key: "stress", label: "Stress level", max: 10 },
	{ key: "digestion", label: "Digestion", max: 10 },
	{ key: "mood", label: "Mood", max: 10 },
	{ key: "pain", label: "Pain", max: 10 },
];

const defaultDisclaimer =
	"This treatment plan is designed to support your overall health and well-being. It is based on the information you have provided and the findings from your consultation. The recommendations in this plan are intended to complement, not replace, any medical treatments you may be receiving.\n\nIf you experience any adverse reactions or unexpected symptoms, please contact me or seek medical attention immediately.\n\nYour active participation and adherence to the recommended plan are crucial for achieving the best possible outcomes. Regular follow-ups are essential to monitor your progress and make any necessary adjustments to your treatment.";

export const TreatmentPlanPdf = ({
	patient,
	practitioner,
	sessionDate,
	summary: _summary,
	shortTermGoals,
	longTermGoals,
	pathologyReview,
	lifestyleRecommendations = defaultLifestyle,
	movementParagraphs = defaultMovement,
	mindfulnessParagraphs = defaultMindfulness,
	dietaryInclude = defaultInclude,
	dietaryAvoid = defaultAvoid,
	plateSteps = defaultPlateSteps,
	mealPlan = emptyMealPlan,
	supplements = emptySupplements,
	dailyHabits = defaultDailyHabits,
	weeklyHabits = defaultWeeklyHabits,
	ratings = defaultRatings,
	disclaimer = defaultDisclaimer,
	pathologyRecommendations,
	signedBy,
	signedDate,
	locale = "en",
}: TreatmentPlanPdfProps) => {
	const { t } = getI18n({ locale });
	const patientFullName = `${patient.firstName} ${patient.lastName}`.trim();
	const patientDisplayName = patientFullName.length > 0 ? patientFullName : patient.email;
	const disclaimerParagraphs = splitTreatmentPlanParagraphs(disclaimer);

	return (
		<Document>
			<Page size='A4' style={styles.coverPage} wrap={false}>
				<View style={styles.coverLineTop} />
				<View style={styles.coverLineBottom} />
				<Text style={styles.coverDateLabel}>{sessionDate}</Text>
				<View style={styles.coverTitleWrap}>
					<Text style={styles.coverTitle}>TREATMENT</Text>
					<Text style={styles.coverTitle}>PLAN</Text>
				</View>
				<View style={styles.coverImageColumn}>
					{coverStripPositions.map((position) => (
						<View key={position} style={styles.coverImageStrip}>
							<Image
								src={treatmentPlanImages.cover}
								style={[styles.coverImage, { objectPosition: position }]}
							/>
						</View>
					))}
				</View>
				<Text style={styles.coverPatientLabel}>{patientDisplayName}</Text>
			</Page>

			<Page size='A4' style={styles.summaryPage} wrap={false}>
				<Text style={styles.summarySideTitle}>SUMMARY</Text>
				<View style={styles.summarySideLine} />
				<View style={styles.summaryFields}>
					<TextFieldBox
						styles={styles}
						title={t("treatmentPlan.shortTermLabel")}
						value={shortTermGoals}
						placeholder={t("treatmentPlan.summaryPlaceholder")}
						sizeStyle={styles.summaryFieldLarge}
					/>
					<TextFieldBox
						styles={styles}
						title={t("treatmentPlan.longTermLabel")}
						value={longTermGoals}
						placeholder={t("treatmentPlan.longTermPlaceholder")}
						sizeStyle={styles.summaryFieldMedium}
					/>
					<TextFieldBox
						styles={styles}
						title={t("treatmentPlan.pathologyLabel")}
						value={pathologyReview}
						placeholder={t("treatmentPlan.pathologyPlaceholder")}
						sizeStyle={styles.summaryFieldSmall}
					/>
				</View>
			</Page>

			<Page size='A4' style={styles.lightPage} wrap={false}>
				<View style={styles.lightTopBand} />
				<View style={styles.lightBottomBand} />
				<View style={styles.lightTitleRow}>
					<Text style={styles.lifestyleTitle}>LIFESTYLE{"\n"}RECOMMENDATIONS</Text>
					<View style={styles.lightTitleLine} />
				</View>
				<View style={styles.lifestyleList}>
					{lifestyleRecommendations.map((item, index) => (
						<KeepTogether key={item.title}>
							<View style={styles.lifestyleRow}>
								<Text style={styles.lifestyleNumber}>{index + 1}</Text>
								<View style={styles.lifestyleBody}>
									<Text style={styles.lifestyleItemTitle}>{item.title}</Text>
									<Text style={styles.lifestyleItemText}>{item.description}</Text>
								</View>
							</View>
						</KeepTogether>
					))}
				</View>
			</Page>

			<Page size='A4' style={styles.movementPage} wrap={false}>
				<View style={styles.movementStrips}>
					{movementStripPositions.map((position) => (
						<View key={position} style={styles.movementStrip}>
							<Image
								src={treatmentPlanImages.movement}
								style={[styles.movementStripImage, { objectPosition: position }]}
							/>
						</View>
					))}
				</View>
				<View style={styles.movementContent}>
					<View style={styles.movementSection}>
						<Text style={styles.movementTitle}>MOVEMENT</Text>
						<BulletCard paragraphs={movementParagraphs} styles={styles} />
					</View>
					<View style={styles.movementSection}>
						<Text style={styles.movementTitle}>MINDFULNESS</Text>
						<BulletCard paragraphs={mindfulnessParagraphs} styles={styles} />
					</View>
				</View>
			</Page>

			<Page size='A4' style={styles.lightPage} wrap={false}>
				<View style={styles.dietaryHeaderImageWrap}>
					<Image src={treatmentPlanImages.dietary} style={styles.dietaryHeaderImage} />
				</View>
				<View style={styles.lightBottomBand} />
				<View style={styles.dietaryContent}>
					<Text style={[styles.lightTitleCentered, { fontSize: 52 }]}>DIETARY{"\n"}RECOMMENDATIONS</Text>
					<View style={styles.dietaryColumns}>
						<View style={styles.dietaryColumn}>
							{dietaryInclude.map((item) => (
								<DietaryItem
									key={item}
									iconColor={colors.white}
									item={item}
									styles={styles}
									type='include'
								/>
							))}
						</View>
						<View style={styles.dietaryColumn}>
							{dietaryAvoid.map((item) => (
								<DietaryItem
									key={item}
									iconColor={colors.white}
									item={item}
									styles={styles}
									type='avoid'
								/>
							))}
						</View>
					</View>
				</View>
			</Page>

			<Page size='A4' style={styles.sagePage} wrap={false}>
				<View style={styles.sageTitleRow}>
					<Text style={[styles.sageTitle, { fontSize: 62 }]}>BUILDING{"\n"}A HEALTHY PLATE</Text>
					<View style={styles.sageTitleLine} />
				</View>
				<View style={styles.plateCards}>
					{plateSteps.map((step, index) => (
						<PlateCard
							key={step.title}
							index={index}
							plateImages={treatmentPlanImages}
							step={step}
							styles={styles}
						/>
					))}
				</View>
			</Page>

			<Page size='A4' style={styles.lightPage} wrap={false}>
				<View style={styles.lightTopBand} />
				<View style={styles.lightBottomBand} />
				<View style={styles.tableWrap}>
					<Text style={styles.mealPlanTitle}>MEAL PLAN</Text>
					<View style={styles.mealPlanTableWrap}>
						<MealPlanTable mealPlan={mealPlan} styles={styles} />
					</View>
				</View>
			</Page>

			<Page size='A4' style={styles.sagePage} wrap={false}>
				<View style={styles.sageTitleRow}>
					<Text style={styles.supplementTitle}>SUPPLEMENT{"\n"}PRESCRIPTION</Text>
					<View style={styles.sageTitleLine} />
				</View>
				<View style={styles.supplementTableWrap}>
					<SupplementTable styles={styles} supplements={supplements} />
				</View>
			</Page>

			<Page size='A4' style={styles.lightPage} wrap={false}>
				<View style={styles.lightTopBand} />
				<View style={styles.lightBottomBand} />
				<Text style={styles.lightTitleCentered}>HABIT TRACKER</Text>
				<HabitTracker
					dailyHabits={dailyHabits}
					weeklyHabits={weeklyHabits}
					ratings={ratings}
					styles={styles}
					dateLabel={`${t("treatmentPlan.date")}:`}
				/>
			</Page>

			<Page size='A4' style={styles.sagePage} wrap={false}>
				<View style={styles.closingContent}>
					<ClosingField
						label={`${t("treatmentPlan.pathologyRecommendations")}:`}
						value={pathologyRecommendations}
						styles={styles}
						style={styles.closingMediumField}
					/>
					<View style={[styles.closingField, styles.closingLargeField]}>
						<Text style={styles.closingFieldText}>
							<Text style={styles.disclaimerLead}>{`${t("treatmentPlan.pleaseNote")} `}</Text>
							{disclaimerParagraphs[0] ?? ""}
						</Text>
						{disclaimerParagraphs.slice(1).map((paragraph) => (
							<Text key={paragraph} style={styles.closingFieldText}>
								{paragraph}
							</Text>
						))}
					</View>
					<View style={styles.signatureRow}>
						<View style={styles.signatureField}>
							<Text style={styles.signatureLabel}>{`${t("treatmentPlan.signed")}:`}</Text>
							<Text style={styles.signatureValue}>{signedBy ?? practitioner.name}</Text>
						</View>
						<View style={styles.signatureField}>
							<Text style={styles.signatureLabel}>{`${t("treatmentPlan.date")}:`}</Text>
							<Text style={styles.signatureValue}>{signedDate ?? sessionDate}</Text>
						</View>
					</View>
				</View>
			</Page>
		</Document>
	);
};
