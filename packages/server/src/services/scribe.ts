import { cache } from "react";

import { betterFetch } from "@better-fetch/fetch";

import type { PatientSessionTranscriptMetadata, SessionTranscriptTurnMetadata } from "@getolv/db";
import {
	assemblyAiMedicalDomain,
	assemblyAiPreRecordedSpeechModels,
	buildAssemblyAiMedicalKeytermsFromPatient,
} from "@getolv/utils";

import { assembly } from "../lib/assemblyai";
import {
	getPatientSessionMedicalContext,
	replaceTranscriptTurns,
	updatePatientSessionFinalTranscript,
} from "./patient-sessions";

const TOKEN_EXPIRY_SECONDS = 600;
const KNOWN_SPEAKER_ROLES = ["Practitioner", "Patient"] as const;

type ScribeSpeaker = "practitioner" | "patient" | "unknown";

type AssemblyAiTranscriptLike = {
	audio_duration?: number | null;
	confidence?: number | null;
	entities?: Array<{
		end?: number | null;
		entity_type?: string | null;
		start?: number | null;
		text: string;
	}> | null;
	language_code?: string | null;
	metadata?: {
		warnings?: Array<{
			code?: string | null;
			message?: string | null;
		}> | null;
	} | null;
	speech_understanding?: {
		response?: {
			speaker_identification?: {
				mapping?: Record<string, string>;
			};
		};
	};
	utterances?: Array<{
		confidence?: number | null;
		end?: number | null;
		speaker: string;
		start?: number | null;
		text: string;
	}> | null;
};

const normalizeSpeakerRole = (value: string | null | undefined): ScribeSpeaker => {
	const normalizedValue = value?.trim().toLowerCase();

	if (!normalizedValue) {
		return "unknown";
	}

	if (
		normalizedValue === "practitioner" ||
		normalizedValue === "doctor" ||
		normalizedValue === "provider" ||
		normalizedValue === "clinician"
	) {
		return "practitioner";
	}

	if (normalizedValue === "patient") {
		return "patient";
	}

	return "unknown";
};

const resolveCanonicalSpeaker = ({
	rawSpeaker,
	speakerMapping,
	assignments,
	firstSpeakerRole = "practitioner",
}: {
	rawSpeaker: string;
	speakerMapping?: Record<string, string>;
	assignments: Record<string, ScribeSpeaker>;
	firstSpeakerRole?: ScribeSpeaker;
}) => {
	const identifiedSpeaker = normalizeSpeakerRole(speakerMapping?.[rawSpeaker] ?? rawSpeaker);

	if (identifiedSpeaker !== "unknown") {
		return {
			assignments,
			speaker: identifiedSpeaker,
		};
	}

	if (assignments[rawSpeaker]) {
		return {
			assignments,
			speaker: assignments[rawSpeaker],
		};
	}

	const assignedRoles = new Set(Object.values(assignments));
	const secondSpeakerRole: ScribeSpeaker = firstSpeakerRole === "practitioner" ? "patient" : "practitioner";
	const nextSpeaker: ScribeSpeaker = !assignedRoles.has(firstSpeakerRole)
		? firstSpeakerRole
		: !assignedRoles.has(secondSpeakerRole)
			? secondSpeakerRole
			: "unknown";

	return {
		assignments: {
			...assignments,
			[rawSpeaker]: nextSpeaker,
		},
		speaker: nextSpeaker,
	};
};

const buildTranscriptEntities = ({ transcript }: { transcript: AssemblyAiTranscriptLike }) =>
	(transcript.entities ?? []).flatMap((entity) => {
		const text = entity.text.trim();

		if (!text) {
			return [];
		}

		return [
			{
				endMs: entity.end ?? null,
				startMs: entity.start ?? null,
				text,
				type: entity.entity_type?.trim() || "unknown",
			},
		];
	});

const buildTranscriptWarnings = ({ transcript }: { transcript: AssemblyAiTranscriptLike }) =>
	(transcript.metadata?.warnings ?? []).flatMap((warning) => {
		const message = warning.message?.trim();

		if (!message) {
			return [];
		}

		return [
			{
				code: warning.code?.trim() || null,
				message,
			},
		];
	});

const buildTranscriptMetadata = ({
	keyterms,
	transcript,
}: {
	keyterms: string[];
	transcript: AssemblyAiTranscriptLike;
}): PatientSessionTranscriptMetadata => ({
	audioDurationSeconds: transcript.audio_duration ?? null,
	confidence: transcript.confidence ?? null,
	domain: assemblyAiMedicalDomain,
	entities: buildTranscriptEntities({ transcript }),
	keyterms,
	languageCode: transcript.language_code ?? null,
	source: "pre_recorded",
	speechModels: [...assemblyAiPreRecordedSpeechModels],
	warnings: buildTranscriptWarnings({ transcript }),
});

