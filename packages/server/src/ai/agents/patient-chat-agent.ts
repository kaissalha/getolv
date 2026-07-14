import { isStepCount, ToolLoopAgent } from "ai";
import { z } from "zod";

import { models } from "@starter/ai/models";
import { naturopathicDoctorSystemPrompt } from "@starter/ai/prompts";

import { chatTools } from "../tools";
import { appContextSchema } from "../types";

export const patientChatAgent = new ToolLoopAgent({
	model: models.fast.model,
	tools: chatTools,
	toolsContext: {
		analyzeLabResults: {},
		generateWorkoutPlan: {},
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
			instructions: naturopathicDoctorSystemPrompt,
			runtimeContext: aiContext,
			toolsContext: {
				analyzeLabResults: aiContext,
				generateWorkoutPlan: aiContext,
			},
		};
	},
	stopWhen: isStepCount(20),
});
