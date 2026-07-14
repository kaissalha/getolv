import { generateText, Output } from "ai";
import { z } from "zod";

import { models } from "@starter/ai/models";
import { buildGeneratedTreatmentPlanPrompt, generatedTreatmentPlanSchema } from "@starter/ai/prompts";
import { db, normalizePatientSessionIntelligence, type PatientTreatmentPlanContent } from "@starter/db";

import { getLatestLabReportSummary } from "./lab";
import { listNotes } from "./notes";
import { upsertSessionTreatmentPlan } from "./treatment-plans";

const NOTE_CONTEXT_MAX_LENGTH = 260;
const TRANSCRIPT_MAX_LENGTH = 2600;

const normalizeText = ({ maxLength, text }: { maxLength: number; text: string | null | undefined }) => {
	if (!text) {
		return null;
	}

	const normalized = text.replace(/\s+/g, " ").trim();

	if (!normalized) {
		return null;
	}

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, maxLength - 1)}…`;
};

const normalizeParagraphText = ({ maxLength, text }: { maxLength: number; text: string | null | undefined }) => {
	if (!text) {
		return null;
	}

	const normalized = text
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((line) => line.replace(/\s+/g, " ").trim())
		.filter(Boolean)
		.join("\n\n");

	if (!normalized) {
		return null;
	}

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, maxLength - 1)}…`;
};

const slugifyLabel = ({ fallbackIndex, label }: { fallbackIndex: number; label: string }) => {
	const normalized = label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return normalized || `item-${fallbackIndex + 1}`;
};

const normalizeStringList = ({
	items,
	maxItemLength,
	maxItems,
}: {
	items: string[];
	maxItemLength: number;
	maxItems: number;
}) =>
	items
		.map((item) => normalizeText({ maxLength: maxItemLength, text: item }))
		.filter((item): item is string => Boolean(item))
		.slice(0, maxItems);

const buildPatientProfileBlock = ({
	patient,
}: {
	patient:
		| {
				additionalContext: string | null;
				allergies: string | null;
				currentMedications: string | null;
				dateOfBirth: string | null;
				firstName: string;
				lastName: string;
				summary: string | null;
		  }
		| null
		| undefined;
}) => {
	if (!patient) {
		return "Patient chart not found.";
	}

	const patientSummary = normalizeText({ maxLength: NOTE_CONTEXT_MAX_LENGTH, text: patient.summary });
	const allergies = normalizeText({ maxLength: NOTE_CONTEXT_MAX_LENGTH, text: patient.allergies });
	const currentMedications = normalizeText({
		maxLength: NOTE_CONTEXT_MAX_LENGTH,
		text: patient.currentMedications,
	});
	const additionalContext = normalizeText({
		maxLength: NOTE_CONTEXT_MAX_LENGTH,
		text: patient.additionalContext,
	});

	return [
		`Name: ${[patient.firstName, patient.lastName].filter(Boolean).join(" ").trim() || "—"}`,
		patient.dateOfBirth ? `Date of birth: ${patient.dateOfBirth}` : null,
		patientSummary ? `Patient summary: ${patientSummary}` : null,
		allergies ? `Allergies: ${allergies}` : null,
		currentMedications ? `Current medications: ${currentMedications}` : null,
		additionalContext ? `Additional context: ${additionalContext}` : null,
	]
		.filter(Boolean)
		.join("\n");
};

const buildSessionContextBlock = ({
	session,
	transcriptText,
}: {
	session: NonNullable<Awaited<ReturnType<typeof db.query.patientSessions.findFirst>>>;
	transcriptText: string | null;
}) =>
	[
		session.title?.trim() ? `Title: ${session.title.trim()}` : null,
		session.summary?.trim() ? `Summary: ${session.summary.trim()}` : null,
		session.createdAt ? `Started: ${session.createdAt}` : null,
		session.finalizedAt ? `Completed: ${session.finalizedAt}` : null,
		transcriptText
			? `Transcript excerpt: ${normalizeText({ maxLength: TRANSCRIPT_MAX_LENGTH, text: transcriptText })}`
			: null,
	]
		.filter(Boolean)
		.join("\n");

const buildSessionIntelligenceBlock = ({
	intelligence,
}: {
	intelligence: ReturnType<typeof normalizePatientSessionIntelligence>;
}) => {
	if (!intelligence) {
		return "No saved session intelligence.";
	}

	const lines: string[] = [];

	if (intelligence.visitReason) {
		lines.push(`Visit reason: ${intelligence.visitReason}`);
	}
	if (intelligence.liveNote.trim()) {
		lines.push(`Live note: ${intelligence.liveNote.trim()}`);
	}
	if (intelligence.riskFlags.length > 0) {
		lines.push(`Risk flags: ${intelligence.riskFlags.join(", ")}`);
	}
	if (intelligence.todos.length > 0) {
		lines.push(`Todos: ${intelligence.todos.map((todo) => todo.text).join("; ")}`);
	}
	if (intelligence.workingDx.length > 0) {
		lines.push(`Working diagnosis: ${intelligence.workingDx.map((entry) => entry.name).join(", ")}`);
	}
	if (intelligence.differentialDx.length > 0) {
		lines.push(`Differential diagnosis: ${intelligence.differentialDx.map((entry) => entry.name).join(", ")}`);
	}

	return lines.length > 0 ? lines.join("\n") : "No saved session intelligence.";
};

