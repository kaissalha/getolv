import { beforeEach, describe, expect, it, vi } from "vitest";

const {
	listPatients,
	getPatient,
	createPatient,
	getPatientSessions,
	createPatientSession,
	getPatientActivityFeed,
	getPatientLabReports,
	getPatientMailThread,
	getPatientWorkoutPlans,
	listAllCalendarEvents,
	listNotes,
	listMailThreads,
	readInitialMailThreadListPage,
	analyzeAndInsertLabResults,
	determineLabStatus,
	getLabCountry,
	getLabTestsCatalog,
} = vi.hoisted(() => ({
	listPatients: vi.fn(),
	getPatient: vi.fn(),
	createPatient: vi.fn(),
	getPatientSessions: vi.fn(),
	createPatientSession: vi.fn(),
	getPatientActivityFeed: vi.fn(),
	getPatientLabReports: vi.fn(),
	getPatientMailThread: vi.fn(),
	getPatientWorkoutPlans: vi.fn(),
	listAllCalendarEvents: vi.fn(),
	listNotes: vi.fn(),
	listMailThreads: vi.fn(),
	readInitialMailThreadListPage: vi.fn(),
	analyzeAndInsertLabResults: vi.fn(),
	determineLabStatus: vi.fn(),
	getLabCountry: vi.fn(),
	getLabTestsCatalog: vi.fn(),
}));

vi.mock("../../src/services/patients", () => ({
	listPatients,
	getPatient,
	createPatient,
}));

vi.mock("../../src/services/patient-sessions", () => ({
	getPatientSessions,
	createPatientSession,
}));

vi.mock("../../src/services/patient-activity-feed", () => ({
	getPatientActivityFeed,
}));

vi.mock("../../src/services/notes", () => ({
	listNotes,
}));

vi.mock("../../src/services/workouts", () => ({
	listPatientWorkoutPlans: getPatientWorkoutPlans,
}));

vi.mock("../../src/services/mail", () => ({
	getPatientMailThread,
	listMailThreads,
	readInitialMailThreadListPage,
}));

vi.mock("../../src/services/google-calendar", () => ({
	listAllCalendarEvents,
}));

vi.mock("../../src/services/lab", () => ({
	analyzeAndInsertLabResults,
	determineLabStatus,
	getPatientLabReports,
	getLabCountry,
	getLabTestsCatalog,
}));

vi.mock("../../src/ai/models", () => ({
	models: { fast: { model: "test-model" } },
}));

vi.mock("@ai-sdk/google", () => ({
	google: {
		tools: {
			googleSearch: vi.fn(() => ({})),
		},
	},
}));

vi.mock("ai", async (importOriginal) => {
	const actual = await importOriginal<typeof import("ai")>();
	return {
		...actual,
		generateText: vi.fn(),
	};
});

import type { ModelMessage, ToolExecuteFunction, ToolExecutionOptions } from "ai";
import { generateText } from "ai";

import { analyzeLabResults } from "../../src/ai/tools/analyze-lab-results";
import { composeEmailTool } from "../../src/ai/tools/compose-email";
import { createPatientTool } from "../../src/ai/tools/create-patient";
import { createPatientSessionTool } from "../../src/ai/tools/create-patient-session";
import { getPatientTool } from "../../src/ai/tools/get-patient";
import { getPatientActivityFeedTool } from "../../src/ai/tools/get-patient-activity-feed";
import { getPatientLabReportsTool } from "../../src/ai/tools/get-patient-lab-reports";
import { getPatientMailThreadTool } from "../../src/ai/tools/get-patient-mail-thread";
import { getPatientNotesTool } from "../../src/ai/tools/get-patient-notes";
import { getPatientSessionsTool } from "../../src/ai/tools/get-patient-sessions";
import { getPatientWorkoutPlansTool } from "../../src/ai/tools/get-patient-workout-plans";
import { getPatientsTool } from "../../src/ai/tools/get-patients";
import { listCalendarEventsTool } from "../../src/ai/tools/list-calendar-events";
import { searchMailThreadsTool } from "../../src/ai/tools/search-mail-threads";
import type { AppContext } from "../../src/ai/types";

