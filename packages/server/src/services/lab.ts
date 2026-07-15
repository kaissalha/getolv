import { cache } from "react";

import { generateText } from "ai";
import { and, desc, eq, isNull, ne } from "drizzle-orm";

import { models } from "@getolv/ai/models";
import { labReportSummaryPrompt } from "@getolv/ai/prompts";
import {
	type Country,
	db,
	type PatientLabReportNew,
	type PatientLabResultNew,
	type PatientLabResultStatus,
	patientLabReports,
	patientLabResults,
	patientSessions,
	type ReferenceRanges,
} from "@getolv/db";
import { logger } from "@getolv/logger/server";

import {
	determineLabStatus,
	findLabTestByNameOrAlias,
	getLabCountry,
	getLabTestsCatalog,
	getRangesForTest,
} from "./lab-catalog";
import { listNotes } from "./notes";
import { getPatientSessions } from "./patient-sessions";
import { getPatient } from "./patients";

export type InsertLabResultData = Omit<PatientLabResultNew, "patientSessionId" | "patientId" | "labReportId">;

export const insertLabResults = async ({
	patientSessionId,
	patientId,
	labReportId,
	data,
}: {
	patientSessionId: string | null;
	patientId: string;
	labReportId: string;
	data: InsertLabResultData[];
}) => {
	return await db
		.insert(patientLabResults)
		.values(
			data.map((item) => ({
				...item,
				patientSessionId,
				patientId,
				labReportId,
			}))
		)
		.returning();
};

export const createLabReport = async ({
	patientId,
	organizationId,
	patientSessionId,
	reportDate,
}: {
	patientId: string;
	organizationId: string;
	patientSessionId?: string | null;
	reportDate?: string;
}) => {
	const [report] = await db
		.insert(patientLabReports)
		.values({
			patientId,
			organizationId,
			patientSessionId: patientSessionId ?? null,
			reportDate: reportDate ?? null,
		})
		.returning();

	return report;
};

export const updateLabReportSummary = async ({ labReportId, summary }: { labReportId: string; summary: string }) => {
	const [report] = await db
		.update(patientLabReports)
		.set({ summary })
		.where(eq(patientLabReports.id, labReportId))
		.returning();

	return report;
};

/**
 * Helper to compute status for lab results using current ranges with overrides.
 * Falls back to stored ranges if current ranges are not available.
 */
const computeLabResultsWithStatus = async <T extends { labTestId: string; value: number; ranges: ReferenceRanges }>({
	results,
	patientId,
	country,
}: {
	results: T[];
	patientId: string;
	country: Country;
}): Promise<(T & { status: PatientLabResultStatus })[]> => {
	return Promise.all(
		results.map(async (result) => {
			const rangeInfo = await getRangesForTest({
				labTestId: result.labTestId,
				patientId,
				country,
			});

			const ranges = rangeInfo?.ranges ?? result.ranges;
			const status = determineLabStatus({ value: result.value, ranges });

			return {
				...result,
				ranges,
				unit: rangeInfo?.unit ?? (result as T & { unit?: string }).unit,
				status,
			};
		})
	);
};

export const getPatientSessionLabResults = async ({
	patientSessionId,
	patientId,
}: {
	patientSessionId: string;
	patientId: string;
}) => {
	const results = await db
		.select()
		.from(patientLabResults)
		.where(
			and(eq(patientLabResults.patientSessionId, patientSessionId), eq(patientLabResults.patientId, patientId))
		);

	const country = await getLabCountry();
	return computeLabResultsWithStatus({ results, patientId, country });
};

export const getPatientLabResults = cache(async ({ patientId }: { patientId: string }) => {
	const results = await db
		.select({
			labResult: patientLabResults,
			session: patientSessions,
		})
		.from(patientLabResults)
		.leftJoin(patientSessions, eq(patientLabResults.patientSessionId, patientSessions.id))
		.where(eq(patientLabResults.patientId, patientId))
		.orderBy(patientLabResults.createdAt);

	// Apply current overrides and compute status for each result
	const country = await getLabCountry();
	const resultsWithStatus = await Promise.all(
		results.map(async (item) => {
			const rangeInfo = await getRangesForTest({
				labTestId: item.labResult.labTestId,
				patientId,
				country,
			});

			const ranges = rangeInfo?.ranges ?? item.labResult.ranges;
			const status = determineLabStatus({
				value: item.labResult.value,
				ranges,
			});

			return {
				...item,
				labResult: {
					...item.labResult,
					ranges,
					unit: rangeInfo?.unit ?? item.labResult.unit,
					status,
				},
			};
		})
	);

	return resultsWithStatus;
});

export const getLabResultsBySession = cache(
	async ({ patientId, sessionId }: { patientId: string; sessionId: string }) => {
		const results = await db
			.select()
			.from(patientLabResults)
			.where(and(eq(patientLabResults.patientId, patientId), eq(patientLabResults.patientSessionId, sessionId)));

		const country = await getLabCountry();
		return computeLabResultsWithStatus({ results, patientId, country });
	}
);