const buildPriorSessionsBlock = ({
	currentSessionId,
	sessions,
}: {
	currentSessionId: string;
	sessions: Array<{
		createdAt: string;
		id: string;
		summary: string | null;
		title: string | null;
	}>;
}) => {
	const lines = sessions
		.filter((session) => session.id !== currentSessionId)
		.slice(0, 4)
		.map((session) => {
			const summary = normalizeText({ maxLength: NOTE_CONTEXT_MAX_LENGTH, text: session.summary });

			return `- ${session.title ?? "Untitled session"} (${session.createdAt})${summary ? `: ${summary}` : ""}`;
		});

	return lines.length > 0 ? lines.join("\n") : "No prior completed sessions.";
};

const buildRecentNotesBlock = ({ notes }: { notes: Array<{ body: string; updatedAt: string }> }) => {
	const lines = notes
		.slice(0, 4)
		.map((note) => {
			const body = normalizeText({ maxLength: NOTE_CONTEXT_MAX_LENGTH, text: note.body });

			return body ? `- ${note.updatedAt}: ${body}` : null;
		})
		.filter((line): line is string => Boolean(line));

	return lines.length > 0 ? lines.join("\n") : "No recent patient notes.";
};

const buildLabSummaryBlock = ({
	labSummary,
}: {
	labSummary: {
		createdAt: string;
		reportDate: string | null;
		summary: string | null;
	} | null;
}) => {
	if (!labSummary) {
		return "No recent pathology summary found.";
	}

	return [
		labSummary.reportDate ? `Report date: ${labSummary.reportDate}` : `Created at: ${labSummary.createdAt}`,
		labSummary.summary ? `Summary: ${labSummary.summary}` : "Summary unavailable.",
	].join("\n");
};

const normalizeGeneratedTreatmentPlan = ({
	output,
}: {
	output: z.infer<typeof generatedTreatmentPlanSchema>;
}): PatientTreatmentPlanContent => ({
	dailyHabits: normalizeStringList({
		items: output.dailyHabitLabels,
		maxItemLength: 40,
		maxItems: 10,
	}).map((label, index) => ({
		key: slugifyLabel({ fallbackIndex: index, label }),
		label,
	})),
	dietaryAvoid: normalizeStringList({
		items: output.dietaryAvoid,
		maxItemLength: 120,
		maxItems: 6,
	}),
	dietaryInclude: normalizeStringList({
		items: output.dietaryInclude,
		maxItemLength: 120,
		maxItems: 6,
	}),
	lifestyleRecommendations: output.lifestyleRecommendations.slice(0, 6).map((item) => ({
		description: normalizeText({ maxLength: 190, text: item.description }) ?? item.description,
		title: normalizeText({ maxLength: 62, text: item.title }) ?? item.title,
	})),
	longTermGoals: normalizeParagraphText({ maxLength: 420, text: output.longTermGoals }) ?? output.longTermGoals,
	mealPlan: Object.fromEntries(
		Object.entries(output.mealPlan).map(([day, meals]) => [
			day,
			{
				breakfast: normalizeText({ maxLength: 70, text: meals.breakfast }) ?? meals.breakfast,
				dinner: normalizeText({ maxLength: 70, text: meals.dinner }) ?? meals.dinner,
				lunch: normalizeText({ maxLength: 70, text: meals.lunch }) ?? meals.lunch,
				snacks: normalizeText({ maxLength: 70, text: meals.snacks }) ?? meals.snacks,
			},
		])
	),
	mindfulnessParagraphs: normalizeStringList({
		items: output.mindfulnessParagraphs,
		maxItemLength: 260,
		maxItems: 3,
	}),
	movementParagraphs: normalizeStringList({
		items: output.movementParagraphs,
		maxItemLength: 260,
		maxItems: 3,
	}),
	pathologyRecommendations:
		normalizeParagraphText({ maxLength: 320, text: output.pathologyRecommendations }) ??
		output.pathologyRecommendations,
	pathologyReview: normalizeParagraphText({ maxLength: 320, text: output.pathologyReview }) ?? output.pathologyReview,
	plateSteps: output.plateSteps.slice(0, 4).map((step) => ({
		hint: normalizeText({ maxLength: 90, text: step.hint }) ?? undefined,
		items: normalizeStringList({
			items: step.items,
			maxItemLength: 110,
			maxItems: 4,
		}),
		title: normalizeText({ maxLength: 64, text: step.title }) ?? step.title,
	})),
	ratings: normalizeStringList({
		items: output.ratingLabels,
		maxItemLength: 36,
		maxItems: 6,
	}).map((label, index) => ({
		key: slugifyLabel({ fallbackIndex: index, label }),
		label,
		max: 10,
	})),
	shortTermGoals: normalizeParagraphText({ maxLength: 180, text: output.shortTermGoals }) ?? output.shortTermGoals,
	summary: normalizeParagraphText({ maxLength: 1200, text: output.summary }) ?? output.summary,
	supplements: output.supplements.slice(0, 5).map((supplement) => ({
		dose: normalizeText({ maxLength: 80, text: supplement.dose }) ?? supplement.dose,
		name: normalizeText({ maxLength: 64, text: supplement.name }) ?? supplement.name,
		reason: normalizeText({ maxLength: 140, text: supplement.reason }) ?? supplement.reason,
	})),
	weeklyHabits: normalizeStringList({
		items: output.weeklyHabitLabels,
		maxItemLength: 40,
		maxItems: 6,
	}).map((label, index) => ({
		key: slugifyLabel({ fallbackIndex: index, label }),
		label,
	})),
});

