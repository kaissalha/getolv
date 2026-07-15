import { generateText, Output } from "ai";

import { models } from "@getolv/ai/models";
import {
	buildSessionIntelligencePrompt,
	sessionIntelligenceWithMetaSchema,
	type SessionIntelligencePayload,
} from "@getolv/ai/prompts";
import {
	normalizePatientClinicalState,
	normalizePatientDiagnosis,
	normalizePatientSessionCompletedTodoIds,
	normalizePatientSessionIntelligence,
	normalizePatientTodos,
	type Patient,
	type PatientSessionIntelligence,
} from "@getolv/db";

import { getLatestLabReportSummary } from "./lab";
import { listNotes } from "./notes";
import {
	getPatientSessionIntelligenceBaseline,
	getPatientSessions,
	getSessionTranscriptTurns,
	updatePatientSessionIntelligence,
	updatePatientSessionMetadata,
} from "./patient-sessions";
import { getPatient } from "./patients";

export type SessionIntelligenceAnalyzeResult = SessionIntelligencePayload & {
	completedTodoIds: string[];
	sessionTitle: string | null;
	sessionSummary: string | null;
};

const OUTPUT_LIMITS = {
	visitReasonMaxLen: 120,
	riskFlagsMax: 5,
	riskFlagMaxLen: 40,
	liveNoteMaxLen: 450,
	thingsToAskMax: 5,
	thingsToAskMaxLen: 120,
	todosMax: 6,
	todoMaxLen: 100,
	workingDxMax: 3,
	differentialDxMax: 5,
	dxReasoningMaxLen: 150,
	dxEvidenceMaxLen: 120,
	sessionTitleMaxLen: 72,
	sessionSummaryMaxLen: 240,
} as const;

const truncate = (str: string | null | undefined, max: number): string | null => {
	if (!str) return null;
	return str.length <= max ? str : `${str.slice(0, max - 1)}…`;
};

const clampPayload = (raw: SessionIntelligencePayload): SessionIntelligencePayload => ({
	visitReason: truncate(raw.visitReason, OUTPUT_LIMITS.visitReasonMaxLen),
	riskFlags: raw.riskFlags.slice(0, OUTPUT_LIMITS.riskFlagsMax).map((f) => f.slice(0, OUTPUT_LIMITS.riskFlagMaxLen)),
	liveNote: truncate(raw.liveNote?.trim(), OUTPUT_LIMITS.liveNoteMaxLen) ?? "",
	thingsToAsk: raw.thingsToAsk.slice(0, OUTPUT_LIMITS.thingsToAskMax).map((q) => ({
		id: q.id,
		question: truncate(q.question, OUTPUT_LIMITS.thingsToAskMaxLen) ?? q.question,
		category: q.category ? q.category.slice(0, 20) : null,
	})),
	todos: raw.todos.slice(0, OUTPUT_LIMITS.todosMax).map((t) => ({
		id: t.id,
		text: truncate(t.text, OUTPUT_LIMITS.todoMaxLen) ?? t.text,
		category: t.category ? t.category.slice(0, 20) : null,
	})),
	workingDx: raw.workingDx.slice(0, OUTPUT_LIMITS.workingDxMax).map((d) => ({
		name: d.name.slice(0, 80),
		reasoning: truncate(d.reasoning, OUTPUT_LIMITS.dxReasoningMaxLen),
		evidence: truncate(d.evidence, OUTPUT_LIMITS.dxEvidenceMaxLen),
		missing: truncate(d.missing, OUTPUT_LIMITS.dxEvidenceMaxLen),
		verifyNext: truncate(d.verifyNext, OUTPUT_LIMITS.dxEvidenceMaxLen),
	})),
	differentialDx: raw.differentialDx.slice(0, OUTPUT_LIMITS.differentialDxMax).map((d) => ({
		name: d.name.slice(0, 80),
		reasoning: truncate(d.reasoning, OUTPUT_LIMITS.dxReasoningMaxLen),
		evidence: truncate(d.evidence, OUTPUT_LIMITS.dxEvidenceMaxLen),
		missing: truncate(d.missing, OUTPUT_LIMITS.dxEvidenceMaxLen),
		verifyNext: truncate(d.verifyNext, OUTPUT_LIMITS.dxEvidenceMaxLen),
	})),
	practitionerQaTurns: raw.practitionerQaTurns,
});

