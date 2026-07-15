import { generateText, Output } from "ai";
import { and, desc, eq } from "drizzle-orm";

import { models } from "@getolv/ai/models";
import { buildPatientSummaryPrompt, patientSummaryOutputSchema } from "@getolv/ai/prompts";
import { db, normalizePatientSessionIntelligence, noteMentions, notes, patients } from "@getolv/db";
import { logger } from "@getolv/logger/server";

const PATIENT_SUMMARY_MAX_LENGTH = 900;
const CONTEXT_TEXT_MAX_LENGTH = 360;
const TRANSCRIPT_MAX_LENGTH = 2200;

const normalizeText = ({ text, maxLength }: { text: string | null | undefined; maxLength: number }) => {
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

const clampPatientSummary = ({ text }: { text: string | null | undefined }) => {
	if (!text) {
		return null;
	}

	const normalized = text.replace(/\s+/g, " ").trim();

	if (!normalized) {
		return null;
	}

	if (normalized.length <= PATIENT_SUMMARY_MAX_LENGTH) {
		return normalized;
	}

	return `${normalized.slice(0, PATIENT_SUMMARY_MAX_LENGTH - 1)}…`;
};

const buildPatientProfileBlock = ({
	patient,
}: {
	patient: Awaited<ReturnType<typeof db.query.patients.findFirst>>;
}) => {
	if (!patient) {
		return "Patient chart not found.";
	}

	const lines = [
		`Name: ${[patient.firstName, patient.lastName].filter(Boolean).join(" ").trim() || "—"}`,
		patient.email ? `Email: ${patient.email}` : null,
		patient.phoneNumber ? `Phone number: ${patient.phoneNumber}` : null,
		patient.dateOfBirth ? `Date of birth: ${patient.dateOfBirth}` : null,
		patient.gender ? `Gender: ${patient.gender}` : null,
		patient.createdAt ? `Patient since: ${patient.createdAt}` : null,
		patient.allergies ? `Allergies: ${patient.allergies}` : null,
		patient.currentMedications ? `Current medications: ${patient.currentMedications}` : null,
		patient.pastMedicalHistory ? `Personal medical history: ${patient.pastMedicalHistory}` : null,
		patient.familyMedicalHistory ? `Family medical history: ${patient.familyMedicalHistory}` : null,
		patient.additionalContext ? `Additional context: ${patient.additionalContext}` : null,
		patient.summary ? `Existing patient summary: ${patient.summary}` : null,
	].filter((line): line is string => Boolean(line));

	return lines.join("\n");
};

const buildCurrentSessionBlock = ({
	session,
}: {
	session:
		| (Awaited<ReturnType<typeof db.query.patientSessions.findFirst>> & {
				transcriptTurns?: Array<{ speaker: string; text: string }>;
		  })
		| null
		| undefined;
}) => {
	if (!session) {
		return "No newly completed session was provided.";
	}

	const normalizedIntelligence = normalizePatientSessionIntelligence(session.intelligence);
	const transcriptSource =
		session.finalTranscript ||
		session.transcriptTurns?.map((turn) => `[${turn.speaker}] ${turn.text}`).join("\n") ||
		null;

	const lines = [
		session.title ? `Title: ${session.title}` : null,
		session.createdAt ? `Started: ${session.createdAt}` : null,
		session.finalizedAt ? `Completed: ${session.finalizedAt}` : null,
		session.summary ? `Session summary: ${session.summary}` : null,
		normalizedIntelligence?.visitReason ? `Visit reason: ${normalizedIntelligence.visitReason}` : null,
		normalizedIntelligence?.riskFlags.length ? `Risk flags: ${normalizedIntelligence.riskFlags.join(", ")}` : null,
		normalizedIntelligence?.liveNote ? `Clinical note: ${normalizedIntelligence.liveNote}` : null,
		transcriptSource
			? `Transcript excerpt: ${normalizeText({ text: transcriptSource, maxLength: TRANSCRIPT_MAX_LENGTH })}`
			: null,
	].filter((line): line is string => Boolean(line));

	return lines.join("\n");
};

const buildPriorSessionsBlock = ({
	sessions,
	currentSessionId,
}: {
	currentSessionId: string | null;
	sessions: Array<{
		id: string;
		title: string | null;
		summary: string | null;
		createdAt: string;
	}>;
}) => {
	const priorSessions = sessions
		.filter((session) => session.id !== currentSessionId)
		.map((session) => {
			const summary = normalizeText({ text: session.summary, maxLength: CONTEXT_TEXT_MAX_LENGTH });
			const title = session.title ?? "Untitled session";

			return `- ${title} (${session.createdAt})${summary ? `: ${summary}` : ""}`;
		});

	return priorSessions.length > 0 ? priorSessions.join("\n") : "No prior completed sessions.";
};

const buildNotesBlock = ({ patientNotes }: { patientNotes: Array<{ body: string; updatedAt: string }> }) => {
	const lines = patientNotes
		.map((note) => {
			const body = normalizeText({ text: note.body, maxLength: CONTEXT_TEXT_MAX_LENGTH });

			if (!body) {
				return null;
			}

			return `- ${note.updatedAt}: ${body}`;
		})
		.filter((line): line is string => Boolean(line));

	return lines.length > 0 ? lines.join("\n") : "No patient notes.";
};

const buildLabReportsBlock = ({
	labReports,
}: {
	labReports: Array<{ createdAt: string; reportDate: string | null; summary: string | null }>;
}) => {
	const lines = labReports
		.map((report) => {
			const summary = normalizeText({ text: report.summary, maxLength: CONTEXT_TEXT_MAX_LENGTH });

			if (!summary) {
				return `- ${report.reportDate ?? report.createdAt}: report available, summary pending`;
			}

			return `- ${report.reportDate ?? report.createdAt}: ${summary}`;
		})
		.filter((line): line is string => Boolean(line));

	return lines.length > 0 ? lines.join("\n") : "No summarized lab reports.";
};

const buildWorkoutPlansBlock = ({
	workoutPlans,
}: {
	workoutPlans: Array<{
		createdAt: string;
		daysPerWeek: number | null;
		durationWeeks: number | null;
		summary: string | null;
		title: string;
	}>;
}) => {
	const lines = workoutPlans
		.map((plan) => {
			const summary = normalizeText({ text: plan.summary, maxLength: CONTEXT_TEXT_MAX_LENGTH });
			const cadence = [
				plan.durationWeeks ? `${plan.durationWeeks} weeks` : null,
				plan.daysPerWeek ? `${plan.daysPerWeek} days/week` : null,
			]
				.filter(Boolean)
				.join(", ");

			if (!summary && !cadence) {
				return `- ${plan.title} (${plan.createdAt})`;
			}

			return `- ${plan.title} (${plan.createdAt})${cadence ? ` [${cadence}]` : ""}${
				summary ? `: ${summary}` : ""
			}`;
		})
		.filter((line): line is string => Boolean(line));

	return lines.length > 0 ? lines.join("\n") : "No workout plans.";
};

export const refreshPatientSummary = async ({
	organizationId,
	patientId,
	sessionId,
}: {
	organizationId: string;
	patientId: string;
	sessionId?: string | null;
}) => {
	try {
		const patient = await db.query.patients.findFirst({
			where: {
				id: patientId,
				organizationId,
			},
		});

		if (!patient) {
			return null;
		}

		const [currentSession, completedSessions, patientNotes, labReports, workoutPlans] = await Promise.all([
			sessionId
				? db.query.patientSessions.findFirst({
						where: {
							id: sessionId,
							organizationId,
							patientId,
						},
						with: {
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
					})
				: Promise.resolve(null),
			db.query.patientSessions.findMany({
				where: {
					organizationId,
					patientId,
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
			db
				.select({
					body: notes.body,
					updatedAt: notes.updatedAt,
				})
				.from(noteMentions)
				.innerJoin(notes, eq(noteMentions.noteId, notes.id))
				.where(
					and(
						eq(noteMentions.resourceType, "patient"),
						eq(noteMentions.resourceId, patientId),
						eq(notes.organizationId, organizationId)
					)
				)
				.orderBy(desc(notes.updatedAt)),
			db.query.patientLabReports.findMany({
				where: {
					organizationId,
					patientId,
				},
				columns: {
					createdAt: true,
					reportDate: true,
					summary: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			}),
			db.query.patientWorkoutPlans.findMany({
				where: {
					organizationId,
					patientId,
				},
				columns: {
					createdAt: true,
					daysPerWeek: true,
					durationWeeks: true,
					summary: true,
					title: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			}),
		]);

		const result = await generateText({
			model: models.fast.model,
			output: Output.object({
				schema: patientSummaryOutputSchema,
			}),
			prompt: buildPatientSummaryPrompt({
				currentSessionBlock: buildCurrentSessionBlock({ session: currentSession }),
				labReportsBlock: buildLabReportsBlock({ labReports }),
				notesBlock: buildNotesBlock({ patientNotes }),
				patientProfileBlock: buildPatientProfileBlock({ patient }),
				priorSessionsBlock: buildPriorSessionsBlock({
					currentSessionId: currentSession?.id ?? null,
					sessions: completedSessions,
				}),
				workoutPlansBlock: buildWorkoutPlansBlock({ workoutPlans }),
			}),
		});

		const summary = clampPatientSummary({ text: result.output?.summary });

		if (!summary || summary === patient.summary) {
			return patient;
		}

		const [updatedPatient] = await db
			.update(patients)
			.set({ summary })
			.where(and(eq(patients.id, patientId), eq(patients.organizationId, organizationId)))
			.returning();

		return updatedPatient ?? patient;
	} catch (error) {
		// Summary generation is secondary; the committed session mutation should still succeed.
		logger.error({
			message: "Failed to refresh patient summary after session mutation",
			metadata: {
				organizationId,
				patientId,
				sessionId,
			},
			error,
		});

		return;
	}
};
