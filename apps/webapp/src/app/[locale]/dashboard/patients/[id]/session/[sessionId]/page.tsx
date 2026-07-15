import { headers } from "next/headers";

import { redirect } from "@/i18n/navigation";
import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";
import { getPatientSession } from "@getolv/server";
import { auth } from "@getolv/server/auth";
import { buildAssemblyAiMedicalKeytermsFromPatient } from "@getolv/utils";

import { SessionClient } from "./components/session-client";

export default async function SessionPage({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
	const [{ id, sessionId }, headersObj] = await Promise.all([params, headers()]);

	prefetch(trpcServer.patients.get.queryOptions({ id }));
	prefetch(trpcServer.scribe.getToken.queryOptions());
	prefetch(trpcServer.patientSessions.getActiveSession.queryOptions());
	prefetch(trpcServer.patientSessions.getPatientSessions.queryOptions({ patientId: id }));
	prefetch(trpcServer.notes.list.queryOptions({ resourceType: "patient", resourceId: id, pageSize: 100 }));

	const session = await auth.api.getSession({
		headers: headersObj,
	});

	if (!session) {
		throw new Error("No session found");
	}

	if (!session.session.activeOrganizationId) {
		throw new Error("No active practice found");
	}

	const organizationId = session.session.activeOrganizationId;

	const patientSession = await getPatientSession({
		organizationId,
		patientId: id,
		sessionId,
	});

	if (!patientSession || !patientSession.patient) {
		return redirect({ href: `/dashboard/patients/${id}`, locale: "en" });
	}

	const patient = patientSession.patient;
	const initialMedicalKeyterms = buildAssemblyAiMedicalKeytermsFromPatient({
		allergies: patient.allergies,
		currentMedications: patient.currentMedications,
		diagnosis: patient.diagnosis,
		familyMedicalHistory: patient.familyMedicalHistory,
		pastMedicalHistory: patient.pastMedicalHistory,
	});

	return (
		<HydrateClient>
			<SessionClient
				initialActiveSegmentStartedAt={patientSession.activeSegmentStartedAt}
				initialMedicalKeyterms={initialMedicalKeyterms}
				sessionId={sessionId}
				patientId={id}
				organizationId={organizationId}
				initialElapsedActiveSeconds={patientSession.elapsedActiveSeconds}
				patientName={`${patient.firstName} ${patient.lastName}`}
				initialCompletedTodoIds={patientSession.completedTodoIds ?? []}
				initialSessionStatus={patientSession.status}
				initialIntelligence={patientSession.intelligence ?? null}
				initialTranscriptTurns={patientSession.transcriptTurns.map((turn) => ({
					id: turn.id,
					text: turn.text,
					speaker: turn.speaker,
				}))}
			/>
		</HydrateClient>
	);
}