const clampSessionTitle = (raw: string | null | undefined): string | null => {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	return trimmed.length <= OUTPUT_LIMITS.sessionTitleMaxLen
		? trimmed
		: `${trimmed.slice(0, OUTPUT_LIMITS.sessionTitleMaxLen - 1)}…`;
};

const clampSessionSummary = (raw: string | null | undefined): string | null => {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	return trimmed.length <= OUTPUT_LIMITS.sessionSummaryMaxLen
		? trimmed
		: `${trimmed.slice(0, OUTPUT_LIMITS.sessionSummaryMaxLen - 1)}…`;
};

const buildSessionRecordBlock = ({
	title,
	summary,
	createdAt,
}: {
	title: string | null | undefined;
	summary: string | null | undefined;
	createdAt: string | null | undefined;
}) => {
	const lines: string[] = [];
	if (title?.trim()) {
		lines.push(`Title: ${title.trim()}`);
	}
	if (summary?.trim()) {
		const s = summary.trim();
		lines.push(`Summary (if any): ${s.slice(0, 500)}${s.length > 500 ? "…" : ""}`);
	}
	if (createdAt) {
		lines.push(`Session started: ${createdAt}`);
	}
	if (lines.length === 0) {
		return "No session title or summary on file yet.";
	}
	return lines.join("\n");
};

const buildExistingIntelligenceBlock = (intel: PatientSessionIntelligence | null | undefined) => {
	const normalized = normalizePatientSessionIntelligence(intel);
	if (!normalized) {
		return "None yet — produce the first structured intelligence for this session from the transcript and context.";
	}
	const lines: string[] = [];
	if (normalized.visitReason) {
		lines.push(`visitReason: ${normalized.visitReason}`);
	}
	if (normalized.riskFlags.length > 0) {
		lines.push(`riskFlags:\n${normalized.riskFlags.map((f) => `- ${f}`).join("\n")}`);
	}
	if (normalized.liveNote.trim()) {
		lines.push(`liveNote (running assistant guidance for the clinician): ${normalized.liveNote.trim()}`);
	}
	if (normalized.thingsToAsk.length > 0) {
		lines.push(
			"thingsToAsk:",
			...normalized.thingsToAsk.map((q) => `- [id=${q.id}] (${q.category ?? "general"}) ${q.question}`)
		);
	}
	if (normalized.todos.length > 0) {
		lines.push("todos:", ...normalized.todos.map((t) => `- [id=${t.id}] (${t.category ?? "general"}) ${t.text}`));
	}
	if (normalized.workingDx.length > 0) {
		lines.push("workingDx:", ...normalized.workingDx.map((d) => `- ${d.name}`));
	}
	if (normalized.differentialDx.length > 0) {
		lines.push("differentialDx:", ...normalized.differentialDx.map((d) => `- ${d.name}`));
	}
	if (normalized.practitionerQaTurns.length > 0) {
		lines.push(
			"Persisted practitioner Q&A (may lag behind the Clinician follow-up section — prefer that section on conflict):"
		);
		for (const { question, answer } of normalized.practitionerQaTurns) {
			lines.push(`- Q: ${question}`, `  A: ${answer}`);
		}
	}
	return lines.join("\n");
};