export const buildCanonicalTranscriptTurns = ({
	transcript,
	firstSpeakerRole = "practitioner",
}: {
	transcript: AssemblyAiTranscriptLike;
	firstSpeakerRole?: ScribeSpeaker;
}) => {
	let assignments: Record<string, ScribeSpeaker> = {};
	const speakerMapping = transcript.speech_understanding?.response?.speaker_identification?.mapping;

	return (transcript.utterances ?? []).flatMap((utterance) => {
		const text = utterance.text.trim();

		if (!text) {
			return [];
		}

		const resolvedSpeaker = resolveCanonicalSpeaker({
			rawSpeaker: utterance.speaker,
			speakerMapping,
			assignments,
			firstSpeakerRole,
		});
		const metadata: SessionTranscriptTurnMetadata = {
			confidence: utterance.confidence ?? null,
			endMs: utterance.end ?? null,
			rawSpeakerLabel: utterance.speaker,
			source: "pre_recorded",
			startMs: utterance.start ?? null,
		};

		assignments = resolvedSpeaker.assignments;

		return [
			{
				metadata,
				speaker: resolvedSpeaker.speaker,
				text,
			},
		];
	});
};

export const createScribeToken = cache(async () => {
	if (!process.env.ASSEMBLYAI_API_KEY) {
		throw new Error("ASSEMBLYAI_API_KEY is not set");
	}

	const url = new URL("https://streaming.assemblyai.com/v3/token");
	url.search = new URLSearchParams({
		expires_in_seconds: String(TOKEN_EXPIRY_SECONDS),
	}).toString();

	const { data, error } = await betterFetch<{ token: string }>(url.toString(), {
		method: "GET",
		headers: {
			Authorization: process.env.ASSEMBLYAI_API_KEY,
		},
	});

	if (error || !data) {
		throw new Error(`Failed to generate streaming token: ${error?.message ?? "Unknown error"}`);
	}

	return {
		token: data.token,
		expiresAt: Date.now() + TOKEN_EXPIRY_SECONDS * 1000,
	};
});

export const transcribeWithMedicalMode = async ({
	audio,
	sessionId,
	organizationId,
}: {
	audio: Buffer;
	sessionId: string;
	organizationId: string;
}) => {
	const sessionContext = await getPatientSessionMedicalContext({
		sessionId,
		organizationId,
	});

	if (!sessionContext) {
		throw new Error("Patient session not found");
	}

	const keyterms = buildAssemblyAiMedicalKeytermsFromPatient({
		allergies: sessionContext.patient?.allergies,
		currentMedications: sessionContext.patient?.currentMedications,
		diagnosis: sessionContext.patient?.diagnosis,
		familyMedicalHistory: sessionContext.patient?.familyMedicalHistory,
		pastMedicalHistory: sessionContext.patient?.pastMedicalHistory,
	});
	const transcript = await assembly.transcripts.transcribe({
		audio,
		speech_models: [...assemblyAiPreRecordedSpeechModels],
		language_detection: true,
		domain: assemblyAiMedicalDomain,
		speaker_labels: true,
		speakers_expected: 2,
		punctuate: true,
		format_text: true,
		entity_detection: true,
		...(keyterms.length > 0 ? { keyterms_prompt: keyterms } : {}),
		speech_understanding: {
			request: {
				speaker_identification: {
					speaker_type: "role",
					known_values: [...KNOWN_SPEAKER_ROLES],
				},
			},
		},
	});

	if (transcript.status === "error") {
		throw new Error(`Transcription failed: ${transcript.error}`);
	}

	const finalText = transcript.text ?? "";
	const canonicalTurns = buildCanonicalTranscriptTurns({ transcript });
	const transcriptMetadata = buildTranscriptMetadata({
		keyterms,
		transcript,
	});

	if (canonicalTurns.length > 0) {
		await replaceTranscriptTurns({
			sessionId,
			organizationId,
			turns: canonicalTurns,
		});
	}

	const updated = await updatePatientSessionFinalTranscript({
		sessionId,
		organizationId,
		finalTranscript: finalText,
		transcriptMetadata,
	});

	return {
		transcript: finalText,
		session: updated,
		transcriptMetadata,
		transcriptTurns: canonicalTurns,
	};
};
