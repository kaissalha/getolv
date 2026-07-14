"use client";

import { AnalyzeLabResultsToolOutput } from "./analyze-lab-results-tool-output";
import { EmailDraftToolOutput } from "./email-draft-tool-output";
import { GenerateWorkoutPlanToolOutput } from "./generate-workout-plan-tool-output";
import { DATA_TOOL_NAMES } from "./tool-output-helpers";
import type { AnalyzeLabResultsOutputData, GenerateWorkoutPlanOutputData } from "./tool-part-types";
import { DataToolBadge, GenericToolOutput } from "./tool-status-output";

export const ToolOutput = ({ toolName, output }: { toolName: string; output: unknown }) => {
	if (toolName === "analyzeLabResults") {
		return <AnalyzeLabResultsToolOutput output={output as AnalyzeLabResultsOutputData} />;
	}

	if (toolName === "composeEmail") {
		return <EmailDraftToolOutput output={output as { address: string; content: string; title: string }} />;
	}

	if (toolName === "generateWorkoutPlan") {
		return <GenerateWorkoutPlanToolOutput output={output as GenerateWorkoutPlanOutputData} />;
	}

	if (DATA_TOOL_NAMES.has(toolName)) {
		return <DataToolBadge toolName={toolName} />;
	}

	return <GenericToolOutput toolName={toolName} />;
};
