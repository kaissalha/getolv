import * as React from "react";

import { Image, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

import { KeepTogether } from "../components/ui/keep-together";
import {
	DAYS_OF_WEEK,
	type DayOfWeek,
	type TreatmentPlanHabit,
	type TreatmentPlanMealPlan,
	type TreatmentPlanPlateStep,
	type TreatmentPlanRating,
	type TreatmentPlanSupplement,
} from "./treatment-plan-types";

type TreatmentPlanStyles = Record<string, Style>;

type TreatmentPlanPlateImages = {
	plateProtein: string;
	plateVegetables: string;
	plateCarbs: string;
	plateFats: string;
};

const habitTrackerDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const splitLead = (value: string) => {
	const separatorIndex = value.indexOf(":");

	if (separatorIndex === -1) {
		return {
			lead: "",
			rest: value,
		};
	}

	return {
		lead: value.slice(0, separatorIndex + 1),
		rest: value.slice(separatorIndex + 1).trimStart(),
	};
};

export const splitTreatmentPlanParagraphs = (value?: string | null) => {
	if (!value) {
		return [];
	}

	return value
		.split(/\n\s*\n/g)
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph.length > 0);
};

const getPlateImage = ({
	index,
	plateImages,
	title,
}: {
	index: number;
	plateImages: TreatmentPlanPlateImages;
	title: string;
}) => {
	const normalizedTitle = title.toLowerCase();

	if (normalizedTitle.includes("protein")) {
		return plateImages.plateProtein;
	}

	if (normalizedTitle.includes("vegetable")) {
		return plateImages.plateVegetables;
	}

	if (normalizedTitle.includes("carb")) {
		return plateImages.plateCarbs;
	}

	if (normalizedTitle.includes("fat")) {
		return plateImages.plateFats;
	}

	const fallbackImages = [
		plateImages.plateProtein,
		plateImages.plateVegetables,
		plateImages.plateCarbs,
		plateImages.plateFats,
	];

	return fallbackImages[index % fallbackImages.length];
};

const CheckIcon = ({ color }: { color: string }) => {
	return (
		<Svg viewBox='0 0 24 24' style={{ width: 22, height: 22 }}>
			<Path fill='none' stroke={color} strokeWidth={3} d='M4 13.5l5 5L20 6.5' />
		</Svg>
	);
};

const CrossIcon = ({ color }: { color: string }) => {
	return (
		<Svg viewBox='0 0 24 24' style={{ width: 22, height: 22 }}>
			<Path fill='none' stroke={color} strokeWidth={3} d='M6 6l12 12M18 6L6 18' />
		</Svg>
	);
};

