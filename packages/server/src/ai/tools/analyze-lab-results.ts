import { google } from "@ai-sdk/google";
import { generateText, Output, stepCountIs, type Tool, tool } from "ai";
import { z } from "zod";

import { models } from "@starter/ai/models";
import { analyzeLabResultsPrompt } from "@starter/ai/prompts";
import { logger } from "@starter/logger/server";

import { analyzeAndInsertLabResults, determineLabStatus, getLabCountry, getLabTestsCatalog } from "../../services/lab";
import { appContextSchema } from "../types";

const labResultStatusValues = ["optimal", "suboptimal", "critical"] as const;

const labResultSchema = z.object({
	name: z.string(),
	category: z.string(),
	value: z.number(),
	unit: z.string(),
});

export type AnalyzedLabResult = z.infer<typeof labResultSchema>;

/**
 * Core function to analyze lab results text using AI.
 * Uses the lab tests catalog to match results and apply proper ranges.
 */
export const analyzeLabResultsCore = async ({ data, country }: { data: string; country: string }) => {
	// Get the catalog for the country
	const catalog = await getLabTestsCatalog({ country: country as "US" | "CA" });

	// Prepare catalog for AI prompt (simplified structure)
	const catalogForPrompt = catalog.map((test) => ({
		code: test.code,
		name: test.name,
		aliases: test.aliases,
	}));

	const result = await generateText({
		model: models.fast.model,
		output: Output.array({
			element: labResultSchema,
		}),
		prompt: analyzeLabResultsPrompt({ data, country, catalog: catalogForPrompt }),
		tools: {
			google_search: google.tools.googleSearch({}) as Tool,
		},
		stopWhen: stepCountIs(10),
	});

	return result.output;
};

export const analyzeLabResults = tool({
	description: "Analyze lab results from text and store them in the database",
	contextSchema: appContextSchema,
	inputSchema: z.object({
		data: z.string().describe("The raw lab results data to analyze"),
	}),
	outputSchema: z.object({
		stage: z.enum(["noData", "processing", "complete"]).default("noData"),
		labReportId: z.string().nullable(),
		labResults: z.array(
			z.object({
				id: z.string(),
				value: z.number(),
				name: z.string(),
				status: z.enum(labResultStatusValues),
				patientId: z.string(),
				labTestId: z.string(),
				labReportId: z.string(),
				patientSessionId: z.string().nullable(),
				category: z.string(),
				unit: z.string(),
				ranges: z.array(
					z.object({
						min: z.number(),
						max: z.number(),
						status: z.enum(labResultStatusValues),
					})
				),
			})
		),
	}),
	async *execute({ data }, { context }) {
		const { chatId, patientId, sessionId, organizationId } = context;

		if (!chatId || !patientId || !organizationId) {
			throw new Error("Chat ID, patient ID, or organization ID not found");
		}

		try {
			yield {
				stage: "processing",
				labReportId: null,
				labResults: [],
			};

			// Get country for reference ranges
			const country = await getLabCountry();

			// Analyze the lab results using AI
			const analyzedResults = await analyzeLabResultsCore({ data, country });

			if (analyzedResults.length === 0) {
				yield {
					stage: "complete",
					labReportId: null,
					labResults: [],
				};
				return;
			}

			// Process and insert the lab results
			const { report, results } = await analyzeAndInsertLabResults({
				patientId,
				organizationId,
				patientSessionId: sessionId,
				analyzedResults,
			});

			const mappedResults = results.map((result) => ({
				id: result.id,
				value: result.value,
				name: result.name,
				status: determineLabStatus({ value: result.value, ranges: result.ranges }),
				patientId: result.patientId,
				labTestId: result.labTestId,
				labReportId: result.labReportId,
				patientSessionId: sessionId ?? null,
				category: result.category,
				unit: result.unit,
				ranges: result.ranges,
			}));

			yield {
				stage: "complete",
				labReportId: report.id,
				labResults: mappedResults,
			};
		} catch (error) {
			logger.error({
				error,
				message: "Error generating lab results",
				metadata: {
					chatId,
					patientId,
					sessionId,
					organizationId,
				},
			});
			throw error;
		}
	},
});
