import * as React from "react";

import { Document, Page, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
import { baseStyles } from "../components/styles";
import { Badge } from "../components/ui/badge";
import { KeepTogether } from "../components/ui/keep-together";
import { KeyValue } from "../components/ui/key-value";
import { Stack } from "../components/ui/stack";
import { defaultTheme } from "../lib/theme";
import { getI18n } from "../locales";

const { colors, primitives } = defaultTheme;

const styles = StyleSheet.create({
	...baseStyles,
	headerRow: {
		marginBottom: 16,
	},
	patientInfo: {
		marginBottom: 16,
		padding: 12,
		backgroundColor: colors.muted,
		borderRadius: 8,
	},
	frame: {
		marginTop: 12,
		backgroundColor: colors.muted,
		borderRadius: 12,
		padding: 4,
	},
	frameHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	frameHeaderLeft: {
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
	},
	frameHeaderRight: {
		flexShrink: 0,
		marginLeft: 8,
	},
	frameTitle: {
		fontSize: 11,
		fontWeight: primitives.fontWeights.semibold,
	},
	framePanel: {
		backgroundColor: colors.background,
		borderRadius: 8,
		overflow: "hidden",
	},
	resultCard: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: colors.muted,
	},
	resultCardLast: {
		borderBottomWidth: 0,
	},
	resultHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	resultName: {
		fontSize: 10,
		fontWeight: primitives.fontWeights.semibold,
	},
	resultOptimalRange: {
		fontSize: 7,
		color: colors.mutedForeground,
		marginTop: 2,
	},
	resultValue: {
		fontSize: 12,
		fontWeight: primitives.fontWeights.bold,
	},
	resultUnit: {
		fontSize: 8,
		color: colors.mutedForeground,
	},
	rangeIndicatorWrapper: {
		width: "100%",
		marginTop: 6,
	},
	notesSection: {
		marginTop: 16,
		padding: 12,
		backgroundColor: colors.muted,
		borderRadius: 8,
	},
	summarySection: {
		marginBottom: 16,
		padding: 12,
		backgroundColor: colors.muted,
		borderRadius: 8,
	},
	summaryText: {
		fontSize: 9,
		lineHeight: 1.5,
		color: colors.foreground,
	},
	label: {
		fontSize: 8,
		color: colors.mutedForeground,
		marginBottom: 2,
		textTransform: "uppercase",
	},
});

type LabResultRange = {
	min: number;
	max: number;
	status: "optimal" | "suboptimal" | "critical";
};

type LabResult = {
	id: string;
	name: string;
	code?: string;
	category: string;
	value: number;
	unit: string;
	status: "optimal" | "suboptimal" | "critical";
	ranges: LabResultRange[];
};

type PatientInfo = {
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth?: string;
};

type PractitionerInfo = {
	name: string;
	title?: string;
	email?: string;
};

type LabResultsPdfProps = {
	patient: PatientInfo;
	practitioner: PractitionerInfo;
	labResults: LabResult[];
	sessionDate: string;
	summary?: string;
	notes?: string;
	locale?: string;
};

const STATUS_COLORS = {
	optimal: colors.success,
	suboptimal: "#F97316",
	critical: colors.destructive,
} as const;

const STATUS_BADGE_VARIANT = {
	optimal: "optimal",
	suboptimal: "suboptimal",
	critical: "critical",
} as const;

