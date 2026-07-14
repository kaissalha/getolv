import { analyzeLabResults } from "./analyze-lab-results";
import { composeEmailTool } from "./compose-email";
import { createPatientTool } from "./create-patient";
import { createPatientSessionTool } from "./create-patient-session";
import { generateWorkoutPlan } from "./generate-workout-plan";
import { getPatientTool } from "./get-patient";
import { getPatientActivityFeedTool } from "./get-patient-activity-feed";
import { getPatientLabReportsTool } from "./get-patient-lab-reports";
import { getPatientMailThreadTool } from "./get-patient-mail-thread";
import { getPatientNotesTool } from "./get-patient-notes";
import { getPatientSessionsTool } from "./get-patient-sessions";
import { getPatientWorkoutPlansTool } from "./get-patient-workout-plans";
import { getPatientsTool } from "./get-patients";
import { listCalendarEventsTool } from "./list-calendar-events";
import { retrieveKnowledgeTool } from "./retrieve-knowledge";
import { searchMailThreadsTool } from "./search-mail-threads";

export { analyzeLabResults, analyzeLabResultsCore } from "./analyze-lab-results";
export { composeEmailTool } from "./compose-email";
export { createPatientTool } from "./create-patient";
export { createPatientSessionTool } from "./create-patient-session";
export { generateWorkoutPlan, generateWorkoutPlanCore } from "./generate-workout-plan";
export { getPatientActivityFeedTool } from "./get-patient-activity-feed";
export { getPatientTool } from "./get-patient";
export { getPatientLabReportsTool } from "./get-patient-lab-reports";
export { getPatientMailThreadTool } from "./get-patient-mail-thread";
export { getPatientNotesTool } from "./get-patient-notes";
export { getPatientSessionsTool } from "./get-patient-sessions";
export { getPatientWorkoutPlansTool } from "./get-patient-workout-plans";
export { getPatientsTool } from "./get-patients";
export { listCalendarEventsTool } from "./list-calendar-events";
export { retrieveKnowledgeTool } from "./retrieve-knowledge";
export { searchMailThreadsTool } from "./search-mail-threads";

/**
 * Tools for patient session chats (used in patient consultations)
 */
export const chatTools = {
	analyzeLabResults,
	generateWorkoutPlan,
};

/**
 * Tools for dashboard chat (general assistant with access to patient and session workflows)
 */
export const dashboardChatTools = {
	composeEmail: composeEmailTool,
	getPatients: getPatientsTool,
	getPatient: getPatientTool,
	createPatient: createPatientTool,
	getPatientSessions: getPatientSessionsTool,
	getPatientNotes: getPatientNotesTool,
	getPatientLabReports: getPatientLabReportsTool,
	getPatientWorkoutPlans: getPatientWorkoutPlansTool,
	getPatientActivityFeed: getPatientActivityFeedTool,
	getPatientMailThread: getPatientMailThreadTool,
	createPatientSession: createPatientSessionTool,
	searchMailThreads: searchMailThreadsTool,
	listCalendarEvents: listCalendarEventsTool,
	retrieveKnowledge: retrieveKnowledgeTool,
};
