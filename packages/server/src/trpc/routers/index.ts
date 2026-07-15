import type { getolvRouterFactoryOptions } from "../shared";
import { createChatRouter } from "./chat";
import { createDailySummaryRouter } from "./daily-summary";
import { createGoogleCalendarRouter } from "./google-calendar";
import { createLabsRouter } from "./labs";
import { createMailRouter } from "./mail";
import { createNotesRouter } from "./notes";
import { createPatientSessionsRouter } from "./patient-sessions";
import { createPatientsRouter } from "./patients";
import { createScribeRouter } from "./scribe";
import { createSessionIntelligenceRouter } from "./session-intelligence";
import { createTemplatesRouter } from "./templates";
import { createTreatmentPlansRouter } from "./treatment-plans";
import { createWorkoutsRouter } from "./workouts";

export const createAppRouter = (routerOptions: getolvRouterFactoryOptions) =>
	routerOptions.createTRPCRouter({
		chat: createChatRouter(routerOptions),
		dailySummary: createDailySummaryRouter(routerOptions),
		googleCalendar: createGoogleCalendarRouter(routerOptions),
		patients: createPatientsRouter(routerOptions),
		labs: createLabsRouter(routerOptions),
		mail: createMailRouter(routerOptions),
		notes: createNotesRouter(routerOptions),
		patientSessions: createPatientSessionsRouter(routerOptions),
		scribe: createScribeRouter(routerOptions),
		sessionIntelligence: createSessionIntelligenceRouter(routerOptions),
		treatmentPlans: createTreatmentPlansRouter(routerOptions),
		templates: createTemplatesRouter(routerOptions),
		workouts: createWorkoutsRouter(routerOptions),
	});