const buildPatientProfileBlock = ({ patient, fallbackName }: { patient: Patient | null; fallbackName: string }) => {
	if (!patient) {
		return fallbackName.trim()
			? `Patient display name (client): ${fallbackName.trim()}\nFull chart demographics are not available.`
			: "Full chart demographics are not available.";
	}

	const { diagnosis, todos } = normalizePatientClinicalState({
		diagnosis: patient.diagnosis,
		todos: patient.todos,
	});

	const lines: string[] = [];
	lines.push(`Name: ${[patient.firstName, patient.lastName].filter(Boolean).join(" ").trim() || "—"}`);
	if (patient.email.trim()) {
		lines.push(`Email: ${patient.email}`);
	}
	if (patient.phoneNumber?.trim()) {
		lines.push(`Phone: ${patient.phoneNumber}`);
	}
	if (patient.dateOfBirth) {
		lines.push(`Date of birth: ${patient.dateOfBirth}`);
	}
	if (patient.gender?.trim()) {
		lines.push(`Gender: ${patient.gender}`);
	}
	if (patient.allergies?.trim()) {
		lines.push(`Allergies: ${patient.allergies.trim()}`);
	}
	if (patient.currentMedications?.trim()) {
		lines.push(`Current medications: ${patient.currentMedications.trim()}`);
	}
	if (patient.pastMedicalHistory?.trim()) {
		lines.push(`Personal medical history: ${patient.pastMedicalHistory.trim()}`);
	}
	if (patient.familyMedicalHistory?.trim()) {
		lines.push(`Family medical history: ${patient.familyMedicalHistory.trim()}`);
	}
	if (patient.additionalContext?.trim()) {
		lines.push(
			`Additional patient context (clinician reference — not shared with patient): ${patient.additionalContext.trim()}`
		);
	}
	if (patient.summary?.trim()) {
		lines.push(`Patient summary (chart): ${patient.summary.trim()}`);
	}
	if (diagnosis.workingDx.length > 0 || diagnosis.differentialDx.length > 0) {
		const diagnosisSummary = [
			diagnosis.workingDx.length > 0
				? `Working diagnosis: ${diagnosis.workingDx.map((entry) => entry.name).join(", ")}`
				: null,
			diagnosis.differentialDx.length > 0
				? `Differential diagnosis: ${diagnosis.differentialDx.map((entry) => entry.name).join(", ")}`
				: null,
		]
			.filter(Boolean)
			.join(" | ");

		if (diagnosisSummary) {
			lines.push(`Patient clinical state: ${diagnosisSummary}`);
		}
	}
	if (todos.length > 0) {
		lines.push(`Patient carry-forward todos: ${todos.map((todo) => todo.text).join("; ")}`);
	}
	return lines.join("\n");
};

const buildClinicianContextBlock = ({ name, email }: { name: string; email: string }) => {
	const safeName = name.trim() || "Clinician";
	const safeEmail = email.trim();
	return safeEmail
		? `Signed-in practitioner: ${safeName} (${safeEmail})\nFrame suggestions for this clinician. Keep tone appropriate for in-room clinical support.`
		: `Signed-in practitioner: ${safeName}\nFrame suggestions for this clinician. Keep tone appropriate for in-room clinical support.`;
};

const buildPractitionerFollowUpBlock = ({
	turns,
	currentPrompt,
}: {
	turns: Array<{ question: string; answer: string }>;
	currentPrompt: string | null | undefined;
}) => {
	const parts: string[] = [];
	if (turns.length > 0) {
		parts.push(
			"### Prior clinician questions and your earlier answers",
			"Echo these in `practitionerQaTurns` unless the transcript clearly contradicts them—then update the affected answer only."
		);
		for (const { question, answer } of turns) {
			parts.push(`- Q: ${question}`, `  A: ${answer}`);
		}
		parts.push("");
	}
	const trimmed = currentPrompt?.trim();
	if (trimmed) {
		parts.push(
			"### Current question from the clinician (respond now)",
			"Answer concisely in `practitionerQaTurns` and weave the substance into the `liveNote` guidance when it changes your advice, hypotheses, or next-step suggestions.",
			trimmed
		);
	}
	if (parts.length === 0) {
		return "No practitioner follow-up questions yet.";
	}
	return parts.join("\n");
};