export const syncSessionTreatmentPlan = async ({
	organizationId,
	practitionerEmail,
	practitionerName,
	sessionId,
}: {
	organizationId: string;
	practitionerEmail?: string | null;
	practitionerName?: string | null;
	sessionId: string;
}) => {
	const session = await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
		},
		with: {
			patient: true,
			transcriptTurns: {
				columns: {
					speaker: true,
					text: true,
				},
				orderBy: {
					turnOrder: "asc",
				},
			},
		},
	});

	if (!session) {
		return null;
	}

	if (!session.patient) {
		return null;
	}

	const transcriptText =
		normalizeText({ maxLength: TRANSCRIPT_MAX_LENGTH, text: session.finalTranscript }) ??
		normalizeText({
			maxLength: TRANSCRIPT_MAX_LENGTH,
			text: session.transcriptTurns.map((turn) => `[${turn.speaker}] ${turn.text}`).join("\n"),
		});
	const intelligence = normalizePatientSessionIntelligence(session.intelligence);
	const [completedSessions, recentNotesResult, latestLabSummary] = await Promise.all([
		db.query.patientSessions.findMany({
			where: {
				organizationId,
				patientId: session.patientId,
				status: "completed",
			},
			columns: {
				createdAt: true,
				id: true,
				summary: true,
				title: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		}),
		listNotes({
			organizationId,
			resourceId: session.patientId,
			resourceType: "patient",
			pageSize: 10,
		}),
		getLatestLabReportSummary({
			patientId: session.patientId,
			sessionId: session.id,
		}).then((report) => report ?? getLatestLabReportSummary({ patientId: session.patientId })),
	]);

	const hasUsefulContext = Boolean(
		transcriptText ||
		session.summary?.trim() ||
		session.title?.trim() ||
		intelligence?.liveNote.trim() ||
		intelligence?.todos.length ||
		intelligence?.workingDx.length ||
		session.patient.summary?.trim() ||
		session.patient.additionalContext?.trim() ||
		latestLabSummary?.summary?.trim()
	);

	if (!hasUsefulContext) {
		return null;
	}

	const result = await generateText({
		model: models.fast.model,
		output: Output.object({
			schema: generatedTreatmentPlanSchema,
		}),
		prompt: buildGeneratedTreatmentPlanPrompt({
			labSummaryBlock: buildLabSummaryBlock({
				labSummary: latestLabSummary
					? {
							createdAt: latestLabSummary.createdAt,
							reportDate: latestLabSummary.reportDate,
							summary: latestLabSummary.summary,
						}
					: null,
			}),
			patientProfileBlock: buildPatientProfileBlock({ patient: session.patient }),
			priorSessionsBlock: buildPriorSessionsBlock({
				currentSessionId: session.id,
				sessions: completedSessions,
			}),
			recentNotesBlock: buildRecentNotesBlock({
				notes: recentNotesResult.data.map((note) => ({
					body: note.body,
					updatedAt: note.updatedAt,
				})),
			}),
			sessionContextBlock: buildSessionContextBlock({ session, transcriptText }),
			sessionIntelligenceBlock: buildSessionIntelligenceBlock({ intelligence }),
		}),
	});

	if (!result.output) {
		return null;
	}

	return upsertSessionTreatmentPlan({
		data: normalizeGeneratedTreatmentPlan({ output: result.output }),
		organizationId,
		patientId: session.patientId,
		practitionerEmail,
		practitionerName,
		sessionId: session.id,
	});
};
