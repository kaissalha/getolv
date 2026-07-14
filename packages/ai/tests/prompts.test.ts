import { describe, expect, it } from "vitest";

import {
	analyzeLabResultsPrompt,
	buildMailClassificationPrompt,
	buildMailSearchRewritePrompt,
	dashboardChatSystemPrompt,
	dashboardChatTitlePrompt,
	editWorkoutPlanPrompt,
	generateWorkoutPlanPrompt,
	generatedWorkoutPlanSchema,
	mailSearchRewriteSchema,
	mailThreadClassificationSchema,
	patientSummaryOutputSchema,
	ragAnswerSystemPrompt,
	removeImageBackgroundPrompt,
} from "../src/prompts";

describe("prompts", () => {
	it("keeps the image background removal prompt in the AI package", () => {
		expect(removeImageBackgroundPrompt).toContain("remove the background");
	});

	it("keeps patient summary output parsing in the AI package", () => {
		expect(patientSummaryOutputSchema.parse({ summary: "Stable clinical context." })).toEqual({
			summary: "Stable clinical context.",
		});
	});

	it("adds a trimmed current user section when user details are provided", () => {
		const prompt = dashboardChatSystemPrompt({
			currentUser: {
				email: "  clinician@example.com ",
				name: "  Dr. Rivera ",
			},
		});

		expect(prompt).toContain("## Current User");
		expect(prompt).toContain("- Name: Dr. Rivera");
		expect(prompt).toContain("- Email: clinician@example.com");
		expect(prompt).toContain("Never use placeholders like [Your Name].");
	});

	it("omits the current user section when there is no usable user information", () => {
		const prompt = dashboardChatSystemPrompt({
			currentUser: {
				email: "   ",
				name: "   ",
			},
		});

		expect(prompt).not.toContain("## Current User");
	});

	it("builds the dashboard chat title prompt around the user message", () => {
		const prompt = dashboardChatTitlePrompt({
			message: "Summarize Ada's last two sessions",
		});

		expect(prompt).toContain("Summarize Ada's last two sessions");
		expect(prompt).toContain("- 2 to 6 words");
	});

	it("keeps RAG instructions in the AI package", () => {
		const prompt = dashboardChatSystemPrompt();

		expect(prompt).toContain("retrieveKnowledge");
		expect(prompt).toContain("indexed organization documents");
		expect(ragAnswerSystemPrompt).toContain("Use retrieveKnowledge");
		expect(ragAnswerSystemPrompt).toContain("cite sources");
	});

	it("builds the mail search rewrite prompt and schema in the AI package", () => {
		const prompt = buildMailSearchRewritePrompt({
			localDate: "2026-04-23",
			search: "flight not marketing",
		});

		expect(prompt).toContain("Current local date: 2026-04-23");
		expect(prompt).toContain("flight -label:marketing");
		expect(prompt).toContain("flight not marketing");
		expect(mailSearchRewriteSchema.parse({ query: "flight -label:marketing" })).toEqual({
			query: "flight -label:marketing",
		});
	});

	it("builds and validates the mail classification prompt in the AI package", () => {
		const labels: ["to respond", "marketing"] = ["to respond", "marketing"];
		const schema = mailThreadClassificationSchema({
			labels,
			threadIds: ["thread-1"],
		});
		const prompt = buildMailClassificationPrompt({
			connectionEmail: "owner@example.com",
			labelDefinitions: [
				{
					description: "Needs a human reply.",
					label: "to respond",
				},
				{
					description: "Promotional or newsletter-like.",
					label: "marketing",
				},
			],
			threads: [
				{
					id: "thread-1",
					sender: {
						email: "sender@example.com",
						name: "Sender",
					},
					snippet: "Can you reply today?",
					subject: "Follow-up",
				},
			],
		});

		expect(prompt).toContain("You classify Gmail threads for owner@example.com.");
		expect(prompt).toContain("threadId: thread-1");
		expect(prompt).toContain("- marketing: Promotional or newsletter-like.");
		expect(
			schema.parse({
				classifications: [
					{
						label: "to respond",
						threadId: "thread-1",
					},
				],
			})
		).toEqual({
			classifications: [
				{
					label: "to respond",
					threadId: "thread-1",
				},
			],
		});
		expect(() =>
			schema.parse({
				classifications: [
					{
						label: "marketing",
						threadId: "unexpected-thread",
					},
				],
			})
		).toThrow(/Unexpected threadId/);
	});

	it("includes country and catalog data in the lab-analysis prompt", () => {
		const prompt = analyzeLabResultsPrompt({
			data: "Ferritin 15 ug/L",
			catalog: [{ aliases: ["Ferr"], code: "FER", name: "Ferritin" }],
			country: "CA",
		});

		expect(prompt).toContain("## Country (for reference ranges)");
		expect(prompt).toContain("CA");
		expect(prompt).toContain('"code": "FER"');
		expect(prompt).toContain("Ferritin 15 ug/L");
	});

	it("includes the optional goal only when provided for workout generation", () => {
		const withGoal = generateWorkoutPlanPrompt({
			patientContext: "Runner with low-back pain",
			goal: "Return to 10k training",
			exerciseCatalog: [
				{
					bodyParts: ["legs"],
					equipments: ["band"],
					name: "Split squat",
					targetMuscles: ["glutes"],
				},
			],
		});
		const withoutGoal = generateWorkoutPlanPrompt({
			patientContext: "Runner with low-back pain",
			exerciseCatalog: [],
		});

		expect(withGoal).toContain("## Goal");
		expect(withGoal).toContain("Return to 10k training");
		expect(withGoal).toContain("Split squat");
		expect(withoutGoal).not.toContain("## Goal");
	});

	it("includes the current plan and instructions when editing a workout plan", () => {
		const prompt = editWorkoutPlanPrompt({
			currentPlanJson: '{"title":"Week 1"}',
			exerciseCatalog: [],
			instructions: "Reduce volume and add mobility work",
			patientContext: "Knee pain after long walks",
		});

		expect(prompt).toContain("## Current Plan (JSON)");
		expect(prompt).toContain('{"title":"Week 1"}');
		expect(prompt).toContain("Reduce volume and add mobility work");
		expect(prompt).toContain("Knee pain after long walks");
	});

	it("accepts nullable workout plan fields in the generated schema", () => {
		const parsed = generatedWorkoutPlanSchema.parse({
			days: [
				{
					coolDown: null,
					dayNumber: 1,
					exercises: [
						{
							exerciseName: "Bridge",
							notes: null,
							reps: "8-10",
							restSeconds: null,
							sets: null,
						},
					],
					focus: null,
					name: "Recovery",
					warmUp: null,
				},
			],
			daysPerWeek: null,
			durationWeeks: null,
			summary: null,
			title: "Gentle Start",
		});

		expect(parsed.days[0]?.exercises[0]?.exerciseName).toBe("Bridge");
		expect(parsed.daysPerWeek).toBeNull();
	});
});
