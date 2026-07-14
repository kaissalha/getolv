export type ToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

export type LabResultStatus = "optimal" | "suboptimal" | "critical";

export type LabResult = {
	value: number;
	name: string;
	status: LabResultStatus;
	category: string;
	unit: string;
	ranges: Array<{
		min: number;
		max: number;
		status: LabResultStatus;
	}>;
};

export type AnalyzeLabResultsOutputData = {
	stage: "noData" | "processing" | "complete";
	labResults: LabResult[];
};

export type GenerateWorkoutPlanOutputData = {
	stage: "processing" | "complete";
	workoutPlanId: string | null;
	title: string | null;
	summary: string | null;
	daysCount: number;
};
