import { cache } from "react";

import { TRPCError } from "@trpc/server";

import { getPatientLabReports } from "./lab";
import { listMailConnections, listMailThreads, readInitialMailThreadListPage } from "./mail";
import { listNotes } from "./notes";
import { getPatientSessions } from "./patient-sessions";
import { getPatient } from "./patients";
import { listPatientTreatmentPlans } from "./treatment-plans";
import { listPatientWorkoutPlans } from "./workouts";

export type PatientActivityFeedItem =
	| {
			type: "email";
			id: string;
			createdAt: string;
			senderEmail: string;
			senderName: string | null;
			snippet: string | null;
			subject: string | null;
			threadId: string;
	  }
	| {
			type: "lab-report";
			createdAt: string;
			id: string;
			patientSessionTitle: string | null;
			reportDate: string | null;
			summary: string | null;
	  }
	| {
			type: "note";
			body: string;
			createdAt: string;
			id: string;
	  }
	| {
			type: "session";
			createdAt: string;
			hasTreatmentPlan: boolean;
			id: string;
			summary: string | null;
			title: string | null;
	  }
	| {
			type: "workout-plan";
			createdAt: string;
			id: string;
			summary: string | null;
			title: string;
	  };

const listPatientEmailActivity = async ({
	organizationId,
	patientEmail,
}: {
	organizationId: string;
	patientEmail: string;
}) => {
	const trimmedEmail = patientEmail.trim();

	if (!trimmedEmail) {
		return [] satisfies PatientActivityFeedItem[];
	}

	const connections = await listMailConnections({ organizationId });

	if (!connections.some((connection) => connection.status === "connected")) {
		return [] satisfies PatientActivityFeedItem[];
	}

	try {
		const page = await readInitialMailThreadListPage({
			stream: listMailThreads({
				folder: "all",
				maxResults: 100,
				organizationId,
				query: `from:${trimmedEmail} OR to:${trimmedEmail}`,
			}),
		});

		if (!page) {
			return [] satisfies PatientActivityFeedItem[];
		}

		return page.threads.map((thread) => ({
			type: "email" as const,
			id: thread.id,
			createdAt: thread.receivedOn,
			senderEmail: thread.sender.email,
			senderName: thread.sender.name ?? null,
			snippet: thread.snippet || null,
			subject: thread.subject || null,
			threadId: thread.id,
		}));
	} catch {
		return [] satisfies PatientActivityFeedItem[];
	}
};

export const getPatientActivityFeed = cache(
	async ({ organizationId, patientId }: { organizationId: string; patientId: string }) => {
		const patient = await getPatient({ id: patientId, organizationId });

		if (!patient) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Patient not found",
			});
		}

		const [sessions, notesResult, labReports, workoutPlans, emailActivity, treatmentPlans] = await Promise.all([
			getPatientSessions(patientId, organizationId),
			listNotes({
				organizationId,
				resourceType: "patient",
				resourceId: patientId,
				pageSize: 100,
			}),
			getPatientLabReports({ patientId }),
			listPatientWorkoutPlans({ patientId, organizationId }),
			listPatientEmailActivity({
				organizationId,
				patientEmail: patient.email,
			}),
			listPatientTreatmentPlans({
				organizationId,
				patientId,
			}),
		]);
		const treatmentPlanSessionIds = new Set(treatmentPlans.map((plan) => plan.patientSessionId));

		const sessionActivity = sessions.map((session) => ({
			type: "session" as const,
			createdAt: session.createdAt,
			hasTreatmentPlan: treatmentPlanSessionIds.has(session.id),
			id: session.id,
			summary: session.summary,
			title: session.title,
		}));

		const noteActivity = notesResult.data.map((note) => ({
			type: "note" as const,
			body: note.body,
			createdAt: note.createdAt,
			id: note.id,
		}));

		const labReportActivity = labReports.map((report) => ({
			type: "lab-report" as const,
			createdAt: report.createdAt,
			id: report.id,
			patientSessionTitle: report.patientSession?.title ?? null,
			reportDate: report.reportDate,
			summary: report.summary,
		}));

		const workoutPlanActivity = workoutPlans.map((plan) => ({
			type: "workout-plan" as const,
			createdAt: plan.createdAt,
			id: plan.id,
			summary: plan.summary,
			title: plan.title,
		}));

		return [
			...sessionActivity,
			...emailActivity,
			...noteActivity,
			...labReportActivity,
			...workoutPlanActivity,
		].toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
);