export const generateSessionIntelligence = async ({
	sessionId,
	patientId,
	patientName = null,
	organizationId,
	practitionerName,
	practitionerEmail,
	practitionerPrompt,
	practitionerQaTurns = [],
}: {
	sessionId: string;
	patientId: string;
	patientName?: string | null;
	organizationId: string;
	practitionerName: string;
	practitionerEmail: string;
	practitionerPrompt?: string | null;
	practitionerQaTurns?: Array<{ question: string; answer: string }>;
}): Promise<SessionIntelligenceAnalyzeResult> => {
	const [turns, priorSessions, notesResult, labReport, sessionBaseline, patientRow] = await Promise.all([
		getSessionTranscriptTurns(sessionId, organizationId),
		getPatientSessions(patientId, organizationId),
		listNotes({ organizationId, resourceType: "patient", resourceId: patientId, pageSize: 10 }),
		getLatestLabReportSummary({ patientId }),
		getPatientSessionIntelligenceBaseline({ organizationId, patientId, sessionId }),
		getPatient({ id: patientId, organizationId }),
	]);

	const fallbackName = patientName?.trim() ?? "";
	const patientProfileBlock = buildPatientProfileBlock({
		patient: patientRow ?? null,
		fallbackName,
	});

	const transcriptText = turns.map((t) => `[${t.speaker}]: ${t.text}`).join("\n");

	const otherSessions = priorSessions.filter((s) => s.id !== sessionId);
	const priorSessionsSummary = otherSessions
		.slice(0, 5)
		.map((s) => `- ${s.title || "Untitled"} (${s.createdAt}): ${s.summary || "No summary"}`)
		.join("\n");

	const notesSummary = notesResult.data
		.slice(0, 5)
		.map((n) => `- ${n.body.slice(0, 200)}`)
		.join("\n");

	const labSummary = labReport?.summary ?? "";

	const practitionerFollowUpBlock = buildPractitionerFollowUpBlock({
		turns: practitionerQaTurns,
		currentPrompt: practitionerPrompt?.trim() || null,
	});

	const clinicianContextBlock = buildClinicianContextBlock({
		name: practitionerName,
		email: practitionerEmail,
	});

	const fallbackClinicalState = normalizePatientClinicalState({
		diagnosis: patientRow?.diagnosis,
		todos: patientRow?.todos,
	});
	const fallbackIntelligence = {
		visitReason: null,
		riskFlags: [],
		liveNote: "",
		thingsToAsk: [],
		todos: fallbackClinicalState.todos,
		workingDx: fallbackClinicalState.diagnosis.workingDx,
		differentialDx: fallbackClinicalState.diagnosis.differentialDx,
		practitionerQaTurns: [],
	};
	const baselineIntelligence =
		normalizePatientSessionIntelligence(sessionBaseline?.intelligence) ?? fallbackIntelligence;

	const sessionRecordBlock = buildSessionRecordBlock({
		title: sessionBaseline?.title,
		summary: sessionBaseline?.summary,
		createdAt: sessionBaseline?.createdAt,
	});

	const existingIntelligenceBlock = buildExistingIntelligenceBlock(baselineIntelligence);

	const result = await generateText({
		model: models.fast.model,
		output: Output.object({ schema: sessionIntelligenceWithMetaSchema }),
		prompt: buildSessionIntelligencePrompt({
			patientProfileBlock,
			clinicianContextBlock,
			sessionRecordBlock,
			existingIntelligenceBlock,
			transcriptText,
			priorSessionsSummary,
			notesSummary,
			labSummary,
			practitionerFollowUpBlock,
		}),
	});

	const raw = result.output ?? {
		visitReason: null,
		riskFlags: [],
		liveNote: "",
		thingsToAsk: [],
		todos: [],
		workingDx: [],
		differentialDx: [],
		practitionerQaTurns: [],
		sessionTitle: null,
		sessionSummary: null,
	};

	const { sessionTitle: rawSessionTitle, sessionSummary: rawSessionSummary, ...intelRest } = raw;
	const clampedPayload = clampPayload(intelRest);
	const normalizedDiagnosis = normalizePatientDiagnosis({
		workingDx: clampedPayload.workingDx,
		differentialDx: clampedPayload.differentialDx,
	});
	const payload: PatientSessionIntelligence = {
		...clampedPayload,
		todos: normalizePatientTodos(clampedPayload.todos),
		workingDx: normalizedDiagnosis.workingDx,
		differentialDx: normalizedDiagnosis.differentialDx,
	};

	const sessionTitle = clampSessionTitle(rawSessionTitle);
	const sessionSummary = clampSessionSummary(rawSessionSummary);
	const completedTodoIds = normalizePatientSessionCompletedTodoIds({
		completedTodoIds: sessionBaseline?.completedTodoIds,
		todos: payload.todos,
	});

	await updatePatientSessionIntelligence({
		completedTodoIds,
		sessionId,
		organizationId,
		intelligence: payload,
	});

	if (sessionTitle || sessionSummary) {
		await updatePatientSessionMetadata({
			sessionId,
			organizationId,
			...(sessionTitle ? { title: sessionTitle } : {}),
			...(sessionSummary ? { summary: sessionSummary } : {}),
		});
	}

	return { ...payload, completedTodoIds, sessionTitle, sessionSummary };
};