const RangeIndicator = ({ value, ranges }: { value: number; ranges: LabResultRange[] }) => {
	if (!ranges || ranges.length === 0 || !Number.isFinite(value)) return null;

	const validRanges = ranges.filter((r) => Number.isFinite(r.min) && Number.isFinite(r.max) && r.max > r.min);
	if (validRanges.length === 0) return null;

	const sortedRanges = [...validRanges].sort((a, b) => a.min - b.min);
	const minValue = Math.min(...sortedRanges.map((r) => r.min));
	const maxValue = Math.max(...sortedRanges.map((r) => r.max));

	if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return null;

	const totalRange = maxValue - minValue;
	if (totalRange <= 0) return null;

	const rawPosition = ((value - minValue) / totalRange) * 100;
	const valuePosition = Math.min(Math.max(rawPosition, 2), 98);
	if (!Number.isFinite(valuePosition)) return null;

	const svgWidth = 200;
	const barHeight = 8;

	return (
		<View style={styles.rangeIndicatorWrapper}>
			<Svg width='100%' height='8' viewBox={`0 0 ${svgWidth} 8`}>
				{sortedRanges.map((range, index) => {
					const isFirst = index === 0;
					const isLast = index === sortedRanges.length - 1;
					const startX = ((range.min - minValue) / totalRange) * svgWidth;
					const endX = ((range.max - minValue) / totalRange) * svgWidth;
					const width = endX - startX + (isLast ? 0 : 1);

					if (!Number.isFinite(startX) || !Number.isFinite(width) || width <= 0) return null;

					return (
						<Rect
							key={`${range.status}-${range.min}-${range.max}`}
							x={isFirst ? 0 : startX}
							y='0'
							width={isFirst ? width + startX : width}
							height={barHeight}
							fill={STATUS_COLORS[range.status]}
							opacity={0.4}
							rx={isFirst || isLast ? 4 : 0}
						/>
					);
				})}
				<Rect
					x={(valuePosition / 100) * svgWidth - 1}
					y='0'
					width='2'
					height={barHeight}
					rx='1'
					fill={colors.foreground}
				/>
			</Svg>
		</View>
	);
};

const getStatusLabel = (status: string, t: ReturnType<typeof getI18n>["t"]) => {
	switch (status) {
		case "optimal":
			return t("labResults.optimal");
		case "suboptimal":
			return t("labResults.suboptimal");
		case "critical":
			return t("labResults.critical");
		default:
			return status;
	}
};

const RESULTS_PER_CHUNK = 8;

