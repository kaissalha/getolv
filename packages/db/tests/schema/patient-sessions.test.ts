import { describe, expect, it } from "vitest";

import {
	normalizeLiveNoteFromStorage,
	normalizePatientSessionCompletedTodoIds,
	normalizePatientSessionIntelligence,
} from "../../src/schema/patients/sessions/patient-sessions";

describe("patient session schema helpers", () => {
	it("normalizes legacy live-note content from strings and section arrays", () => {
		expect(normalizeLiveNoteFromStorage("  Follow up needed  ")).toBe("Follow up needed");
		expect(
			normalizeLiveNoteFromStorage([
				{ content: " Review supplements " },
				{ content: " improve sleep ", heading: "Plan" },
				{ heading: "Assessment" },
				null,
			])
		).toBe("Review supplements Plan: improve sleep Assessment");
	});

	it("returns an empty string for unsupported live-note shapes", () => {
		expect(normalizeLiveNoteFromStorage(null)).toBe("");
		expect(normalizeLiveNoteFromStorage({ note: "not supported" })).toBe("");
	});

	it("normalizes patient-session intelligence objects and rejects invalid inputs", () => {
		expect(normalizePatientSessionIntelligence(null)).toBeNull();
		expect(
			normalizePatientSessionIntelligence({
				differentialDx: [],
				liveNote: [{ content: "Needs iron" }, { content: "Recheck in 6 weeks", heading: "Plan" }],
				practitionerQaTurns: [],
				riskFlags: ["fatigue"],
				thingsToAsk: [],
				todos: [],
				visitReason: "Fatigue",
				workingDx: [],
			} as never)
		).toMatchObject({
			liveNote: "Needs iron Plan: Recheck in 6 weeks",
			riskFlags: ["fatigue"],
			visitReason: "Fatigue",
		});
	});

	it("keeps only completed todo ids that still exist in the current intelligence", () => {
		expect(
			normalizePatientSessionCompletedTodoIds({
				completedTodoIds: ["todo-1", " ", "todo-2", "todo-2", "todo-3"],
				todos: [
					{ id: "todo-1", text: "Review labs", category: null },
					{ id: "todo-3", text: "Book follow-up", category: "admin" },
				],
			})
		).toEqual(["todo-1", "todo-3"]);
	});
});
