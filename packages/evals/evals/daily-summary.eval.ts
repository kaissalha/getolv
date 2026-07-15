import { generateText } from "ai";
import { createScorer, evalite } from "evalite";

import { models } from "@getolv/ai/models";
import { buildDailySummarySummaryPrompt, type DailySummaryPromptInput } from "@getolv/ai/prompts";

import { countWords, hasMarkdownishFormatting, scoreKeywordGroups } from "./utils";

type DailySummaryExpected = {
	keywordGroups: string[][];
};

const wordBudgetScorer = createScorer<DailySummaryPromptInput, string, DailySummaryExpected>({
	name: "40-70 words",
	scorer: ({ output }) => {
		const wordCount = countWords(output);

		if (wordCount >= 40 && wordCount <= 70) {
			return 1;
		}

		return wordCount >= 35 && wordCount <= 78 ? 0.5 : 0;
	},
});

const plainTextScorer = createScorer<DailySummaryPromptInput, string, DailySummaryExpected>({
	name: "Plain text only",
	scorer: ({ output }) => (hasMarkdownishFormatting(output) ? 0 : 1),
});

const sourceCoverageScorer = createScorer<DailySummaryPromptInput, string, DailySummaryExpected>({
	name: "Covers source signals",
	scorer: ({ output, expected }) => scoreKeywordGroups({ text: output, keywordGroups: expected.keywordGroups }),
});

evalite<DailySummaryPromptInput, string, DailySummaryExpected>("Daily practice summary prompt", {
	data: [
		{
			input: {
				calendarBlock:
					"- 2026-04-26T14:00:00.000Z: Follow-up with Maya Lin (Primary calendar, 1 attendees)\n- 2026-04-26T19:00:00.000Z: New patient intake (Primary calendar, 1 attendees)",
				mailBlock:
					"- Sun, 26 Apr 2026 09:12:00 -0400: Lab results ready from lab@example.com (unread, to respond) - Ferritin and vitamin D results are ready for Maya Lin.",
				notesBlock:
					"- 2026-04-26T10:05:00.000Z: Maya reported lower energy and asked about iron tolerance before the afternoon follow-up.",
				periodLabel: "Apr 26, 2026",
				periodType: "day",
				sourceCounts: {
					calendar: 2,
					mail: 1,
					notes: 1,
				},
			},
			expected: {
				keywordGroups: [
					["Maya", "follow-up"],
					["lab", "ferritin", "vitamin"],
					["note", "energy"],
				],
			},
		},
		{
			input: {
				calendarBlock:
					"- 2026-04-22T13:00:00.000Z: Nutrition consult with Daniel Cruz (Primary calendar, 1 attendees)",
				mailBlock:
					"- Tue, 21 Apr 2026 16:10:00 -0400: Schedule change from daniel@example.com (read, meeting update) - Daniel asked to move the nutrition consult later this week.",
				notesBlock: "No notes found.",
				periodLabel: "Apr 20, 2026 - Apr 26, 2026",
				periodType: "week",
				sourceCounts: {
					calendar: 1,
					mail: 1,
					notes: 0,
				},
			},
			expected: {
				keywordGroups: [
					["today", "week"],
					["Daniel", "nutrition"],
					["schedule", "move", "meeting"],
				],
			},
		},
	],
	task: async (input) => {
		const { text } = await generateText({
			model: models.fast.model,
			prompt: buildDailySummarySummaryPrompt(input),
		});

		return text.trim();
	},
	scorers: [wordBudgetScorer, plainTextScorer, sourceCoverageScorer],
});