const chunkArray = <T,>(array: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

type CategoryFrameProps = {
	category: string;
	results: LabResult[];
	isChunk: boolean;
	chunkIndex: number;
	totalChunks: number;
	criticalCount: number;
	suboptimalCount: number;
	optimalCount: number;
	t: ReturnType<typeof getI18n>["t"];
};

const CategoryFrame = ({
	category,
	results,
	isChunk,
	chunkIndex,
	totalChunks,
	criticalCount,
	suboptimalCount,
	optimalCount,
	t,
}: CategoryFrameProps) => {
	const isContinuation = chunkIndex > 0;
	const title = isContinuation ? `${category} (${t("labResults.continued")})` : category;

	return (
		<KeepTogether>
			<View style={styles.frame}>
				<View style={styles.frameHeader}>
					<Stack direction='horizontal' gap='sm' align='center' style={styles.frameHeaderLeft}>
						<Text style={styles.frameTitle}>{title}</Text>
						{isChunk && (
							<Badge variant='default' size='sm'>
								{`${chunkIndex + 1}/${totalChunks}`}
							</Badge>
						)}
					</Stack>
					<Stack direction='horizontal' gap='sm' align='center' style={styles.frameHeaderRight}>
						{criticalCount > 0 && (
							<Badge variant='critical' size='sm'>
								{`${criticalCount} ${getStatusLabel("critical", t)}`}
							</Badge>
						)}
						{suboptimalCount > 0 && (
							<Badge variant='suboptimal' size='sm'>
								{`${suboptimalCount} ${getStatusLabel("suboptimal", t)}`}
							</Badge>
						)}
						{optimalCount > 0 && (
							<Badge variant='optimal' size='sm'>
								{`${optimalCount} ${getStatusLabel("optimal", t)}`}
							</Badge>
						)}
					</Stack>
				</View>

				<View style={styles.framePanel}>
					{results.map((result, index) => {
						const isLast = index === results.length - 1;
						const optimalRange = result.ranges.find((r) => r.status === "optimal");

						return (
							<View
								key={result.id}
								style={isLast ? [styles.resultCard, styles.resultCardLast] : styles.resultCard}
							>
								<View style={styles.resultHeader}>
									<View>
										<Stack direction='horizontal' gap='sm' align='center'>
											<Text style={styles.resultName}>
												{result.name}
												{result.code && ` (${result.code})`}
											</Text>
											<Badge variant={STATUS_BADGE_VARIANT[result.status]} size='sm'>
												{getStatusLabel(result.status, t)}
											</Badge>
										</Stack>
										{optimalRange &&
											Number.isFinite(optimalRange.min) &&
											Number.isFinite(optimalRange.max) && (
												<Text style={styles.resultOptimalRange}>
													Optimal: {optimalRange.min}-{optimalRange.max} {result.unit}
												</Text>
											)}
									</View>
									<Stack direction='horizontal' gap='none' align='end'>
										<Text style={[styles.resultValue, { color: STATUS_COLORS[result.status] }]}>
											{Number.isFinite(result.value) ? result.value : "N/A"}
										</Text>
										<Text style={styles.resultUnit}>{result.unit}</Text>
									</Stack>
								</View>
								<RangeIndicator value={result.value} ranges={result.ranges} />
							</View>
						);
					})}
				</View>
			</View>
		</KeepTogether>
	);
};

export const LabResultsPdf = ({
	patient,
	practitioner,
	labResults,
	sessionDate,
	summary,
	notes,
	locale = "en",
}: LabResultsPdfProps) => {
	const { t } = getI18n({ locale });

	const resultsByCategory = labResults.reduce(
		(acc, result) => {
			if (!acc[result.category]) {
				acc[result.category] = [];
			}
			acc[result.category].push(result);
			return acc;
		},
		{} as Record<string, LabResult[]>
	);

	const sortedCategories = Object.entries(resultsByCategory).sort(([nameA, a], [nameB, b]) => {
		if (a.length !== b.length) return a.length - b.length;
		return nameA.localeCompare(nameB);
	});

	return (
		<Document>
			<Page size='A4' style={styles.page}>
				{/* Header */}
				<Stack direction='horizontal' justify='between' align='start' style={{ marginBottom: 16 }}>
					<Logo size={40} />
					<View style={{ alignItems: "flex-end" }}>
						<Text style={styles.title}>{t("labResults.title")}</Text>
						<Text style={styles.textMuted}>{sessionDate}</Text>
					</View>
				</Stack>

				{/* Patient & Practitioner Info */}
				<Stack direction='horizontal' style={styles.patientInfo}>
					<KeyValue
						direction='vertical'
						size='sm'
						items={[
							{ key: t("labResults.patient"), value: `${patient.firstName} ${patient.lastName}` },
							{ key: "", value: patient.email },
						]}
						style={{ flex: 1 }}
					/>
					<KeyValue
						direction='vertical'
						size='sm'
						items={[
							{ key: t("labResults.practitioner"), value: practitioner.name },
							...(practitioner.title ? [{ key: "", value: practitioner.title }] : []),
							...(practitioner.email ? [{ key: "", value: practitioner.email }] : []),
						]}
						style={{ flex: 1 }}
					/>
				</Stack>

				{/* Summary */}
				{summary && (
					<View style={styles.summarySection}>
						<Text style={[styles.label, { marginBottom: 6 }]}>{t("labResults.summary")}</Text>
						<Text style={styles.summaryText}>{summary}</Text>
					</View>
				)}

				{/* Category Frames */}
				{sortedCategories.flatMap(([category, results]) => {
					const criticalCount = results.filter((r) => r.status === "critical").length;
					const suboptimalCount = results.filter((r) => r.status === "suboptimal").length;
					const optimalCount = results.filter((r) => r.status === "optimal").length;

					const sortedResults = [...results].sort((a, b) => {
						const order = { critical: 0, suboptimal: 1, optimal: 2 };
						return order[a.status] - order[b.status];
					});

					const chunks = chunkArray(sortedResults, RESULTS_PER_CHUNK);
					const needsChunking = chunks.length > 1;

					return chunks.map((chunkResults, chunkIndex) => (
						<CategoryFrame
							key={`${category}-${chunkIndex}`}
							category={category}
							results={chunkResults}
							isChunk={needsChunking}
							chunkIndex={chunkIndex}
							totalChunks={chunks.length}
							criticalCount={criticalCount}
							suboptimalCount={suboptimalCount}
							optimalCount={optimalCount}
							t={t}
						/>
					));
				})}

				{/* Notes */}
				{notes && (
					<KeepTogether>
						<View style={styles.notesSection}>
							<Text style={[styles.label, { marginBottom: 8 }]}>{t("labResults.notes")}</Text>
							<Text style={styles.text}>{notes}</Text>
						</View>
					</KeepTogether>
				)}

				<Footer companyName={practitioner.name} locale={locale} />
			</Page>
		</Document>
	);
};

export type { LabResult, LabResultRange, LabResultsPdfProps, PatientInfo, PractitionerInfo };
