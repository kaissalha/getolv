import { BlobNotFoundError } from "@vercel/blob";
import { FatalError } from "workflow";

import { deleteBlob, downloadBlob } from "@/lib/server/storage";
import { deleteStorageRecordByUrl } from "@/services/storage";
import type { PatientSessionIntelligence } from "@getolv/db";
import { logger } from "@getolv/logger/server";
import {
	clearPatientSessionAudio,
	generateSessionIntelligence,
	refreshPatientSummary,
	syncSessionTreatmentPlan,
	syncPatientClinicalStateFromSessionIntelligence,
	transcribeWithMedicalMode,
} from "@getolv/server";

type SessionTranscriptPostProcessingInput = {
	audioUrl: string;
	organizationId: string;
	practitionerEmail: string;
	practitionerName: string;
	sessionId: string;
};

const transcribeSessionAudio = async (input: SessionTranscriptPostProcessingInput) => {
	"use step";

	if (!input.audioUrl) {
		throw new FatalError("Session audio URL is required.");
	}

	const { body } = await downloadBlob({
		url: input.audioUrl,
		access: "private",
	});
	const transcription = await transcribeWithMedicalMode({
		audio: body,
		sessionId: input.sessionId,
		organizationId: input.organizationId,
	});

	return {
		audioUrl: input.audioUrl,
		patientId: transcription.session.patientId,
	};
};

const refreshPostVisitIntelligence = async ({
	organizationId,
	patientId,
	practitionerEmail,
	practitionerName,
	sessionId,
}: {
	organizationId: string;
	patientId: string;
	practitionerEmail: string;
	practitionerName: string;
	sessionId: string;
}) => {
	"use step";

	const intelligence = await generateSessionIntelligence({
		sessionId,
		patientId,
		organizationId,
		practitionerEmail,
		practitionerName,
	});
	const nextIntelligence: PatientSessionIntelligence = {
		differentialDx: intelligence.differentialDx.map((diagnosis) => ({
			evidence: diagnosis.evidence ?? null,
			missing: diagnosis.missing ?? null,
			name: diagnosis.name,
			reasoning: diagnosis.reasoning ?? null,
			verifyNext: diagnosis.verifyNext ?? null,
		})),
		liveNote: intelligence.liveNote,
		practitionerQaTurns: intelligence.practitionerQaTurns.map((turn) => ({
			answer: turn.answer,
			question: turn.question,
		})),
		riskFlags: intelligence.riskFlags,
		thingsToAsk: intelligence.thingsToAsk.map((question) => ({
			category: question.category ?? null,
			id: question.id,
			question: question.question,
		})),
		todos: intelligence.todos.map((todo) => ({
			category: todo.category ?? null,
			id: todo.id,
			text: todo.text,
		})),
		visitReason: intelligence.visitReason,
		workingDx: intelligence.workingDx.map((diagnosis) => ({
			evidence: diagnosis.evidence ?? null,
			missing: diagnosis.missing ?? null,
			name: diagnosis.name,
			reasoning: diagnosis.reasoning ?? null,
			verifyNext: diagnosis.verifyNext ?? null,
		})),
	};

	await syncPatientClinicalStateFromSessionIntelligence({
		completedTodoIds: intelligence.completedTodoIds,
		intelligence: nextIntelligence,
		organizationId,
		patientId,
	});

	await refreshPatientSummary({
		organizationId,
		patientId,
		sessionId,
	});

	try {
		await syncSessionTreatmentPlan({
			organizationId,
			practitionerEmail,
			practitionerName,
			sessionId,
		});
	} catch (error) {
		logger.error({
			error,
			message: "Failed to sync session treatment plan after transcript post-processing",
			metadata: {
				organizationId,
				patientId,
				sessionId,
			},
		});
	}

	return {
		intelligenceRefreshed: true,
	};
};

const deleteSessionAudio = async (input: SessionTranscriptPostProcessingInput) => {
	"use step";

	try {
		await deleteBlob({
			url: input.audioUrl,
			access: "private",
		});
	} catch (error) {
		if (!(error instanceof BlobNotFoundError)) {
			throw error;
		}
	}

	await Promise.all([
		deleteStorageRecordByUrl({
			organizationId: input.organizationId,
			url: input.audioUrl,
		}),
		clearPatientSessionAudio({
			sessionId: input.sessionId,
			organizationId: input.organizationId,
		}),
	]);

	return {
		audioDeleted: true,
	};
};

export const postProcessSessionTranscript = async (input: SessionTranscriptPostProcessingInput) => {
	"use workflow";

	const { audioUrl, patientId } = await transcribeSessionAudio(input);

	await refreshPostVisitIntelligence({
		organizationId: input.organizationId,
		patientId,
		practitionerEmail: input.practitionerEmail,
		practitionerName: input.practitionerName,
		sessionId: input.sessionId,
	});

	await deleteSessionAudio({
		...input,
		audioUrl,
	});

	return {
		sessionId: input.sessionId,
		audioDeleted: true,
	};
};