export const TextFieldBox = ({
	placeholder,
	sizeStyle,
	styles,
	title,
	value,
}: {
	placeholder: string;
	sizeStyle: Style;
	styles: TreatmentPlanStyles;
	title: string;
	value?: string | null;
}) => {
	const paragraphs = splitTreatmentPlanParagraphs(value);

	return (
		<View>
			<Text style={styles.summaryFieldTitle}>{title}</Text>
			<View style={[styles.summaryFieldBox, sizeStyle]}>
				{paragraphs.length > 0 ? (
					paragraphs.map((paragraph) => (
						<Text key={paragraph} style={styles.fieldValueParagraph}>
							{paragraph}
						</Text>
					))
				) : (
					<View style={styles.fieldPromptRow}>
						<Text style={styles.fieldPromptBullet}>•</Text>
						<Text style={styles.fieldPromptText}>{placeholder}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

export const DietaryItem = ({
	iconColor,
	item,
	styles,
	type,
}: {
	iconColor: string;
	item: string;
	styles: TreatmentPlanStyles;
	type: "include" | "avoid";
}) => {
	const { lead, rest } = splitLead(item);

	return (
		<View style={styles.dietaryRow}>
			<View style={styles.dietaryIcon}>
				{type === "include" ? <CheckIcon color={iconColor} /> : <CrossIcon color={iconColor} />}
			</View>
			<Text style={styles.dietaryText}>
				{lead ? <Text style={styles.dietaryLead}>{lead}</Text> : null}
				{lead && rest ? " " : ""}
				{rest || item}
			</Text>
		</View>
	);
};

export const BulletCard = ({ paragraphs, styles }: { paragraphs: string[]; styles: TreatmentPlanStyles }) => {
	return (
		<View style={styles.copyCard}>
			{paragraphs.map((paragraph) => {
				const { lead, rest } = splitLead(paragraph);

				return (
					<View key={paragraph} style={styles.copyBulletRow}>
						<Text style={styles.copyBullet}>•</Text>
						<Text style={styles.copyBulletText}>
							{lead ? <Text style={styles.copyBulletLead}>{lead}</Text> : null}
							{lead && rest ? " " : ""}
							{rest || paragraph}
						</Text>
					</View>
				);
			})}
		</View>
	);
};

export const PlateCard = ({
	index,
	plateImages,
	step,
	styles,
}: {
	index: number;
	plateImages: TreatmentPlanPlateImages;
	step: TreatmentPlanPlateStep;
	styles: TreatmentPlanStyles;
}) => {
	return (
		<KeepTogether key={step.title}>
			<View style={styles.plateCard}>
				<Image src={getPlateImage({ index, plateImages, title: step.title })} style={styles.plateImage} />
				<View style={styles.plateCardBody}>
					<Text style={styles.plateCardTitle}>{step.title}</Text>
					{step.hint ? <Text style={styles.plateCardHint}>{step.hint}</Text> : null}
					<Text style={styles.plateChooseLabel}>Choose from:</Text>
					{step.items.map((item) => {
						const { lead, rest } = splitLead(item);

						return (
							<Text key={`${step.title}-${item}`} style={styles.plateItemText}>
								{lead ? <Text style={styles.plateItemLead}>{lead}</Text> : null}
								{lead && rest ? " " : ""}
								{rest || item}
							</Text>
						);
					})}
				</View>
			</View>
		</KeepTogether>
	);
};

export const MealPlanTable = ({
	mealPlan,
	styles,
}: {
	mealPlan: TreatmentPlanMealPlan;
	styles: TreatmentPlanStyles;
}) => {
	const columns = ["breakfast", "lunch", "dinner", "snacks"] as const;
	const columnLabels: Record<(typeof columns)[number], string> = {
		breakfast: "Breakfast",
		lunch: "Lunch",
		dinner: "Dinner",
		snacks: "Snacks",
	};
	const mealPlanDayLabels: Record<DayOfWeek, string> = {
		Mon: "Mon",
		Tue: "Tues",
		Wed: "Wed",
		Thu: "Thurs",
		Fri: "Fri",
		Sat: "Sat",
		Sun: "Sun",
	};

	return (
		<View style={styles.mealPlanTable}>
			<View style={styles.mealPlanHeaderRow}>
				<View style={styles.mealPlanBlankHeader} />
				{columns.map((column, index) => (
					<View
						key={column}
						style={[
							styles.mealPlanHeaderCell,
							index === columns.length - 1 ? styles.mealPlanHeaderCellLast : {},
						]}
					>
						<Text style={styles.mealPlanHeaderText}>{columnLabels[column]}</Text>
					</View>
				))}
			</View>
			{DAYS_OF_WEEK.map((day) => {
				const entries = mealPlan[day] ?? {};

				return (
					<View key={day} style={styles.mealPlanRow}>
						<View style={styles.mealPlanDayCell}>
							<Text style={styles.mealPlanDayText}>{mealPlanDayLabels[day]}</Text>
						</View>
						{columns.map((column, index) => (
							<View
								key={`${day}-${column}`}
								style={[
									styles.mealPlanCell,
									index === columns.length - 1 ? styles.mealPlanCellLast : {},
								]}
							>
								<Text style={styles.mealPlanCellText}>{entries[column] ?? ""}</Text>
							</View>
						))}
					</View>
				);
			})}
		</View>
	);
};

export const SupplementTable = ({
	styles,
	supplements,
}: {
	styles: TreatmentPlanStyles;
	supplements: TreatmentPlanSupplement[];
}) => {
	const rows: Array<TreatmentPlanSupplement & { rowKey: string }> =
		supplements.length > 0
			? supplements.map((supplement, index) => ({
					...supplement,
					rowKey: `${supplement.name}-${supplement.dose}-${index}`,
				}))
			: Array.from({ length: 6 }).map((_, index) => ({
					name: "",
					dose: "",
					reason: "",
					rowKey: `blank-${index}`,
				}));

	return (
		<View style={styles.supplementTable}>
			<View style={styles.supplementHeaderRow}>
				<View style={[styles.supplementHeaderCell, styles.supplementNameColumn]}>
					<Text style={styles.supplementHeaderText}>Supplement</Text>
				</View>
				<View style={[styles.supplementHeaderCell, styles.supplementDoseColumn]}>
					<Text style={styles.supplementHeaderText}>Dose</Text>
				</View>
				<View style={[styles.supplementHeaderCell, styles.supplementReasonColumn]}>
					<Text style={styles.supplementHeaderText}>Reason</Text>
				</View>
			</View>
			{rows.map((row) => {
				return (
					<View key={row.rowKey} style={styles.supplementRow}>
						<View style={[styles.supplementCell, styles.supplementNameColumn]}>
							<Text style={styles.supplementCellText}>{row.name}</Text>
						</View>
						<View style={[styles.supplementCell, styles.supplementDoseColumn]}>
							<Text style={styles.supplementCellText}>{row.dose}</Text>
						</View>
						<View style={[styles.supplementCell, styles.supplementReasonColumn]}>
							<Text style={styles.supplementCellText}>{row.reason}</Text>
						</View>
					</View>
				);
			})}
		</View>
	);
};

export const HabitTracker = ({
	dailyHabits,
	dateLabel,
	ratings,
	styles,
	weeklyHabits,
}: {
	dailyHabits: TreatmentPlanHabit[];
	dateLabel: string;
	ratings: TreatmentPlanRating[];
	styles: TreatmentPlanStyles;
	weeklyHabits: TreatmentPlanHabit[];
}) => {
	return (
		<View style={styles.habitPageContent}>
			<View style={styles.habitDateRow}>
				<Text style={styles.habitDateLabel}>{dateLabel}</Text>
				<View style={styles.habitDateLine} />
			</View>
			<View style={styles.habitDailyHeader}>
				<Text style={styles.habitDailyTitle}>Daily habits</Text>
				{habitTrackerDays.map((day) => (
					<Text key={day} style={styles.habitHeaderDay}>
						{day}
					</Text>
				))}
			</View>
			<View style={styles.habitDailyRows}>
				{dailyHabits.map((habit) => (
					<View key={habit.key} style={styles.habitDailyRow}>
						<Text style={styles.habitLabel}>{habit.label}</Text>
						{habitTrackerDays.map((day) => (
							<View key={`${habit.key}-${day}`} style={styles.habitCell}>
								<View style={styles.habitSquare} />
							</View>
						))}
					</View>
				))}
			</View>
			<View style={styles.habitFooterRow}>
				<View style={styles.habitFooterColumn}>
					<View style={styles.habitFooterHeader}>
						<Text style={styles.habitFooterHeaderText}>Weekly habits</Text>
					</View>
					{weeklyHabits.map((habit) => (
						<View key={habit.key} style={styles.weeklyHabitRow}>
							<Text style={styles.weeklyHabitLabel}>{habit.label}</Text>
							<View style={styles.weeklyHabitBoxWrap}>
								<View style={styles.weeklyHabitBox} />
							</View>
						</View>
					))}
				</View>
				<View style={styles.habitFooterColumn}>
					<View style={styles.habitFooterHeader}>
						<Text style={styles.habitFooterHeaderText}>Rate your:</Text>
					</View>
					{ratings.map((rating) => {
						const max = rating.max ?? 10;
						const hasValue = typeof rating.value === "number";

						return (
							<View key={rating.key} style={styles.ratingRow}>
								<Text style={styles.ratingLabel}>{rating.label}</Text>
								<Text style={styles.ratingText}>{hasValue ? `${rating.value}` : "_"}</Text>
								<Text style={styles.ratingText}>/{max}</Text>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
};

export const ClosingField = ({
	label,
	styles,
	style,
	value,
}: {
	label: string;
	styles: TreatmentPlanStyles;
	style: Style;
	value?: string | null;
}) => {
	const paragraphs = splitTreatmentPlanParagraphs(value);

	return (
		<View style={[styles.closingField, style]}>
			<Text style={styles.closingFieldLabel}>{label}</Text>
			{paragraphs.map((paragraph) => (
				<Text key={`${label}-${paragraph}`} style={styles.closingFieldText}>
					{paragraph}
				</Text>
			))}
		</View>
	);
};
