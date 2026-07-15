import { describe, expect, it } from "vitest";

import { assemblyAiMedicalDomain, assemblyAiStreamingSpeechModel } from "@getolv/utils";

import {
	buildAssemblyAiConnectionParams,
	getLiveAssemblyAiSpeaker,
	resolveAssemblyAiSpeaker,
} from "../../src/hooks/scribe/use-scribe";

describe("useScribe helpers", () => {
	it("uses the current conservative u3-rt-pro turn detection params", () => {
		const params = buildAssemblyAiConnectionParams({ token: "token-1" });

		expect(params.get("min_turn_silence")).toBe("800");
		expect(params.get("max_turn_silence")).toBe("3600");
		expect(params.get("speech_model")).toBe(assemblyAiStreamingSpeechModel);
		expect(params.get("domain")).toBe(assemblyAiMedicalDomain);
		expect(params.has("min_end_of_turn_silence_when_confident")).toBe(false);
		expect(params.has("end_of_turn_confidence_threshold")).toBe(false);
	});

	it("serializes medical keyterms into the streaming connection params", () => {
		const params = buildAssemblyAiConnectionParams({
			keyterms: ["hypertension", "metformin 500mg"],
			token: "token-1",
		});

		expect(params.get("keyterms_prompt")).toBe(JSON.stringify(["hypertension", "metformin 500mg"]));
	});

	it("keeps the live speaker badge stable only for confirmed or active speakers", () => {
		expect(
			getLiveAssemblyAiSpeaker({
				speakerLabel: "A",
				assignments: {},
				activeSpeaker: null,
			})
		).toBeNull();

		expect(
			getLiveAssemblyAiSpeaker({
				speakerLabel: "A",
				assignments: { A: "practitioner" },
				activeSpeaker: null,
			})
		).toBe("practitioner");

		expect(
			getLiveAssemblyAiSpeaker({
				assignments: {},
				activeSpeaker: "patient",
			})
		).toBe("patient");
	});

	it("assigns finalized speakers in practitioner-patient order", () => {
		const firstResolved = resolveAssemblyAiSpeaker({
			speakerLabel: "A",
			assignments: {},
			firstSpeakerRole: "practitioner",
		});

		const secondResolved = resolveAssemblyAiSpeaker({
			speakerLabel: "B",
			assignments: firstResolved.assignments,
			firstSpeakerRole: "practitioner",
		});

		expect(firstResolved.speaker).toBe("practitioner");
		expect(secondResolved.speaker).toBe("patient");
	});
});
