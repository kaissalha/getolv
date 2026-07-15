import { isStepCount, ToolLoopAgent } from "ai";
import { z } from "zod";

import { models } from "@getolv/ai/models";
import { ragAnswerSystemPrompt } from "@getolv/ai/prompts";

import { retrieveKnowledgeTool } from "../tools";
import { appContextSchema } from "../types";

export const ragAgent = new ToolLoopAgent({
	model: models.fast.model,
	tools: {
		retrieveKnowledge: retrieveKnowledgeTool,
	},
	toolsContext: {
		retrieveKnowledge: {},
	},
	callOptionsSchema: z
		.object({
			aiContext: appContextSchema.optional(),
		})
		.strict(),
	prepareCall: async ({ options, ...settings }) => {
		const aiContext = options.aiContext ?? {};

		return {
			...settings,
			instructions: ragAnswerSystemPrompt,
			runtimeContext: aiContext,
			toolsContext: {
				retrieveKnowledge: aiContext,
			},
		};
	},
	stopWhen: isStepCount(20),
});