const collect = async <T>(generator: AsyncIterable<T>) => {
	const outputs: T[] = [];
	for await (const output of generator) {
		outputs.push(output);
	}
	return outputs;
};

const runTool = async <TInput, TOutput, TContext extends AppContext>(
	execute: ToolExecuteFunction<TInput, TOutput, TContext> | undefined,
	input: TInput,
	context: TContext
) => {
	if (!execute) {
		throw new Error("Tool execute handler is missing");
	}

	const options: ToolExecutionOptions<TContext> = {
		context,
		toolCallId: "tool-call",
		messages: [] as ModelMessage[],
	};

	const result = execute(input, options);

	if (result && typeof (result as AsyncIterable<TOutput>)[Symbol.asyncIterator] === "function") {
		return collect(result as AsyncIterable<TOutput>);
	}

	return [await result];
};

describe("ai tools", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("getPatientsTool returns error without organization", async () => {
		const outputs = await runTool(getPatientsTool.execute, { search: "test", pageSize: 1 }, {});

		expect(outputs[1]).toEqual({ status: "error", error: "Organization context not found" });
	});

	it("getPatientsTool returns patients on success", async () => {
		listPatients.mockResolvedValue({
			data: [
				{
					id: "patient-1",
					firstName: "Sam",
					lastName: "Test",
					email: "sam@example.com",
					phoneNumber: null,
					createdAt: "now",
				},
			],
			meta: { cursor: null },
		});

		const outputs = await runTool(
			getPatientsTool.execute,
			{ search: "sam", pageSize: 1 },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				patients: expect.any(Array),
				hasMore: false,
			})
		);
	});

	it("getPatientTool returns error when patient missing", async () => {
		getPatient.mockResolvedValue(null);

		const outputs = await runTool(getPatientTool.execute, { patientId: "patient-1" }, { organizationId: "org-1" });

		expect(outputs.at(-1)).toEqual({ status: "error", error: "Patient not found" });
	});

	it("createPatientTool returns success", async () => {
		createPatient.mockResolvedValue({
			id: "patient-1",
			firstName: "Sam",
			lastName: "Test",
			email: "sam@example.com",
			phoneNumber: null,
			createdAt: "now",
		});

		const outputs = await runTool(
			createPatientTool.execute,
			{ firstName: "Sam", lastName: "Test", email: "sam@example.com" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				patient: expect.objectContaining({ id: "patient-1" }),
			})
		);
	});

	it("getPatientSessionsTool returns sessions", async () => {
		getPatientSessions.mockResolvedValue([
			{
				id: "session-1",
				title: "Session",
				summary: null,
				status: "completed",
				createdAt: "now",
				updatedAt: "now",
			},
		]);

		const outputs = await runTool(
			getPatientSessionsTool.execute,
			{ patientId: "patient-1" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 1,
			})
		);
	});

	it("getPatientNotesTool returns notes", async () => {
		listNotes.mockResolvedValue({
			data: [
				{
					body: "Patient is improving",
					createdAt: "now",
					id: "note-1",
					mentions: [],
					updatedAt: "now",
				},
			],
			meta: { cursor: null },
		});

		const outputs = await runTool(
			getPatientNotesTool.execute,
			{ patientId: "patient-1", pageSize: 10 },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 1,
				notes: expect.arrayContaining([expect.objectContaining({ id: "note-1" })]),
			})
		);
	});

	it("getPatientLabReportsTool returns lab reports", async () => {
		getPatientLabReports.mockResolvedValue([
			{
				createdAt: "now",
				id: "report-1",
				patientSession: { title: "Initial Session" },
				patientSessionId: "session-1",
				reportDate: "2026-04-10",
				summary: "Labs look stable.",
			},
		]);

		const outputs = await runTool(
			getPatientLabReportsTool.execute,
			{ patientId: "patient-1" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 1,
				reports: expect.arrayContaining([expect.objectContaining({ id: "report-1" })]),
			})
		);
	});

	it("getPatientWorkoutPlansTool returns workout plans", async () => {
		getPatientWorkoutPlans.mockResolvedValue([
			{
				createdAt: "now",
				days: [{ exercises: [{ id: "exercise-1" }, { id: "exercise-2" }] }],
				daysPerWeek: 3,
				durationWeeks: 6,
				id: "plan-1",
				summary: "Strength focus",
				title: "getolv Plan",
			},
		]);

		const outputs = await runTool(
			getPatientWorkoutPlansTool.execute,
			{ patientId: "patient-1" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 1,
				plans: expect.arrayContaining([
					expect.objectContaining({
						id: "plan-1",
						exercisesCount: 2,
					}),
				]),
			})
		);
	});

	it("getPatientActivityFeedTool returns recent activity", async () => {
		getPatientActivityFeed.mockResolvedValue([
			{
				createdAt: "now",
				id: "email-1",
				senderEmail: "patient@example.com",
				senderName: "Sam Test",
				snippet: "Checking in",
				subject: "Follow-up",
				threadId: "thread-1",
				type: "email",
			},
			{
				body: "Patient tolerated treatment well",
				createdAt: "later",
				id: "note-1",
				type: "note",
			},
		]);

		const outputs = await runTool(
			getPatientActivityFeedTool.execute,
			{ patientId: "patient-1", pageSize: 10 },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 2,
				activities: expect.arrayContaining([
					expect.objectContaining({ id: "email-1", type: "email" }),
					expect.objectContaining({ id: "note-1", type: "note" }),
				]),
			})
		);
	});

	it("getPatientMailThreadTool returns patient messages", async () => {
		getPatient.mockResolvedValue({
			additionalContext: null,
			allergies: null,
			createdAt: "now",
			currentMedications: null,
			dateOfBirth: null,
			email: "patient@example.com",
			familyMedicalHistory: null,
			firstName: "Sam",
			gender: null,
			id: "patient-1",
			lastName: "Test",
			pastMedicalHistory: null,
			phoneNumber: null,
			updatedAt: "now",
		});
		getPatientMailThread.mockResolvedValue({
			hasUnread: true,
			labels: [],
			latest: undefined,
			messages: [
				{
					body: "Following up after our visit.",
					id: "message-1",
					isDraft: false,
					isStarred: false,
					isUnread: true,
					labelIds: [],
					receivedOn: "2026-04-10T10:00:00.000Z",
					sender: { email: "patient@example.com", name: "Sam Test" },
					subject: "Follow-up",
					to: [],
					cc: null,
					bcc: null,
				},
			],
			totalReplies: 1,
		});

		const outputs = await runTool(
			getPatientMailThreadTool.execute,
			{ patientId: "patient-1", maxResults: 10 },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				hasUnread: true,
				totalReplies: 1,
				messages: expect.arrayContaining([expect.objectContaining({ id: "message-1" })]),
			})
		);
	});

	it("searchMailThreadsTool returns Gmail threads", async () => {
		const mailThreadListPage = {
			connectionEmail: "doctor@example.com",
			threads: [
				{
					id: "thread-1",
					isStarred: false,
					isUnread: true,
					labelIds: [],
					receivedOn: "2026-04-10T10:00:00.000Z",
					sender: { email: "patient@example.com", name: "Sam Test" },
					snippet: "Checking in",
					subject: "Follow-up",
				},
			],
		};
		listMailThreads.mockReturnValue("mail-stream");
		readInitialMailThreadListPage.mockResolvedValue(mailThreadListPage);

		const outputs = await runTool(
			searchMailThreadsTool.execute,
			{ folder: "inbox", maxResults: 10, query: "patient@example.com" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				connectionEmail: "doctor@example.com",
				totalCount: 1,
				threads: expect.arrayContaining([expect.objectContaining({ id: "thread-1" })]),
			})
		);
		expect(readInitialMailThreadListPage).toHaveBeenCalledWith({ stream: "mail-stream" });
	});

	it("listCalendarEventsTool returns upcoming events", async () => {
		listAllCalendarEvents.mockResolvedValue({
			calendars: [],
			connectionId: "connection-1",
			events: [
				{
					calendarId: "primary",
					calendarName: "Primary",
					created: "2026-04-10T10:00:00.000Z",
					end: { dateTime: "2026-04-11T11:00:00.000Z" },
					htmlLink: "https://calendar.google.com/event?eid=1",
					id: "event-1",
					location: "Clinic",
					start: { dateTime: "2026-04-11T10:00:00.000Z" },
					status: "confirmed",
					summary: "Patient follow-up",
				},
			],
		});

		const outputs = await runTool(
			listCalendarEventsTool.execute,
			{ daysAhead: 7, maxResults: 10 },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				totalCount: 1,
				events: expect.arrayContaining([expect.objectContaining({ id: "event-1" })]),
			})
		);
	});

	it("composeEmailTool uses the current user's name from context", async () => {
		const outputs = await runTool(
			composeEmailTool.execute,
			{
				content: "Best,\n[Your Name]",
				title: "Follow-up",
				to: "patient@example.com",
			},
			{
				currentUser: {
					email: "doctor@example.com",
					name: "Dr. Rivera",
				},
				organizationId: "org-1",
			}
		);

		expect(outputs.at(-1)).toEqual({
			address: "patient@example.com",
			content: "Best,\nDr. Rivera",
			title: "Follow-up",
		});
	});

	it("createPatientSessionTool returns success", async () => {
		createPatientSession.mockResolvedValue({
			patientSession: {
				id: "session-1",
				patientId: "patient-1",
				createdAt: "now",
			},
		});

		const outputs = await runTool(
			createPatientSessionTool.execute,
			{ patientId: "patient-1", title: "New Session" },
			{ organizationId: "org-1" }
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				status: "success",
				session: expect.objectContaining({ id: "session-1" }),
			})
		);
	});

	it("analyzeLabResults returns complete when no results", async () => {
		getLabCountry.mockResolvedValue("US");
		getLabTestsCatalog.mockResolvedValue([]);
		vi.mocked(generateText).mockResolvedValue({ output: [] } as never);

		const outputs = await runTool(
			analyzeLabResults.execute,
			{ data: "no results" },
			{
				chatId: "chat-1",
				patientId: "patient-1",
				organizationId: "org-1",
			}
		);

		expect(outputs.at(-1)).toEqual({ stage: "complete", labReportId: null, labResults: [] });
	});

	it("analyzeLabResults returns mapped results", async () => {
		getLabCountry.mockResolvedValue("US");
		getLabTestsCatalog.mockResolvedValue([{ code: "GLU", name: "Glucose", aliases: [] }]);
		vi.mocked(generateText).mockResolvedValue({
			output: [{ name: "Glucose", category: "Blood", value: 10, unit: "mg/dL" }],
		} as never);

		analyzeAndInsertLabResults.mockResolvedValue({
			report: { id: "report-1" },
			results: [
				{
					id: "result-1",
					value: 10,
					name: "Glucose",
					patientId: "patient-1",
					labTestId: "lab-1",
					labReportId: "report-1",
					category: "Blood",
					unit: "mg/dL",
					ranges: [{ min: 0, max: 20, status: "optimal" }],
				},
			],
		});
		determineLabStatus.mockReturnValue("optimal");

		const outputs = await runTool(
			analyzeLabResults.execute,
			{ data: "glucose 10 mg/dL" },
			{
				chatId: "chat-1",
				patientId: "patient-1",
				organizationId: "org-1",
				sessionId: "session-1",
			}
		);

		expect(outputs.at(-1)).toEqual(
			expect.objectContaining({
				stage: "complete",
				labReportId: "report-1",
				labResults: expect.any(Array),
			})
		);
	});
});
