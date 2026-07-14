import { describe, expect, it } from "vitest";

import {
	getTranscriptTurnOverlapLength,
	resolveRegisteredTurns,
	resolveWriteSession,
	shouldQueueSessionRegistration,
	type TranscriptTurn,
} from "../../src/components/patient-sessions/active-session-scribe-provider";

const existingTurns: TranscriptTurn[] = [
	{
		id: "turn-1",
		speaker: "practitioner",
		text: "Previous session transcript",
	},
];

describe("active session scribe provider helpers", () => {
	it("resets shared turns when the session changes even if the new session starts empty", () => {
		const initialTurns: TranscriptTurn[] = [];

		expect(
			resolveRegisteredTurns({
				currentTurns: existingTurns,
				initialTurns,
				isSessionSwitch: true,
			})
		).toEqual(initialTurns);

		expect(
			resolveRegisteredTurns({
				currentTurns: existingTurns,
				initialTurns,
				isSessionSwitch: true,
			})
		).toEqual(initialTurns);
	});

	it("hydrates server turns for the current session when shared turns are still empty", () => {
		const initialTurns: TranscriptTurn[] = [
			{
				id: "turn-2",
				speaker: "patient",
				text: "Server transcript",
			},
		];

		expect(
			resolveRegisteredTurns({
				currentTurns: [],
				initialTurns,
				isSessionSwitch: false,
			})
		).toEqual(initialTurns);
	});

	it("merges late server turns ahead of local turns for the same session", () => {
		const initialTurns: TranscriptTurn[] = [
			{
				id: "turn-1",
				speaker: "practitioner",
				text: "Existing server turn",
			},
		];
		const currentTurns: TranscriptTurn[] = [
			{
				id: "local-turn-1",
				speaker: "patient",
				text: "Local live turn",
			},
		];

		expect(
			resolveRegisteredTurns({
				currentTurns,
				initialTurns,
				isSessionSwitch: false,
			})
		).toEqual([...initialTurns, ...currentTurns]);
	});

	it("avoids duplicating a turn when late hydration already includes the local append", () => {
		const initialTurns: TranscriptTurn[] = [
			{
				id: "turn-1",
				speaker: "practitioner",
				text: "Existing server turn",
			},
			{
				id: "turn-2",
				speaker: "patient",
				text: "Local live turn",
			},
		];
		const currentTurns: TranscriptTurn[] = [
			{
				id: "local-turn-1",
				speaker: "patient",
				text: "Local live turn",
			},
		];

		expect(
			getTranscriptTurnOverlapLength({
				currentTurns,
				initialTurns,
			})
		).toBe(1);

		expect(
			resolveRegisteredTurns({
				currentTurns,
				initialTurns,
				isSessionSwitch: false,
			})
		).toEqual(initialTurns);
	});

	it("prefers the recording session when resolving transcript and upload writes", () => {
		expect(
			resolveWriteSession({
				currentSession: {
					medicalKeyterms: ["hypertension"],
					organizationId: "org-2",
					patientId: "patient-2",
					patientName: "Patient Two",
					sessionId: "session-2",
				},
				recordingSession: {
					medicalKeyterms: ["asthma"],
					organizationId: "org-1",
					patientId: "patient-1",
					patientName: "Patient One",
					sessionId: "session-1",
				},
			})
		).toEqual({
			medicalKeyterms: ["asthma"],
			organizationId: "org-1",
			patientId: "patient-1",
			patientName: "Patient One",
			sessionId: "session-1",
		});
	});

	it("queues session switches while the shared recorder is still busy", () => {
		expect(
			shouldQueueSessionRegistration({
				currentSessionId: "session-1",
				isRecording: true,
				isUploading: false,
				nextSessionId: "session-2",
				status: "recording",
			})
		).toBe(true);

		expect(
			shouldQueueSessionRegistration({
				currentSessionId: "session-1",
				isRecording: false,
				isUploading: true,
				nextSessionId: "session-2",
				status: "idle",
			})
		).toBe(true);

		expect(
			shouldQueueSessionRegistration({
				currentSessionId: "session-1",
				isRecording: false,
				isUploading: false,
				nextSessionId: "session-1",
				status: "idle",
			})
		).toBe(false);
	});
});
