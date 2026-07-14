import { Output, generateText } from "ai";
import { createScorer, evalite } from "evalite";

import { models } from "@starter/ai/models";
import {
	buildSessionIntelligencePrompt,
	sessionIntelligenceWithMetaSchema,
	type SessionIntelligencePayload,
} from "@starter/ai/prompts";

import { scoreKeywordGroups } from "./utils";

type SessionIntelligenceInput = {
	clinicianContextBlock: string;
	existingIntelligenceBlock: string;
	labSummary: string;
	notesSummary: string;
	patientProfileBlock: string;
	practitionerFollowUpBlock: string;
	priorSessionsSummary: string;
	sessionRecordBlock: string;
	transcriptText: string;
};

type SessionIntelligenceOutput = SessionIntelligencePayload & {
	sessionTitle: string | null;
	sessionSummary: string | null;
};

type SessionIntelligenceExpected = {
	differentialKeywordGroups: string[][];
	minQaTurns: number;
	questionKeywordGroups: string[][];
};

const arrayBudgetScorer = createScorer<
	SessionIntelligenceInput,
	SessionIntelligenceOutput,
	SessionIntelligenceExpected
>({
	name: "Respects output budgets",
	scorer: ({ output }) =>
		output.riskFlags.length <= 5 &&
		output.todos.length <= 6 &&
		output.workingDx.length <= 3 &&
		output.differentialDx.length <= 5 &&
		output.thingsToAsk.length <= 5
			? 1
			: 0,
});

const liveNoteScorer = createScorer<SessionIntelligenceInput, SessionIntelligenceOutput, SessionIntelligenceExpected>({
	name: "Live note is concise clinical prose",
	scorer: ({ output }) => {
		const liveNote = output.liveNote.trim();

		if (!liveNote || liveNote.length > 450) {
			return 0;
		}

		return /(^|\n)\s*[-*#]/u.test(liveNote) ? 0 : 1;
	},
});

const sessionMetadataScorer = createScorer<
	SessionIntelligenceInput,
	SessionIntelligenceOutput,
	SessionIntelligenceExpected
>({
	name: "Session metadata is present",
	scorer: ({ output }) =>
		output.sessionTitle &&
		output.sessionTitle.length <= 72 &&
		output.sessionSummary &&
		output.sessionSummary.length <= 240
			? 1
			: 0,
});

const reasoningCoverageScorer = createScorer<
	SessionIntelligenceInput,
	SessionIntelligenceOutput,
	SessionIntelligenceExpected
>({
	name: "Working impression covers likely drivers",
	scorer: ({ output, expected }) => {
		const clinicalText = [
			output.liveNote,
			...output.workingDx.map((item) => item.name),
			...output.differentialDx.map((item) => item.name),
		].join(" ");

		return scoreKeywordGroups({ text: clinicalText, keywordGroups: expected.differentialKeywordGroups });
	},
});

const followUpCoverageScorer = createScorer<
	SessionIntelligenceInput,
	SessionIntelligenceOutput,
	SessionIntelligenceExpected
>({
	name: "Follow-up questions are specific",
	scorer: ({ output, expected }) => {
		if (output.thingsToAsk.length === 0) {
			return 0;
		}

		return scoreKeywordGroups({
			text: output.thingsToAsk.map((item) => item.question).join(" "),
			keywordGroups: expected.questionKeywordGroups,
		});
	},
});

const qaCarryoverScorer = createScorer<
	SessionIntelligenceInput,
	SessionIntelligenceOutput,
	SessionIntelligenceExpected
>({
	name: "Preserves clinician Q&A",
	scorer: ({ output, expected }) => (output.practitionerQaTurns.length >= expected.minQaTurns ? 1 : 0),
});

evalite<SessionIntelligenceInput, SessionIntelligenceOutput, SessionIntelligenceExpected>(
	"Session intelligence prompt",
	{
		data: [
			{
				input: {
					clinicianContextBlock: "Name: Dr. Rowan Park\nEmail: rowan@example.com",
					patientProfileBlock:
						"Name: Maya Lin\nAllergies: Penicillin\nCurrent medications: Levothyroxine 75 mcg daily\nPersonal medical history: Hypothyroidism, iron deficiency\nAdditional patient context (clinician reference — not shared with patient): Vegetarian diet and heavy work stress.",
					sessionRecordBlock:
						"Title: Follow-up fatigue visit\nSummary (if any): Ongoing low energy and heavier menstrual bleeding.\nSession started: 2026-04-01",
					existingIntelligenceBlock:
						"visitReason: Fatigue and heavy periods\nriskFlags:\n- Orthostatic symptoms\nthingsToAsk:\n- [id=iron-tolerance] (meds) How has she tolerated iron since the last visit?",
					transcriptText:
						"[patient]: I am wiped out by 2 pm every day.\n[patient]: My periods have been heavier for a few months and I feel colder than usual.\n[patient]: Constipation is back and I stopped the iron because it made my stomach hurt.",
					priorSessionsSummary:
						"- Initial intake (2026-01-10): Chronic fatigue and constipation were the main concerns.\n- Thyroid review (2026-02-20): Energy improved slightly after levothyroxine titration.",
					notesSummary:
						"- Sleep averages 6 hours on work nights.\n- Ferritin has been hard to replete because oral iron causes GI upset.",
					labSummary: "Ferritin low, vitamin D low, and TSH slightly elevated on the most recent panel.",
					practitionerFollowUpBlock:
						"Q: Has she taken iron consistently since the last visit?\nA: No, she stopped two months ago because of nausea.",
				},
				expected: {
					differentialKeywordGroups: [
						["iron", "ferritin", "anemia"],
						["thyroid", "hypothyroid"],
						["sleep", "stress"],
					],
					minQaTurns: 1,
					questionKeywordGroups: [["bleeding", "period"], ["sleep"], ["bowel", "constipation", "iron"]],
				},
			},
		],
		task: async (input) => {
			const { output } = await generateText({
				model: models.fast.model,
				output: Output.object({
					schema: sessionIntelligenceWithMetaSchema,
				}),
				prompt: buildSessionIntelligencePrompt(input),
			});

			return output;
		},
		scorers: [
			arrayBudgetScorer,
			liveNoteScorer,
			sessionMetadataScorer,
			reasoningCoverageScorer,
			followUpCoverageScorer,
			qaCarryoverScorer,
		],
	}
);
