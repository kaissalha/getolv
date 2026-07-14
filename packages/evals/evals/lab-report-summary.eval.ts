import { generateText } from "ai";
import { createScorer, evalite } from "evalite";

import { models } from "@starter/ai/models";
import { labReportSummaryPrompt } from "@starter/ai/prompts";

import { countSentences, hasMarkdownishFormatting, scoreKeywordGroups } from "./utils";

type LabSummaryInput = {
	context: string;
};

type LabSummaryExpected = {
	forbiddenPhrases: string[];
	keywordGroups: string[][];
};

const sentenceBudgetScorer = createScorer<LabSummaryInput, string, LabSummaryExpected>({
	name: "4-6 sentences",
	scorer: ({ output }) => {
		const sentenceCount = countSentences(output);

		if (sentenceCount >= 4 && sentenceCount <= 6) {
			return 1;
		}

		return sentenceCount === 3 || sentenceCount === 7 ? 0.5 : 0;
	},
});

const plainTextScorer = createScorer<LabSummaryInput, string, LabSummaryExpected>({
	name: "Plain patient-friendly prose",
	scorer: ({ output }) => (hasMarkdownishFormatting(output) ? 0 : 1),
});

const noDeflectionScorer = createScorer<LabSummaryInput, string, LabSummaryExpected>({
	name: "Does not tell the patient to see another doctor",
	scorer: ({ output, expected }) => {
		const normalizedOutput = output.toLowerCase();
		return expected.forbiddenPhrases.some((phrase) => normalizedOutput.includes(phrase.toLowerCase())) ? 0 : 1;
	},
});

const clinicalCoverageScorer = createScorer<LabSummaryInput, string, LabSummaryExpected>({
	name: "Covers the main findings",
	scorer: ({ output, expected }) => scoreKeywordGroups({ text: output, keywordGroups: expected.keywordGroups }),
});

evalite<LabSummaryInput, string, LabSummaryExpected>("Lab report summary prompt", {
	data: [
		{
			input: {
				context:
					"LDL is 168 mg/dL, triglycerides are 245 mg/dL, A1c is 6.0%, vitamin D is 18 ng/mL, and ferritin is low-normal. HDL, AST, and ALT are within range. The patient reports fatigue and afternoon crashes.",
			},
			expected: {
				forbiddenPhrases: ["see your doctor", "consult with your doctor", "talk to your doctor"],
				keywordGroups: [
					["ldl", "cholesterol"],
					["vitamin d"],
					["a1c", "blood sugar", "glucose"],
					["fatigue", "energy"],
				],
			},
		},
		{
			input: {
				context:
					"TSH is mildly elevated at 5.8 with free T4 at the low end of normal. B12 is 240, CRP is mildly elevated, and the CBC is otherwise normal. Symptoms include constipation, dry skin, and feeling cold.",
			},
			expected: {
				forbiddenPhrases: ["see your doctor", "consult with your doctor", "talk to your doctor"],
				keywordGroups: [["thyroid", "tsh"], ["b12"], ["constipation", "cold", "dry skin"]],
			},
		},
	],
	task: async ({ context }) => {
		const { text } = await generateText({
			model: models.fast.model,
			prompt: labReportSummaryPrompt({ context }),
		});

		return text.trim();
	},
	scorers: [sentenceBudgetScorer, plainTextScorer, noDeflectionScorer, clinicalCoverageScorer],
});
