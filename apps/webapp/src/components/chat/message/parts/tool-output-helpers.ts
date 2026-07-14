export const DATA_TOOL_NAMES = new Set([
	"getPatient",
	"getPatients",
	"getPatientSessions",
	"getPatientNotes",
	"getPatientLabReports",
	"getPatientWorkoutPlans",
	"getPatientActivityFeed",
	"getPatientMailThread",
	"searchMailThreads",
	"listCalendarEvents",
]);

export const formatToolName = (name: string) => {
	const withSpaces = name.replace(/([A-Z])/g, " $1").trim();
	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};
