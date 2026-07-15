import { beforeEach, describe, expect, it, vi } from "vitest";

import { assemblyAiMedicalDomain, assemblyAiPreRecordedSpeechModels } from "@getolv/utils";

const {
	betterFetch,
	getPatientSessionMedicalContext,
	replaceTranscriptTurns,
	transcribe,
	updatePatientSessionFinalTranscript,
} = vi.hoisted(() => ({
	betterFetch: vi.fn(),
	getPatientSessionMedicalContext: vi.fn(),
	replaceTranscriptTurns: vi.fn(),
	transcribe: vi.fn(),
	updatePatientSessionFinalTranscript: vi.fn(),
}));

vi.mock("@better-fetch/fetch", () => ({
	betterFetch,
}));

vi.mock("../../src/lib/assemblyai", () => ({
	assembly: {
		transcripts: {
			transcribe,
		},
	},
}));

vi.mock("../../src/services/patient-sessions", () => ({
	getPatientSessionMedicalContext,
	replaceTranscriptTurns,
	updatePatientSessionFinalTranscript,
}));

import { buildCanonicalTranscriptTurns, createScribeToken, transcribeWithMedicalMode } from "../../src/services/scribe";

describe("scribe service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getPatientSessionMedicalContext.mockResolvedValue({
			id: "session-1",
			patient: {
				allergies: "shellfish",
				currentMedications: "metformin",
				diagnosis: {
					differentialDx: [],
					workingDx: [{ name: "hypertension" }],
				},
				familyMedicalHistory: null,
				pastMedicalHistory: "type 2 diabetes",
			},
			patientId: "patient-1",
		});
	});

	it("creates a streaming token", async () => {
		betterFetch.mockResolvedValue({ data: { token: "token-1" }, error: null });

		const result = await createScribeToken();

		expect(result.token).toBe("token-1");
	});

	it("maps final AssemblyAI utterances to practitioner and patient roles with metadata", () => {
		const turns = buildCanonicalTranscriptTurns({
			transcript: {
				utterances: [
					{ confidence: 0.97, end: 1400, speaker: "A", start: 200, text: "What brings you in today?" },
					{
						confidence: 0.92,
						end: 3400,
						speaker: "B",
						start: 1700,
						text: "My shoulder has been hurting for two weeks.",
					},
				],
				speech_understanding: {
					response: {
						speaker_identification: {
							mapping: {
								A: "Practitioner",
								B: "Patient",
							},
						},
					},
				},
			},
		});

		expect(turns).toEqual([
			{
				metadata: {
					confidence: 0.97,
					endMs: 1400,
					rawSpeakerLabel: "A",
					source: "pre_recorded",
					startMs: 200,
				},
				speaker: "practitioner",
				text: "What brings you in today?",
			},
			{
				metadata: {
					confidence: 0.92,
					endMs: 3400,
					rawSpeakerLabel: "B",
					source: "pre_recorded",
					startMs: 1700,
				},
				speaker: "patient",
				text: "My shoulder has been hurting for two weeks.",
			},
		]);
	});

	it("falls back to the encounter-order heuristic when role mapping is unavailable", () => {
		const turns = buildCanonicalTranscriptTurns({
			transcript: {
				utterances: [
					{ speaker: "A", text: "Good morning." },
					{ speaker: "B", text: "I've had a cough since Tuesday." },
				],
			},
		});

		expect(turns).toEqual([
			{
				metadata: {
					confidence: null,
					endMs: null,
					rawSpeakerLabel: "A",
					source: "pre_recorded",
					startMs: null,
				},
				speaker: "practitioner",
				text: "Good morning.",
			},
			{
				metadata: {
					confidence: null,
					endMs: null,
					rawSpeakerLabel: "B",
					source: "pre_recorded",
					startMs: null,
				},
				speaker: "patient",
				text: "I've had a cough since Tuesday.",
			},
		]);
	});

	it("uploads audio bytes to AssemblyAI for post-visit transcription with medical keyterms and entities", async () => {
		const audio = Buffer.from("webm-audio");
		transcribe.mockResolvedValue({
			audio_duration: 42.5,
			confidence: 0.95,
			entities: [
				{ end: 2300, entity_type: "drug", start: 1800, text: "metformin" },
				{ end: 4100, entity_type: "medical_condition", start: 2900, text: "hypertension" },
			],
			language_code: "en_us",
			metadata: {
				warnings: [{ code: "low_audio", message: "Background noise detected" }],
			},
			status: "completed",
			text: "What brings you in today?",
			utterances: [
				{
					confidence: 0.97,
					end: 1600,
					speaker: "A",
					start: 100,
					text: "What brings you in today?",
				},
				{
					confidence: 0.9,
					end: 4800,
					speaker: "B",
					start: 1900,
					text: "My knee has been hurting.",
				},
			],
			speech_understanding: {
				response: {
					speaker_identification: {
						mapping: {
							A: "Practitioner",
							B: "Patient",
						},
					},
				},
			},
		});
		updatePatientSessionFinalTranscript.mockResolvedValue({ id: "session-1", patientId: "patient-1" });

		await transcribeWithMedicalMode({
			audio,
			sessionId: "session-1",
			organizationId: "org-1",
		});

		expect(transcribe).toHaveBeenCalledWith(
			expect.objectContaining({
				audio,
				domain: assemblyAiMedicalDomain,
				entity_detection: true,
				format_text: true,
				keyterms_prompt: expect.arrayContaining(["hypertension", "metformin", "shellfish"]),
				language_detection: true,
				punctuate: true,
				speech_models: [...assemblyAiPreRecordedSpeechModels],
				speaker_labels: true,
			})
		);
		expect(transcribe.mock.calls[0]?.[0]).not.toHaveProperty("audio_url");
		expect(replaceTranscriptTurns).toHaveBeenCalledWith({
			sessionId: "session-1",
			organizationId: "org-1",
			turns: [
				{
					metadata: {
						confidence: 0.97,
						endMs: 1600,
						rawSpeakerLabel: "A",
						source: "pre_recorded",
						startMs: 100,
					},
					speaker: "practitioner",
					text: "What brings you in today?",
				},
				{
					metadata: {
						confidence: 0.9,
						endMs: 4800,
						rawSpeakerLabel: "B",
						source: "pre_recorded",
						startMs: 1900,
					},
					speaker: "patient",
					text: "My knee has been hurting.",
				},
			],
		});
		expect(updatePatientSessionFinalTranscript).toHaveBeenCalledWith({
			finalTranscript: "What brings you in today?",
			organizationId: "org-1",
			sessionId: "session-1",
			transcriptMetadata: {
				audioDurationSeconds: 42.5,
				confidence: 0.95,
				domain: assemblyAiMedicalDomain,
				entities: [
					{ endMs: 2300, startMs: 1800, text: "metformin", type: "drug" },
					{ endMs: 4100, startMs: 2900, text: "hypertension", type: "medical_condition" },
				],
				keyterms: expect.arrayContaining(["hypertension", "metformin", "shellfish"]),
				languageCode: "en_us",
				source: "pre_recorded",
				speechModels: [...assemblyAiPreRecordedSpeechModels],
				warnings: [{ code: "low_audio", message: "Background noise detected" }],
			},
		});
	});
});
