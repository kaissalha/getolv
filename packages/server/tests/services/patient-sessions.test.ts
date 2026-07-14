import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { db, patients } from "@starter/db";

import {
	createPatientSession,
	deletePatientSession,
	finalizePatientSession,
	getActivePatientSession,
	getPatientSession,
	getPatientSessions,
	resumePatientSession,
	updatePatientSessionCompletedTodoIds,
	updatePatientSessionIntelligence,
	updatePatientSessionSummary,
} from "../../src/services/patient-sessions";
import { getPatient } from "../../src/services/patients";
import { cleanupOrganization, createTestOrganization, createTestPatient } from "../helpers/db";

describe("patient sessions service", () => {
	const organizationIds: string[] = [];

	afterEach(async () => {
		for (const id of organizationIds) {
			await cleanupOrganization(id);
		}
		organizationIds.length = 0;
		vi.useRealTimers();
	});

	const createTrackedOrganization = async () => {
		const org = await createTestOrganization();
		organizationIds.push(org.id);
		return org;
	};

	it("creates and fetches patient sessions", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
			title: "Test Session",
		});

		expect(patientSession.id).toBeDefined();
		expect(patientSession.status).toBe("in_progress");

		const fetched = await getPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
			sessionId: patientSession.id,
		});

		expect(fetched?.id).toBe(patientSession.id);

		const sessions = await getPatientSessions(patient.id, organization.id);
		expect(sessions.length).toBeGreaterThan(0);
	});

	it("updates and deletes sessions", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		const updated = await updatePatientSessionSummary({
			sessionId: patientSession.id,
			organizationId: organization.id,
			summary: "Updated",
			title: "Updated Title",
		});

		expect(updated.summary).toBe("Updated");

		await deletePatientSession({
			organizationId: organization.id,
			patientId: patient.id,
			sessionId: patientSession.id,
		});

		const fetched = await getPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
			sessionId: patientSession.id,
		});

		expect(fetched).toBeUndefined();
	});

	it("prevents multiple active sessions across the organization unless the previous one is ended first", async () => {
		const organization = await createTrackedOrganization();
		const firstPatient = await createTestPatient({ organizationId: organization.id });
		const secondPatient = await createTestPatient({ organizationId: organization.id });

		const { patientSession: firstSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: firstPatient.id,
			title: "First Session",
		});

		await expect(
			createPatientSession({
				organizationId: organization.id,
				patientId: secondPatient.id,
				title: "Blocked Session",
			})
		).rejects.toMatchObject({
			code: "CONFLICT",
		});

		const { patientSession: secondSession } = await createPatientSession({
			endExisting: true,
			organizationId: organization.id,
			patientId: secondPatient.id,
			title: "Second Session",
		});

		const firstPatientSessions = await getPatientSessions(firstPatient.id, organization.id);
		const secondPatientSessions = await getPatientSessions(secondPatient.id, organization.id);
		const completedFirstSession = firstPatientSessions.find((session) => session.id === firstSession.id);
		const activeSecondSession = secondPatientSessions.find((session) => session.id === secondSession.id);
		const activeSession = await getActivePatientSession({ organizationId: organization.id });

		expect(activeSession?.id).toBe(secondSession.id);
		expect(activeSession?.patientId).toBe(secondPatient.id);
		expect(completedFirstSession?.status).toBe("completed");
		expect(completedFirstSession?.finalizedAt).toBeTruthy();
		expect(activeSecondSession?.status).toBe("in_progress");
	});

	it("resumes a completed session and applies the same single-active-session constraint", async () => {
		const organization = await createTrackedOrganization();
		const firstPatient = await createTestPatient({ organizationId: organization.id });
		const secondPatient = await createTestPatient({ organizationId: organization.id });

		const { patientSession: completedSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: firstPatient.id,
			title: "Completed Session",
		});

		await createPatientSession({
			endExisting: true,
			organizationId: organization.id,
			patientId: secondPatient.id,
			title: "Other Active Session",
		});

		await expect(
			resumePatientSession({
				organizationId: organization.id,
				sessionId: completedSession.id,
			})
		).rejects.toMatchObject({
			code: "CONFLICT",
		});

		const resumedSession = await resumePatientSession({
			endExisting: true,
			organizationId: organization.id,
			sessionId: completedSession.id,
		});

		const activeSession = await getActivePatientSession({ organizationId: organization.id });
		const firstPatientSessions = await getPatientSessions(firstPatient.id, organization.id);

		expect(resumedSession.status).toBe("in_progress");
		expect(resumedSession.finalizedAt).toBeNull();
		expect(activeSession?.id).toBe(completedSession.id);
		expect(firstPatientSessions.find((session) => session.id === completedSession.id)?.status).toBe("in_progress");
	});

	it("initializes timing fields for a new session", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T10:00:00.000Z"));

		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });
		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		expect(patientSession.elapsedActiveSeconds).toBe(0);
		expect(new Date(patientSession.activeSegmentStartedAt ?? "").toISOString()).toBe("2026-04-14T10:00:00.000Z");
	});

	it("accumulates active timing on finalize and starts a fresh segment on resume", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T10:00:00.000Z"));

		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });
		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		vi.setSystemTime(new Date("2026-04-14T10:03:15.000Z"));
		const finalizedSession = await finalizePatientSession({
			sessionId: patientSession.id,
			organizationId: organization.id,
			refreshPatientSummaryOnFinalize: false,
		});

		expect(finalizedSession.elapsedActiveSeconds).toBe(195);
		expect(finalizedSession.activeSegmentStartedAt).toBeNull();

		vi.setSystemTime(new Date("2026-04-14T10:05:00.000Z"));
		const resumedSession = await resumePatientSession({
			organizationId: organization.id,
			sessionId: patientSession.id,
		});

		expect(resumedSession.elapsedActiveSeconds).toBe(195);
		expect(new Date(resumedSession.activeSegmentStartedAt ?? "").toISOString()).toBe("2026-04-14T10:05:00.000Z");
	});

	it("keeps accumulating elapsed time across multiple finalize and resume cycles", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T09:00:00.000Z"));

		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });
		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		vi.setSystemTime(new Date("2026-04-14T09:04:00.000Z"));
		await finalizePatientSession({
			sessionId: patientSession.id,
			organizationId: organization.id,
			refreshPatientSummaryOnFinalize: false,
		});

		vi.setSystemTime(new Date("2026-04-14T09:10:00.000Z"));
		await resumePatientSession({
			organizationId: organization.id,
			sessionId: patientSession.id,
		});

		vi.setSystemTime(new Date("2026-04-14T09:12:30.000Z"));
		const finalizedAgain = await finalizePatientSession({
			sessionId: patientSession.id,
			organizationId: organization.id,
			refreshPatientSummaryOnFinalize: false,
		});

		expect(finalizedAgain.elapsedActiveSeconds).toBe(390);
		expect(finalizedAgain.activeSegmentStartedAt).toBeNull();
	});

	it("persists elapsed timing when ending an existing active session during create or resume", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T08:00:00.000Z"));

		const organization = await createTrackedOrganization();
		const firstPatient = await createTestPatient({ organizationId: organization.id });
		const secondPatient = await createTestPatient({ organizationId: organization.id });

		const { patientSession: firstSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: firstPatient.id,
			title: "First Session",
		});

		vi.setSystemTime(new Date("2026-04-14T08:02:00.000Z"));
		const { patientSession: secondSession } = await createPatientSession({
			endExisting: true,
			organizationId: organization.id,
			patientId: secondPatient.id,
			title: "Second Session",
		});

		const endedFirstSession = await getPatientSession({
			organizationId: organization.id,
			patientId: firstPatient.id,
			sessionId: firstSession.id,
		});

		expect(endedFirstSession?.elapsedActiveSeconds).toBe(120);
		expect(endedFirstSession?.activeSegmentStartedAt).toBeNull();

		vi.setSystemTime(new Date("2026-04-14T08:05:00.000Z"));
		const resumedFirstSession = await resumePatientSession({
			endExisting: true,
			organizationId: organization.id,
			sessionId: firstSession.id,
		});
		const activeSession = await getActivePatientSession({ organizationId: organization.id });
		const endedSecondSession = await getPatientSession({
			organizationId: organization.id,
			patientId: secondPatient.id,
			sessionId: secondSession.id,
		});

		expect(resumedFirstSession.elapsedActiveSeconds).toBe(120);
		expect(new Date(resumedFirstSession.activeSegmentStartedAt ?? "").toISOString()).toBe(
			"2026-04-14T08:05:00.000Z"
		);
		expect(activeSession?.id).toBe(firstSession.id);
		expect(endedSecondSession?.elapsedActiveSeconds).toBe(180);
		expect(endedSecondSession?.activeSegmentStartedAt).toBeNull();
	});

	it("seeds a new session from the patient's current diagnosis and todos", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		await db
			.update(patients)
			.set({
				diagnosis: {
					workingDx: [
						{
							name: "Iron deficiency",
							reasoning: "Low ferritin",
							evidence: null,
							missing: null,
							verifyNext: "Repeat labs",
						},
					],
					differentialDx: [
						{
							name: "Hypothyroidism",
							reasoning: null,
							evidence: "Fatigue",
							missing: "TSH",
							verifyNext: null,
						},
					],
				},
				todos: [
					{
						id: "repeat-ferritin",
						text: "Order repeat ferritin",
						category: "labs",
					},
				],
			})
			.where(eq(patients.id, patient.id));

		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		expect(patientSession.completedTodoIds).toEqual([]);
		expect(patientSession.intelligence?.workingDx).toEqual([
			{
				name: "Iron deficiency",
				reasoning: "Low ferritin",
				evidence: null,
				missing: null,
				verifyNext: "Repeat labs",
			},
		]);
		expect(patientSession.intelligence?.differentialDx).toEqual([
			{
				name: "Hypothyroidism",
				reasoning: null,
				evidence: "Fatigue",
				missing: "TSH",
				verifyNext: null,
			},
		]);
		expect(patientSession.intelligence?.todos).toEqual([
			{
				id: "repeat-ferritin",
				text: "Order repeat ferritin",
				category: "labs",
			},
		]);
	});

	it("preserves only completed todo ids that still exist after session intelligence refreshes", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });
		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		const firstUpdate = await updatePatientSessionIntelligence({
			sessionId: patientSession.id,
			organizationId: organization.id,
			completedTodoIds: ["todo-1", "todo-2"],
			intelligence: {
				visitReason: "Fatigue",
				riskFlags: [],
				liveNote: "",
				thingsToAsk: [],
				todos: [
					{ id: "todo-1", text: "Order repeat ferritin", category: "labs" },
					{ id: "todo-2", text: "Schedule follow-up", category: "admin" },
				],
				workingDx: [],
				differentialDx: [],
				practitionerQaTurns: [],
			},
		});

		const secondUpdate = await updatePatientSessionIntelligence({
			sessionId: patientSession.id,
			organizationId: organization.id,
			completedTodoIds: firstUpdate.completedTodoIds,
			intelligence: {
				visitReason: "Fatigue",
				riskFlags: [],
				liveNote: "",
				thingsToAsk: [],
				todos: [
					{ id: "todo-1", text: "Order repeat ferritin", category: "labs" },
					{ id: "todo-3", text: "Review CBC", category: "labs" },
				],
				workingDx: [],
				differentialDx: [],
				practitionerQaTurns: [],
			},
		});

		expect(firstUpdate.completedTodoIds).toEqual(["todo-1", "todo-2"]);
		expect(secondUpdate.completedTodoIds).toEqual(["todo-1"]);
	});

	it("copies the final diagnosis and only unchecked todos back to the patient on finalize", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });
		const { patientSession } = await createPatientSession({
			organizationId: organization.id,
			patientId: patient.id,
		});

		await updatePatientSessionIntelligence({
			sessionId: patientSession.id,
			organizationId: organization.id,
			intelligence: {
				visitReason: "Fatigue",
				riskFlags: [],
				liveNote: "",
				thingsToAsk: [],
				todos: [
					{ id: "todo-1", text: "Order repeat ferritin", category: "labs" },
					{ id: "todo-2", text: "Book follow-up", category: "admin" },
				],
				workingDx: [
					{
						name: "Iron deficiency",
						reasoning: "Low ferritin",
						evidence: "Microcytosis",
						missing: null,
						verifyNext: "Repeat ferritin",
					},
				],
				differentialDx: [
					{
						name: "Hypothyroidism",
						reasoning: null,
						evidence: "Fatigue",
						missing: "TSH",
						verifyNext: null,
					},
				],
				practitionerQaTurns: [],
			},
		});

		await updatePatientSessionCompletedTodoIds({
			sessionId: patientSession.id,
			organizationId: organization.id,
			completedTodoIds: ["todo-2"],
		});

		await finalizePatientSession({
			sessionId: patientSession.id,
			organizationId: organization.id,
			refreshPatientSummaryOnFinalize: false,
		});

		const updatedPatient = await getPatient({
			id: patient.id,
			organizationId: organization.id,
		});

		expect(updatedPatient?.diagnosis).toEqual({
			workingDx: [
				{
					name: "Iron deficiency",
					reasoning: "Low ferritin",
					evidence: "Microcytosis",
					missing: null,
					verifyNext: "Repeat ferritin",
				},
			],
			differentialDx: [
				{
					name: "Hypothyroidism",
					reasoning: null,
					evidence: "Fatigue",
					missing: "TSH",
					verifyNext: null,
				},
			],
		});
		expect(updatedPatient?.todos).toEqual([
			{
				id: "todo-1",
				text: "Order repeat ferritin",
				category: "labs",
			},
		]);
	});
});