export const getUnassignedLabResults = cache(async ({ patientId }: { patientId: string }) => {
	const results = await db
		.select()
		.from(patientLabResults)
		.where(and(eq(patientLabResults.patientId, patientId), isNull(patientLabResults.patientSessionId)));

	const country = await getLabCountry();
	return computeLabResultsWithStatus({ results, patientId, country });
});

export const getPatientLabReports = cache(async ({ patientId }: { patientId: string }) => {
	const reports = await db.query.patientLabReports.findMany({
		where: { patientId },
		with: {
			patientSession: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return reports;
});

export const getLatestLabReportSummary = cache(
	async ({ patientId, sessionId }: { patientId: string; sessionId?: string | null }) => {
		const whereConditions = [eq(patientLabReports.patientId, patientId)];

		if (sessionId === null) {
			whereConditions.push(isNull(patientLabReports.patientSessionId));
		}

		if (sessionId) {
			whereConditions.push(eq(patientLabReports.patientSessionId, sessionId));
		}

		const whereCondition = whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

		const [report] = await db
			.select({
				id: patientLabReports.id,
				summary: patientLabReports.summary,
				reportDate: patientLabReports.reportDate,
				createdAt: patientLabReports.createdAt,
				patientSessionId: patientLabReports.patientSessionId,
			})
			.from(patientLabReports)
			.where(whereCondition)
			.orderBy(desc(patientLabReports.createdAt))
			.limit(1);

		return report ?? null;
	}
);

export const getLabReportWithResults = cache(async ({ labReportId }: { labReportId: string }) => {
	const report = await db.select().from(patientLabReports).where(eq(patientLabReports.id, labReportId)).limit(1);

	if (report.length === 0) {
		return null;
	}

	const results = await db.select().from(patientLabResults).where(eq(patientLabResults.labReportId, labReportId));

	const country = await getLabCountry();
	const resultsWithStatus = await computeLabResultsWithStatus({
		results,
		patientId: report[0].patientId,
		country,
	});

	return {
		report: report[0],
		results: resultsWithStatus,
	};
});

type AnalyzedLabResultInput = {
	name: string;
	category: string;
	value: number;
	unit: string;
};

/**
 * Process analyzed lab results: match to catalog, resolve ranges, and prepare for insertion.
 */
export const processAnalyzedLabResults = async ({
	patientId,
	analyzedResults,
	country,
}: {
	patientId: string;
	analyzedResults: AnalyzedLabResultInput[];
	country: Country;
}): Promise<InsertLabResultData[]> => {
	const processedResults: InsertLabResultData[] = [];

	for (const result of analyzedResults) {
		// Find matching lab test in catalog
		const labTest = await findLabTestByNameOrAlias({ name: result.name });

		if (!labTest) {
			logger.warn({
				message: "Lab test not found in catalog",
				metadata: {
					labTestName: result.name,
				},
			});
			continue;
		}

		// Get ranges for this test (with patient override if exists)
		const rangeInfo = await getRangesForTest({
			labTestId: labTest.id,
			patientId,
			country,
		});

		if (!rangeInfo) {
			logger.warn({
				message: "No reference ranges found for lab test",
				metadata: {
					labTestName: labTest.name,
					labTestId: labTest.id,
				},
			});
			continue;
		}

		processedResults.push({
			labTestId: labTest.id,
			name: result.name,
			category: labTest.category,
			value: result.value,
			unit: rangeInfo.unit,
			ranges: rangeInfo.ranges,
		});
	}

	return processedResults;
};

const normalizeText = ({ text, maxLength }: { text: string; maxLength: number }) => {
	const normalized = text.replace(/\s+/g, " ").trim();

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, maxLength)}...`;
};

const buildLabReportSummaryContext = ({
	patient,
	report,
	results,
	sessionSummaries,
	noteSummaries,
	priorReportSummaries,
}: {
	patient: Awaited<ReturnType<typeof getPatient>> | null;
	report: PatientLabReportNew & { id: string; createdAt?: string | null };
	results: Array<
		InsertLabResultData & {
			id: string;
			patientId: string;
			labReportId: string;
			status: PatientLabResultStatus;
		}
	>;
	sessionSummaries: string[];
	noteSummaries: string[];
	priorReportSummaries: string[];
}) => {
	const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient";
	const patientSummary = patient?.summary
		? `Patient summary: ${normalizeText({ text: patient.summary, maxLength: 420 })}`
		: null;

	const patientLines = [patientSummary].filter((line): line is string => Boolean(line));
	const reportDate = report.reportDate ?? report.createdAt ?? "Unknown";
	const reportSession =
		report.patientSessionId === null
			? "Unassigned session"
			: report.patientSessionId
				? "Linked session"
				: "Unknown";

	const statusCounts = results.reduce(
		(acc, result) => {
			acc[result.status] += 1;
			return acc;
		},
		{ critical: 0, suboptimal: 0, optimal: 0 }
	);

	const resultsLines = results.map(
		(result) => `- ${result.name} (${result.category}): ${result.value} ${result.unit} - ${result.status}`
	);

	const sections = [
		`Patient\nName: ${patientName}${patientLines.length > 0 ? `\n${patientLines.join("\n")}` : ""}`,
		`Current lab report\nDate: ${reportDate}\nSession: ${reportSession}\nStatus counts: critical ${
			statusCounts.critical
		}, suboptimal ${statusCounts.suboptimal}, optimal ${statusCounts.optimal}\nResults:\n${
			resultsLines.length > 0 ? resultsLines.join("\n") : "- None"
		}`,
		`Session summaries\n${sessionSummaries.length > 0 ? sessionSummaries.join("\n") : "- None"}`,
		`Patient notes\n${noteSummaries.length > 0 ? noteSummaries.join("\n") : "- None"}`,
		`Prior lab report summaries\n${priorReportSummaries.length > 0 ? priorReportSummaries.join("\n") : "- None"}`,
	];

	return sections.join("\n\n");
};

const generateLabReportSummary = async ({
	patientId,
	organizationId,
	report,
	results,
}: {
	patientId: string;
	organizationId: string;
	report: PatientLabReportNew & { id: string; createdAt?: string | null };
	results: Array<InsertLabResultData & { id: string; patientId: string; labReportId: string }>;
}) => {
	const [patient, sessions, notes, priorReports] = await Promise.all([
		getPatient({ id: patientId, organizationId }),
		getPatientSessions(patientId, organizationId),
		listNotes({ organizationId, resourceType: "patient", resourceId: patientId, pageSize: 20 }),
		db
			.select({
				id: patientLabReports.id,
				summary: patientLabReports.summary,
				reportDate: patientLabReports.reportDate,
				createdAt: patientLabReports.createdAt,
			})
			.from(patientLabReports)
			.where(and(eq(patientLabReports.patientId, patientId), ne(patientLabReports.id, report.id)))
			.orderBy(desc(patientLabReports.createdAt)),
	]);

	const resultsWithStatus = results.map((result) => ({
		...result,
		status: determineLabStatus({ value: result.value, ranges: result.ranges }),
	}));

	const sessionSummaries = sessions
		.map((session) => {
			const isLinked = session.id === report.patientSessionId;
			const summary = session.summary?.trim();
			if (!summary && !isLinked) {
				return null;
			}
			const title = session.title ?? "Untitled session";
			const summaryText = summary ? normalizeText({ text: summary, maxLength: 420 }) : "Summary not available.";
			return `- ${title}${isLinked ? " (linked)" : ""}: ${summaryText}`;
		})
		.filter((line): line is string => Boolean(line));

	const noteSummaries = notes.data.map((note) => `- ${normalizeText({ text: note.body, maxLength: 420 })}`);

	const priorReportSummaries = priorReports
		.filter((priorReport) => priorReport.summary)
		.map((priorReport) => {
			const summary = normalizeText({ text: priorReport.summary ?? "", maxLength: 420 });
			const dateLabel = priorReport.reportDate ?? priorReport.createdAt ?? "Unknown date";
			return `- ${dateLabel}: ${summary}`;
		});

	const context = buildLabReportSummaryContext({
		patient,
		report,
		results: resultsWithStatus,
		sessionSummaries,
		noteSummaries,
		priorReportSummaries,
	});

	const { text } = await generateText({
		model: models.fast.model,
		prompt: labReportSummaryPrompt({ context }),
	});

	return text.trim();
};

/**
 * Analyze lab results from text, match to catalog, create report, and insert results.
 */
export const analyzeAndInsertLabResults = async ({
	patientId,
	organizationId,
	patientSessionId,
	analyzedResults,
}: {
	patientId: string;
	organizationId: string;
	patientSessionId?: string | null;
	analyzedResults: AnalyzedLabResultInput[];
}): Promise<{
	report: PatientLabReportNew & { id: string };
	results: (InsertLabResultData & { id: string; patientId: string; labReportId: string })[];
}> => {
	// Get country for reference ranges
	const country = await getLabCountry();

	// Process the analyzed results
	const processedResults = await processAnalyzedLabResults({
		patientId,
		analyzedResults,
		country,
	});

	if (processedResults.length === 0) {
		throw new Error("No valid lab results could be processed from the analyzed data");
	}

	// Create the lab report
	const report = await createLabReport({
		patientId,
		organizationId,
		patientSessionId,
	});

	// Insert the lab results
	const insertedResults = await insertLabResults({
		patientSessionId: patientSessionId ?? null,
		patientId,
		labReportId: report.id,
		data: processedResults,
	});

	let reportWithSummary = report;
	try {
		const summary = await generateLabReportSummary({
			patientId,
			organizationId,
			report,
			results: insertedResults,
		});

		if (summary.length > 0) {
			reportWithSummary = await updateLabReportSummary({ labReportId: report.id, summary });
		}
	} catch (error) {
		logger.error({
			message: "Lab report summary generation failed",
			error,
			metadata: {
				patientId,
				organizationId,
				labReportId: report.id,
			},
		});
	}

	return {
		report: reportWithSummary,
		results: insertedResults,
	};
};

// Re-export lab catalog functions for convenience
export { determineLabStatus, findLabTestByNameOrAlias, getLabCountry, getLabTestsCatalog, getRangesForTest };
