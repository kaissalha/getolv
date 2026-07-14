import { describe, expect, it } from "vitest";

import {
	formatCopyCard,
	formatCopyList,
	formatDiagnosisEntryForCopy,
	formatNoteMarkupForCopy,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";

describe("patient card copy formatting", () => {
	it("formats cards with trimmed sections and stable spacing", () => {
		expect(
			formatCopyCard({
				title: "Patient summary",
				sections: ["  First line  \n\n\nSecond line  ", null, "   "],
			})
		).toBe("Patient summary\n\nFirst line\n\nSecond line");
	});

	it("formats diagnosis entries with indented clinical details", () => {
		expect(
			formatDiagnosisEntryForCopy({
				entry: {
					name: "Iron deficiency",
					reasoning: "Low ferritin with fatigue.",
					evidence: "Ferritin 8 ng/mL",
					missing: "Need menstrual history.",
					verifyNext: "Repeat CBC in 6 weeks.",
				},
				labels: {
					evidence: "Evidence",
					missing: "Missing",
					reasoning: "Reasoning",
					verifyNext: "Verify next",
				},
			})
		).toBe(
			[
				"- Iron deficiency",
				"  Reasoning: Low ferritin with fatigue.",
				"  Evidence: Ferritin 8 ng/mL",
				"  Missing: Need menstrual history.",
				"  Verify next: Repeat CBC in 6 weeks.",
			].join("\n")
		);
	});

	it("formats note mentions and multiline list items for copying", () => {
		expect(
			formatCopyList({
				items: [
					formatNoteMarkupForCopy({
						value: "Follow up with [[patient:patient-1:Jane Doe]]\nReview the next lab panel.",
					}),
				],
				emptyText: "No notes",
			})
		).toBe("- Follow up with Jane Doe\n  Review the next lab panel.");
	});
});
