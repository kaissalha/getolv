import * as React from "react";

import { Document, Image, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
import { baseStyles } from "../components/styles";
import { KeepTogether } from "../components/ui/keep-together";
import { KeyValue } from "../components/ui/key-value";
import { Stack } from "../components/ui/stack";
import { defaultTheme } from "../lib/theme";

const { colors, primitives } = defaultTheme;

const styles = StyleSheet.create({
	...baseStyles,
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 16,
		marginBottom: 26,
		paddingBottom: 4,
	},
	headerTitleBlock: {
		flex: 1,
		flexDirection: "column",
		gap: 8,
		minWidth: 0,
		paddingTop: 2,
	},
	docTitle: {
		fontSize: 20,
		fontWeight: primitives.fontWeights.bold,
		color: colors.foreground,
		lineHeight: 1.35,
	},
	docDate: {
		fontSize: 10,
		color: colors.mutedForeground,
		lineHeight: 1.4,
	},
	infoBar: {
		marginBottom: 14,
		padding: 12,
		backgroundColor: colors.muted,
		borderRadius: 8,
	},
	summarySection: {
		marginBottom: 14,
		padding: 12,
		backgroundColor: colors.muted,
		borderRadius: 8,
	},
	summaryLabel: {
		fontSize: 8,
		color: colors.mutedForeground,
		marginBottom: 6,
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	summaryText: {
		fontSize: 9,
		lineHeight: 1.6,
		color: colors.foreground,
	},
	statBadge: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		flexDirection: "column",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: colors.muted,
		borderRadius: 8,
		minWidth: 0,
	},
	statLabel: {
		fontSize: 7,
		color: colors.mutedForeground,
		textTransform: "uppercase",
		letterSpacing: 0.4,
		textAlign: "center",
	},
	statValue: {
		fontSize: 10,
		fontWeight: primitives.fontWeights.semibold,
		color: colors.foreground,
		textAlign: "center",
	},
	frame: {
		marginBottom: 10,
		backgroundColor: colors.muted,
		borderRadius: 10,
		padding: 4,
	},
	frameHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingTop: 10,
		paddingBottom: 8,
	},
	frameHeaderLeft: {
		flexDirection: "column",
		gap: 2,
	},
	frameTitle: {
		fontSize: 11,
		fontWeight: primitives.fontWeights.semibold,
		color: colors.foreground,
	},
	frameFocus: {
		fontSize: 8,
		color: colors.mutedForeground,
	},
	frameDayBadge: {
		fontSize: 8,
		fontWeight: primitives.fontWeights.semibold,
		color: colors.mutedForeground,
		backgroundColor: colors.border,
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	framePanel: {
		backgroundColor: colors.background,
		borderRadius: 8,
		overflow: "hidden",
	},
	conditioningBlock: {
		paddingHorizontal: 12,
		paddingVertical: 9,
		flexDirection: "row",
		gap: 8,
		alignItems: "flex-start",
		borderBottomWidth: 1,
		borderBottomColor: colors.muted,
	},
	conditioningIconWrap: {
		width: 18,
		height: 18,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	conditioningWarmIcon: {
		backgroundColor: "rgba(249, 115, 22, 0.12)",
	},
	conditioningCoolIcon: {
		backgroundColor: "rgba(99, 102, 241, 0.12)",
	},
	conditioningContent: {
		flex: 1,
		flexDirection: "column",
		gap: 2,
	},
	conditioningLabel: {
		fontSize: 8,
		fontWeight: primitives.fontWeights.semibold,
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	conditioningWarmLabel: {
		color: "#EA580C",
	},
	conditioningCoolLabel: {
		color: "#6366F1",
	},
	conditioningText: {
		fontSize: 9,
		lineHeight: 1.5,
		color: colors.foreground,
	},
	tableHeaderRow: {
		flexDirection: "row",
		backgroundColor: colors.muted,
		borderBottomWidth: 1,
		borderBottomColor: colors.muted,
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: colors.muted,
		paddingVertical: 7,
		paddingHorizontal: 12,
	},
	tableRowLast: {
		borderBottomWidth: 0,
	},
	tableRowAlt: {
		backgroundColor: "#FAFAFA",
	},
	thumbCol: {
		width: "11%",
		justifyContent: "center",
		alignItems: "center",
	},
	exerciseThumb: {
		width: 32,
		height: 32,
		borderRadius: 4,
		objectFit: "cover",
	},
	thumbPlaceholder: {
		width: 32,
		height: 32,
		borderRadius: 4,
		backgroundColor: colors.muted,
		borderWidth: 1,
		borderColor: colors.border,
	},
	colNum: { width: "5%" },
	colExercise: { width: "26%" },
	colSets: { width: "10%", textAlign: "center" },
	colReps: { width: "13%", textAlign: "center" },
	colRest: { width: "11%", textAlign: "center" },
	colNotes: { width: "24%" },
	cellHeader: {
		fontSize: 7,
		fontWeight: primitives.fontWeights.semibold,
		textTransform: "uppercase",
		color: colors.mutedForeground,
		letterSpacing: 0.4,
	},
	cell: {
		fontSize: 9,
		lineHeight: 1.4,
		color: colors.foreground,
	},
	cellMuted: {
		color: colors.mutedForeground,
	},
});

type WorkoutPlanExercise = {
	exerciseName: string;
	sets: number | null;
	reps: string | null;
	restSeconds: number | null;
	notes: string | null;
	gifUrl?: string | null;
};

type WorkoutPlanDay = {
	dayNumber: number;
	name: string;
	focus: string | null;
	warmUp: string | null;
	coolDown: string | null;
	exercises: WorkoutPlanExercise[];
};

export type WorkoutPlanPatientInfo = {
	firstName: string;
	lastName: string;
	email: string;
};

export type WorkoutPlanPractitionerInfo = {
	name: string;
	email?: string;
};

export type WorkoutPlanPdfProps = {
	patient: WorkoutPlanPatientInfo;
	practitioner: WorkoutPlanPractitionerInfo;
	title: string;
	summary?: string | null;
	durationWeeks?: number | null;
	daysPerWeek?: number | null;
	days: WorkoutPlanDay[];
	sessionDate: string;
};

const FlameIcon = ({ size = 10, color = "#EA580C" }: { size?: number; color?: string }) => (
	<Svg width={size} height={size} viewBox='0 0 24 24'>
		<Path
			d='M12 2C12 2 7 7.5 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 9 12 2 12 2Z'
			fill={color}
			fillOpacity={0.85}
		/>
		<Path
			d='M12 18C10.34 18 9 16.66 9 15C9 13 11 11.5 12 10C13 11.5 15 13 15 15C15 16.66 13.66 18 12 18Z'
			fill={color}
		/>
	</Svg>
);

const SnowflakeIcon = ({ size = 10, color = "#6366F1" }: { size?: number; color?: string }) => (
	<Svg width={size} height={size} viewBox='0 0 24 24'>
		<Path d='M12 2V22' stroke={color} strokeWidth={2} strokeLinecap='round' />
		<Path d='M2 12H22' stroke={color} strokeWidth={2} strokeLinecap='round' />
		<Path d='M4.93 4.93L19.07 19.07' stroke={color} strokeWidth={2} strokeLinecap='round' />
		<Path d='M19.07 4.93L4.93 19.07' stroke={color} strokeWidth={2} strokeLinecap='round' />
		<Path d='M12 6L9 9M12 6L15 9' stroke={color} strokeWidth={1.5} strokeLinecap='round' />
		<Path d='M12 18L9 15M12 18L15 15' stroke={color} strokeWidth={1.5} strokeLinecap='round' />
		<Path d='M6 12L9 9M6 12L9 15' stroke={color} strokeWidth={1.5} strokeLinecap='round' />
		<Path d='M18 12L15 9M18 12L15 15' stroke={color} strokeWidth={1.5} strokeLinecap='round' />
	</Svg>
);

const ExerciseThumb = ({ gifUrl }: { gifUrl?: string | null }) =>
	gifUrl ? <Image src={gifUrl} style={styles.exerciseThumb} /> : <View style={styles.thumbPlaceholder} />;

const ExerciseTable = ({ exercises }: { exercises: WorkoutPlanExercise[] }) => (
	<View>
		<View style={styles.tableHeaderRow}>
			<Text style={[styles.cellHeader, styles.colNum]}>#</Text>
			<Text style={[styles.cellHeader, styles.thumbCol]} />
			<Text style={[styles.cellHeader, styles.colExercise]}>Exercise</Text>
			<Text style={[styles.cellHeader, styles.colSets]}>Sets</Text>
			<Text style={[styles.cellHeader, styles.colReps]}>Reps</Text>
			<Text style={[styles.cellHeader, styles.colRest]}>Rest</Text>
			<Text style={[styles.cellHeader, styles.colNotes]}>Notes</Text>
		</View>
		{exercises.map((ex, idx) => {
			const isLast = idx === exercises.length - 1;
			const isAlt = idx % 2 === 1;
			const exerciseKey = [
				ex.exerciseName,
				ex.sets ?? "na",
				ex.reps ?? "na",
				ex.restSeconds ?? "na",
				ex.notes ?? "na",
				ex.gifUrl ?? "na",
			].join(":");

			return (
				<View
					key={exerciseKey}
					style={[styles.tableRow, isLast ? styles.tableRowLast : {}, isAlt ? styles.tableRowAlt : {}]}
				>
					<Text style={[styles.cell, styles.cellMuted, styles.colNum]}>{idx + 1}</Text>
					<View style={styles.thumbCol}>
						<ExerciseThumb gifUrl={ex.gifUrl} />
					</View>
					<Text style={[styles.cell, styles.colExercise]}>{ex.exerciseName}</Text>
					<Text style={[styles.cell, styles.colSets]}>{ex.sets ?? "—"}</Text>
					<Text style={[styles.cell, styles.colReps]}>{ex.reps ?? "—"}</Text>
					<Text style={[styles.cell, styles.colRest]}>{ex.restSeconds ? `${ex.restSeconds}s` : "—"}</Text>
					<Text style={[styles.cell, styles.cellMuted, styles.colNotes]}>{ex.notes ?? ""}</Text>
				</View>
			);
		})}
	</View>
);

const DayCard = ({ day }: { day: WorkoutPlanDay }) => (
	<KeepTogether>
		<View style={styles.frame}>
			<View style={styles.frameHeader}>
				<View style={styles.frameHeaderLeft}>
					<Text style={styles.frameTitle}>{day.name}</Text>
					{day.focus && <Text style={styles.frameFocus}>{day.focus}</Text>}
				</View>
				<Text style={styles.frameDayBadge}>Day {day.dayNumber}</Text>
			</View>

			<View style={styles.framePanel}>
				{day.warmUp && (
					<View style={styles.conditioningBlock}>
						<View style={[styles.conditioningIconWrap, styles.conditioningWarmIcon]}>
							<FlameIcon />
						</View>
						<View style={styles.conditioningContent}>
							<Text style={[styles.conditioningLabel, styles.conditioningWarmLabel]}>Warm-Up</Text>
							<Text style={styles.conditioningText}>{day.warmUp}</Text>
						</View>
					</View>
				)}

				{day.exercises.length > 0 && <ExerciseTable exercises={day.exercises} />}

				{day.coolDown && (
					<View
						style={[
							styles.conditioningBlock,
							{ borderTopWidth: 1, borderTopColor: colors.muted, borderBottomWidth: 0 },
						]}
					>
						<View style={[styles.conditioningIconWrap, styles.conditioningCoolIcon]}>
							<SnowflakeIcon />
						</View>
						<View style={styles.conditioningContent}>
							<Text style={[styles.conditioningLabel, styles.conditioningCoolLabel]}>Cool-Down</Text>
							<Text style={styles.conditioningText}>{day.coolDown}</Text>
						</View>
					</View>
				)}
			</View>
		</View>
	</KeepTogether>
);

export const WorkoutPlanPdf = ({
	patient,
	practitioner,
	title,
	summary,
	durationWeeks,
	daysPerWeek,
	days,
	sessionDate,
}: WorkoutPlanPdfProps) => (
	<Document>
		<Page size='A4' style={styles.page}>
			{/* Header */}
			<View style={styles.headerRow}>
				<Logo size={40} />
				<View style={styles.headerTitleBlock}>
					<Text style={styles.docTitle}>{title}</Text>
					<Text style={styles.docDate}>{sessionDate}</Text>
				</View>
			</View>

			{/* Patient & Practitioner Info */}
			<Stack direction='horizontal' style={styles.infoBar}>
				<KeyValue
					direction='vertical'
					size='sm'
					items={[
						{ key: "Patient", value: `${patient.firstName} ${patient.lastName}` },
						{ key: "", value: patient.email },
					]}
					style={{ flex: 1 }}
				/>
				<KeyValue
					direction='vertical'
					size='sm'
					items={[
						{ key: "Practitioner", value: practitioner.name },
						...(practitioner.email ? [{ key: "", value: practitioner.email }] : []),
					]}
					style={{ flex: 1 }}
				/>
			</Stack>

			{/* Plan Stats */}
			{(durationWeeks ?? daysPerWeek ?? days.length > 0) && (
				<Stack direction='horizontal' gap='sm' style={{ marginBottom: 14, width: "100%" }}>
					{durationWeeks && (
						<View style={styles.statBadge}>
							<Text style={styles.statLabel}>Duration</Text>
							<Text style={styles.statValue}>{durationWeeks} weeks</Text>
						</View>
					)}
					{daysPerWeek && (
						<View style={styles.statBadge}>
							<Text style={styles.statLabel}>Days / Week</Text>
							<Text style={styles.statValue}>{daysPerWeek}</Text>
						</View>
					)}
					{days.length > 0 && (
						<View style={styles.statBadge}>
							<Text style={styles.statLabel}>Training Days</Text>
							<Text style={styles.statValue}>{days.length}</Text>
						</View>
					)}
				</Stack>
			)}

			{/* Summary */}
			{summary && (
				<KeepTogether>
					<View style={styles.summarySection}>
						<Text style={styles.summaryLabel}>Overview</Text>
						<Text style={styles.summaryText}>{summary}</Text>
					</View>
				</KeepTogether>
			)}

			{/* Training Days */}
			{days.map((day) => (
				<DayCard key={day.dayNumber} day={day} />
			))}

			<Footer companyName={practitioner.name} />
		</Page>
	</Document>
);
