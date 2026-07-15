import { isStepCount, ToolLoopAgent } from "ai";
import { z } from "zod";

import { models } from "@getolv/ai/models";
import { dashboardChatSystemPrompt } from "@getolv/ai/prompts";

import { dashboardChatTools } from "../tools";
import { appContextSchema } from "../types";

export const dashboardChatAgent = new ToolLoopAgent({
	model: models.fast.model,
	tools: dashboardChatTools,
	toolsContext: {
		composeEmail: {},
		getPatients: {},
		getPatient: {},
		createPatient: {},
		getPatientSessions: {},
		getPatientNotes: {},
		getPatientLabReports: {},
		getPatientWorkoutPlans: {},
		getPatientActivityFeed: {},
		getPatientMailThread: {},
		createPatientSession: {},
		searchMailThreads: {},
		listCalendarEvents: {},
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
			instructions: dashboardChatSystemPrompt({
				currentUser: aiContext.currentUser,
			}),
			runtimeContext: aiContext,
			toolsContext: {
				composeEmail: aiContext,
				getPatients: aiContext,
				getPatient: aiContext,
				createPatient: aiContext,
				getPatientSessions: aiContext,
				getPatientNotes: aiContext,
				getPatientLabReports: aiContext,
				getPatientWorkoutPlans: aiContext,
				getPatientActivityFeed: aiContext,
				getPatientMailThread: aiContext,
				createPatientSession: aiContext,
				searchMailThreads: aiContext,
				listCalendarEvents: aiContext,
				retrieveKnowledge: aiContext,
			},
		};
	},
	stopWhen: isStepCount(20),
});
