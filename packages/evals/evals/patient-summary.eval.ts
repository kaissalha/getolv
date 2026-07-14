import { generateText } from "ai";
import { createScorer, evalite } from "evalite";

import { models } from "@starter/ai/models";
import { buildPatientSummaryPrompt } from "@starter/ai/prompts";

import { countSentences, hasMarkdownishFormatting, scoreKeywordGroups } from "./utils";

type PatientSummaryInput = {
	currentSessionBlock: string;
	labReportsBlock: string;
	notesBlock: string;
	patientProfileBlock: string;
	priorSessionsBlock: string;
	workoutPlansBlock: string;
};

type PatientSummaryExpected = {
	keywordGroups: string[][];
};

const sentenceBudgetScorer = createScorer<PatientSummaryInput, string, PatientSummaryExpected>({
	name: "4-6 sentences",
	scorer: ({ output }) => {
		const sentenceCount = countSentences(output);

		if (sentenceCount >= 4 && sentenceCount <= 6) {
			return 1;
		}

		return sentenceCount === 3 || sentenceCount === 7 ? 0.5 : 0;
	},
});

const plainTextScorer = createScorer<PatientSummaryInput, string, PatientSummaryExpected>({
	name: "Plain text only",
	scorer: ({ output }) => (hasMarkdownishFormatting(output) ? 0 : 1),
});

const lengthBudgetScorer = createScorer<PatientSummaryInput, string, PatientSummaryExpected>({
	name: "Stays under 900 characters",
	scorer: ({ output }) => {
		if (output.length <= 900) {
			return 1;
		}

		return output.length <= 980 ? 0.5 : 0;
	},
});

const clinicalCoverageScorer = createScorer<PatientSummaryInput, string, PatientSummaryExpected>({
	name: "Captures durable clinical context",
	scorer: ({ output, expected }) => scoreKeywordGroups({ text: output, keywordGroups: expected.keywordGroups }),
});

evalite<PatientSummaryInput, string, PatientSummaryExpected>("Patient overview summary prompt", {
	data: [
		{
			input: {
				patientProfileBlock:
					"Name: Maya Lin\nDate of birth: 1988-06-14\nCurrent medications: Levothyroxine 75 mcg daily\nPersonal medical history: Hypothyroidism, iron deficiency\nAdditional context: Vegetarian diet and long work hours",
				currentSessionBlock:
					"Title: Follow-up for fatigue\nStarted: 2026-04-01\nSession summary: Ongoing fatigue, heavier periods over the last three months, and slower recovery from workouts.",
				priorSessionsBlock:
					"- Initial intake (2026-01-10): Reported chronic low energy and constipation.\n- Thyroid review (2026-02-20): Medication was helping but afternoon fatigue persisted.",
				notesBlock:
					"- 2026-03-22: Patient stopped iron because it caused stomach upset.\n- 2026-02-18: Sleep averages 6 hours on work nights.",
				labReportsBlock:
					"- 2026-03-28: Ferritin remains low, vitamin D is low, TSH is slightly elevated.\n- 2026-01-12: CBC normal.",
				workoutPlansBlock:
					"- Strength reset (2026-03-01) [6 weeks, 3 days/week]: Lower-volume plan because energy has been inconsistent.",
			},
			expected: {
				keywordGroups: [
					["fatigue", "energy"],
					["iron", "ferritin"],
					["thyroid", "tsh"],
					["sleep", "recovery"],
				],
			},
		},
		{
			input: {
				patientProfileBlock:
					"Name: Daniel Cruz\nDate of birth: 1979-11-02\nCurrent medications: Metformin 500 mg twice daily\nPersonal medical history: Prediabetes, hypertension\nAdditional context: Travels often for work and skips meals",
				currentSessionBlock:
					"Title: Blood pressure and weight review\nStarted: 2026-04-05\nSession summary: Blood pressure remains elevated, weight is up 8 pounds, and the patient is snacking late after long workdays.",
				priorSessionsBlock:
					"- Nutrition follow-up (2026-02-11): Better meal prep during the week.\n- Metabolic review (2025-12-08): A1c trending down with metformin and walking.",
				notesBlock:
					"- 2026-03-18: Home blood pressure readings still inconsistent.\n- 2026-03-02: Patient wants a plan that works while traveling.",
				labReportsBlock:
					"- 2026-03-30: A1c slightly up from prior check, triglycerides elevated, liver enzymes normal.",
				workoutPlansBlock:
					"- Travel walking plan (2026-02-15) [4 weeks, 5 days/week]: Daily walking target and hotel-room mobility routine.",
			},
			expected: {
				keywordGroups: [
					["blood pressure", "hypertension"],
					["weight"],
					["a1c", "blood sugar", "metabolic"],
					["travel", "meal", "snacking"],
				],
			},
		},
	],
	task: async (input) => {
		const { text } = await generateText({
			model: models.fast.model,
			prompt: buildPatientSummaryPrompt(input),
		});

		return text.trim();
	},
	scorers: [sentenceBudgetScorer, plainTextScorer, lengthBudgetScorer, clinicalCoverageScorer],
});
