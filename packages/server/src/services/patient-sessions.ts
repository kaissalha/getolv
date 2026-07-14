import { cache } from "react";

import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import {
	db,
	normalizePatientClinicalState,
	normalizePatientSessionCompletedTodoIds,
	normalizePatientSessionIntelligence,
	patientSessions,
	patients,
	sessionTranscriptTurns,
} from "@starter/db";
import type {
	PatientSessionIntelligence,
	PatientSessionTranscriptMetadata,
	SessionTranscriptTurnMetadata,
} from "@starter/db";
import { logger } from "@starter/logger/server";

import { refreshPatientSummary } from "./patient-summary";
import { syncSessionTreatmentPlan } from "./session-treatment-plan";

type CreatePatientSessionInput = {
	endExisting?: boolean;
	organizationId: string;
	patientId: string;
	title?: string;
};

type FindPatientSessionInput = {
	organizationId: string;
	patientId: string;
	sessionId: string;
};

type ResumePatientSessionInput = {
	endExisting?: boolean;
	organizationId: string;
	sessionId: string;
};

type PatientSessionTimingFields = {
	activeDurationSeconds: number;
	activeSegmentStartedAt: string | null;
	createdAt: string;
	finalizedAt: string | null;
	status: "completed" | "in_progress";
};

const ACTIVE_SESSION_CONSTRAINT_NAMES = new Set([
	"patient_session_single_active_idx",
	"patient_session_single_org_active_idx",
]);

const withNormalizedPatientSessionState = <
	TPatientSession extends {
		activeDurationSeconds: number;
		activeSegmentStartedAt: string | null;
		completedTodoIds: string[] | null;
		createdAt: string;
		finalizedAt: string | null;
		intelligence: PatientSessionIntelligence | null;
		status: "completed" | "in_progress";
	},
>(
	patientSession: TPatientSession
) => {
	const { activeDurationSeconds: _activeDurationSeconds, ...patientSessionWithoutInternalDuration } = patientSession;
	const intelligence = normalizePatientSessionIntelligence(patientSession.intelligence);

	return {
		...patientSessionWithoutInternalDuration,
		activeSegmentStartedAt:
			patientSession.status === "in_progress"
				? (patientSession.activeSegmentStartedAt ??
					(patientSession.activeDurationSeconds > 0 ? null : patientSession.createdAt))
				: patientSession.activeSegmentStartedAt,
		completedTodoIds: normalizePatientSessionCompletedTodoIds({
			completedTodoIds: patientSession.completedTodoIds,
			todos: intelligence?.todos ?? [],
		}),
		elapsedActiveSeconds:
			patientSession.activeDurationSeconds > 0
				? patientSession.activeDurationSeconds
				: patientSession.finalizedAt
					? getDateDiffInSeconds({
							endAt: patientSession.finalizedAt,
							startAt: patientSession.createdAt,
						})
					: 0,
		intelligence,
	};
};

const getDateDiffInSeconds = ({ endAt, startAt }: { endAt: string; startAt: string }) => {
	const diffMs = new Date(endAt).getTime() - new Date(startAt).getTime();

	if (!Number.isFinite(diffMs) || diffMs <= 0) {
		return 0;
	}

	return Math.floor(diffMs / 1000);
};

const getCompletedSessionTimingUpdate = ({
	nowIso,
	session,
}: {
	nowIso: string;
	session: PatientSessionTimingFields;
}) => {
	const activeSegmentStartedAt =
		session.status === "in_progress"
			? (session.activeSegmentStartedAt ?? (session.activeDurationSeconds > 0 ? null : session.createdAt))
			: null;
	const currentSegmentSeconds = activeSegmentStartedAt
		? getDateDiffInSeconds({
				endAt: nowIso,
				startAt: activeSegmentStartedAt,
			})
		: 0;
	const activeDurationSeconds =
		session.activeDurationSeconds > 0
			? session.activeDurationSeconds + currentSegmentSeconds
			: session.finalizedAt
				? getDateDiffInSeconds({
						endAt: session.finalizedAt,
						startAt: session.createdAt,
					})
				: currentSegmentSeconds;

	return {
		activeDurationSeconds,
		activeSegmentStartedAt: null,
		finalizedAt: nowIso,
		status: "completed" as const,
	};
};

const getResumedSessionTimingUpdate = ({
	nowIso,
	session,
}: {
	nowIso: string;
	session: PatientSessionTimingFields;
}) => ({
	activeDurationSeconds:
		session.activeDurationSeconds > 0
			? session.activeDurationSeconds
			: session.finalizedAt
				? getDateDiffInSeconds({
						endAt: session.finalizedAt,
						startAt: session.createdAt,
					})
				: 0,
	activeSegmentStartedAt: nowIso,
	finalizedAt: null,
	status: "in_progress" as const,
});

export const getActivePatientSession = cache(async ({ organizationId }: { organizationId: string }) => {
	const activeSession = await db.query.patientSessions.findFirst({
		where: {
			organizationId,
			status: "in_progress",
		},
		orderBy: {
			createdAt: "desc",
		},
		with: {
			patient: true,
		},
	});

	return activeSession
		? {
				...withNormalizedPatientSessionState(activeSession),
				patient: activeSession.patient
					? {
							...activeSession.patient,
							...normalizePatientClinicalState({
								diagnosis: activeSession.patient.diagnosis,
								todos: activeSession.patient.todos,
							}),
						}
					: activeSession.patient,
			}
		: null;
});

export const createPatientSession = async ({
	endExisting = false,
	organizationId,
	patientId,
	title = "New Session",
}: CreatePatientSessionInput) => {
	try {
		const { endedSessions, patientSession } = await db
			.transaction(async (tx) => {
				const patient = await tx.query.patients.findFirst({
					where: {
						id: patientId,
						organizationId,
					},
					columns: {
						diagnosis: true,
						todos: true,
					},
				});

				if (!patient) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Patient not found",
					});
				}

				const activeSessions = await tx.query.patientSessions.findMany({
					where: {
						organizationId,
						status: "in_progress",
					},
					columns: {
						activeDurationSeconds: true,
						activeSegmentStartedAt: true,
						createdAt: true,
						finalizedAt: true,
						id: true,
						patientId: true,
						status: true,
					},
				});

				if (activeSessions.length > 0 && !endExisting) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "There is already an active session.",
					});
				}

				if (activeSessions.length > 0) {
					const nowIso = new Date().toISOString();

					await Promise.all(
						activeSessions.map((activeSession) =>
							tx
								.update(patientSessions)
								.set(getCompletedSessionTimingUpdate({ nowIso, session: activeSession }))
								.where(
									and(
										eq(patientSessions.id, activeSession.id),
										eq(patientSessions.organizationId, organizationId)
									)
								)
						)
					);
				}

				const initialClinicalState = normalizePatientClinicalState({
					diagnosis: patient.diagnosis,
					todos: patient.todos,
				});

				const [createdSession] = await tx
					.insert(patientSessions)
					.values({
						activeDurationSeconds: 0,
						activeSegmentStartedAt: new Date().toISOString(),
						completedTodoIds: [],
						intelligence: {
							visitReason: null,
							riskFlags: [],
							liveNote: "",
							thingsToAsk: [],
							todos: initialClinicalState.todos,
							workingDx: initialClinicalState.diagnosis.workingDx,
							differentialDx: initialClinicalState.diagnosis.differentialDx,
							practitionerQaTurns: [],
						},
						organizationId,
						patientId,
						title,
					})
					.returning();

				return {
					endedSessions: activeSessions,
					patientSession: createdSession,
				};
			})
			.catch((error) => {
				if (ACTIVE_SESSION_CONSTRAINT_NAMES.has(error.constraint)) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "There is already an active session.",
					});
				}

				throw error;
			});

		await Promise.all(
			endedSessions.map((session) =>
				refreshPatientSummary({
					organizationId,
					patientId: session.patientId,
					sessionId: session.id,
				})
			)
		);

		return { patientSession: withNormalizedPatientSessionState(patientSession) };
	} catch (error) {
		if (error instanceof TRPCError) {
			throw error;
		}

		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create patient session",
		});
	}
};

export const resumePatientSession = async ({
	endExisting = false,
	organizationId,
	sessionId,
}: ResumePatientSessionInput) => {
	try {
		const { endedSessions, resumedSession } = await db
			.transaction(async (tx) => {
				const session = await tx.query.patientSessions.findFirst({
					where: {
						id: sessionId,
						organizationId,
					},
				});

				if (!session) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Patient session not found",
					});
				}

				if (session.status === "in_progress") {
					return {
						endedSessions: [],
						resumedSession: session,
					};
				}

				const activeSessions = await tx.query.patientSessions.findMany({
					where: {
						organizationId,
						status: "in_progress",
					},
					columns: {
						activeDurationSeconds: true,
						activeSegmentStartedAt: true,
						createdAt: true,
						finalizedAt: true,
						id: true,
						patientId: true,
						status: true,
					},
				});

				const otherActiveSessions = activeSessions.filter((activeSession) => activeSession.id !== sessionId);

				if (otherActiveSessions.length > 0 && !endExisting) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "There is already an active session.",
					});
				}

				if (otherActiveSessions.length > 0) {
					const nowIso = new Date().toISOString();

					await Promise.all(
						otherActiveSessions.map((activeSession) =>
							tx
								.update(patientSessions)
								.set(getCompletedSessionTimingUpdate({ nowIso, session: activeSession }))
								.where(
									and(
										eq(patientSessions.id, activeSession.id),
										eq(patientSessions.organizationId, organizationId)
									)
								)
						)
					);
				}

				const nowIso = new Date().toISOString();
				const [updatedSession] = await tx
					.update(patientSessions)
					.set(getResumedSessionTimingUpdate({ nowIso, session }))
					.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
					.returning();

				if (!updatedSession) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Patient session not found",
					});
				}

				return {
					endedSessions: otherActiveSessions,
					resumedSession: updatedSession,
				};
			})
			.catch((error) => {
				if (ACTIVE_SESSION_CONSTRAINT_NAMES.has(error.constraint)) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "There is already an active session.",
					});
				}

				throw error;
			});

		await Promise.all(
			endedSessions.map((session) =>
				refreshPatientSummary({
					organizationId,
					patientId: session.patientId,
					sessionId: session.id,
				})
			)
		);

		return withNormalizedPatientSessionState(resumedSession);
	} catch (error) {
		if (error instanceof TRPCError) {
			throw error;
		}

		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to resume patient session",
		});
	}
};

export const getPatientSession = cache(async ({ organizationId, patientId, sessionId }: FindPatientSessionInput) => {
	const row = await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
			patientId,
		},
		with: {
			patient: true,
			transcriptTurns: {
				orderBy: { turnOrder: "asc" },
			},
		},
	});

	if (!row) {
		return row;
	}

	return {
		...withNormalizedPatientSessionState(row),
		patient: row.patient
			? {
					...row.patient,
					...normalizePatientClinicalState({
						diagnosis: row.patient.diagnosis,
						todos: row.patient.todos,
					}),
				}
			: row.patient,
	};
});

export const getPatientSessions = cache(async (patientId: string, organizationId: string) => {
	const sessions = await db.query.patientSessions.findMany({
		where: { patientId, organizationId },
		orderBy: { createdAt: "desc" },
	});

	return sessions.map((session) => withNormalizedPatientSessionState(session));
});

export const getPatientSessionMedicalContext = async ({
	sessionId,
	organizationId,
}: {
	sessionId: string;
	organizationId: string;
}) =>
	await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
		},
		columns: {
			id: true,
			patientId: true,
		},
		with: {
			patient: {
				columns: {
					allergies: true,
					currentMedications: true,
					diagnosis: true,
					familyMedicalHistory: true,
					pastMedicalHistory: true,
				},
			},
		},
	});

export const appendTranscriptTurn = async ({
	metadata,
	sessionId,
	organizationId,
	speaker,
	text,
}: {
	metadata?: SessionTranscriptTurnMetadata | null;
	sessionId: string;
	organizationId: string;
	speaker: "practitioner" | "patient" | "unknown";
	text: string;
}) => {
	if (!text.trim()) {
		return null;
	}

	const nextOrder = await db
		.select({ max: sql<number>`coalesce(max(${sessionTranscriptTurns.turnOrder}), -1) + 1` })
		.from(sessionTranscriptTurns)
		.where(eq(sessionTranscriptTurns.sessionId, sessionId));

	const [turn] = await db
		.insert(sessionTranscriptTurns)
		.values({
			metadata: metadata ?? null,
			sessionId,
			organizationId,
			speaker,
			text,
			turnOrder: nextOrder[0]?.max ?? 0,
		})
		.returning();

	return turn;
};

export const replaceTranscriptTurns = async ({
	sessionId,
	organizationId,
	turns,
}: {
	sessionId: string;
	organizationId: string;
	turns: Array<{
		metadata?: SessionTranscriptTurnMetadata | null;
		speaker: "practitioner" | "patient" | "unknown";
		text: string;
	}>;
}) => {
	const sanitizedTurns = turns
		.map((turn) => ({
			metadata: turn.metadata ?? null,
			speaker: turn.speaker,
			text: turn.text.trim(),
		}))
		.filter((turn) => turn.text.length > 0);

	return db.transaction(async (tx) => {
		await tx
			.delete(sessionTranscriptTurns)
			.where(
				and(
					eq(sessionTranscriptTurns.sessionId, sessionId),
					eq(sessionTranscriptTurns.organizationId, organizationId)
				)
			);

		if (sanitizedTurns.length === 0) {
			return [];
		}

		return await tx
			.insert(sessionTranscriptTurns)
			.values(
				sanitizedTurns.map((turn, turnOrder) => ({
					metadata: turn.metadata,
					sessionId,
					organizationId,
					speaker: turn.speaker,
					text: turn.text,
					turnOrder,
				}))
			)
			.returning();
	});
};

export const getSessionTranscriptTurns = cache(async (sessionId: string, organizationId: string) => {
	return await db.query.sessionTranscriptTurns.findMany({
		where: { sessionId, organizationId },
		orderBy: { turnOrder: "asc" },
	});
});

export const getPatientSessionIntelligenceBaseline = async ({
	organizationId,
	patientId,
	sessionId,
}: FindPatientSessionInput) => {
	return await db.query.patientSessions.findFirst({
		where: { id: sessionId, organizationId, patientId },
		columns: {
			completedTodoIds: true,
			title: true,
			summary: true,
			intelligence: true,
			createdAt: true,
		},
	});
};

export const updatePatientSessionAudio = async ({
	sessionId,
	organizationId,
	audioUrl,
}: {
	sessionId: string;
	organizationId: string;
	audioUrl: string;
}) => {
	const [updated] = await db
		.update(patientSessions)
		.set({ audioUrl })
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	return withNormalizedPatientSessionState(updated);
};

export const getPatientSessionAudioUrl = async ({
	sessionId,
	organizationId,
}: {
	sessionId: string;
	organizationId: string;
}) => {
	const session = await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
		},
		columns: {
			audioUrl: true,
		},
	});

	if (!session) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	return session.audioUrl;
};

export const clearPatientSessionAudio = async ({
	sessionId,
	organizationId,
}: {
	sessionId: string;
	organizationId: string;
}) => {
	const [updated] = await db
		.update(patientSessions)
		.set({ audioUrl: null })
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	return updated ?? null;
};

export const updatePatientSessionIntelligence = async ({
	sessionId,
	organizationId,
	completedTodoIds,
	intelligence,
}: {
	sessionId: string;
	organizationId: string;
	completedTodoIds?: string[];
	intelligence: PatientSessionIntelligence;
}) => {
	const normalizedIntelligence = normalizePatientSessionIntelligence(intelligence) ?? intelligence;
	const nextCompletedTodoIds = normalizePatientSessionCompletedTodoIds({
		completedTodoIds,
		todos: normalizedIntelligence.todos,
	});
	const [updated] = await db
		.update(patientSessions)
		.set({
			completedTodoIds: nextCompletedTodoIds,
			intelligence: normalizedIntelligence,
		})
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	return withNormalizedPatientSessionState(updated);
};

export const updatePatientSessionCompletedTodoIds = async ({
	sessionId,
	organizationId,
	completedTodoIds,
}: {
	sessionId: string;
	organizationId: string;
	completedTodoIds: string[];
}) => {
	const session = await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
		},
		columns: {
			completedTodoIds: true,
			intelligence: true,
		},
	});

	if (!session) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	const intelligence = normalizePatientSessionIntelligence(session.intelligence);
	const nextCompletedTodoIds = normalizePatientSessionCompletedTodoIds({
		completedTodoIds,
		todos: intelligence?.todos ?? [],
	});

	const [updated] = await db
		.update(patientSessions)
		.set({ completedTodoIds: nextCompletedTodoIds })
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	return withNormalizedPatientSessionState(updated);
};

export const syncPatientClinicalStateFromSessionIntelligence = async ({
	completedTodoIds,
	intelligence,
	organizationId,
	patientId,
}: {
	completedTodoIds: string[];
	intelligence: PatientSessionIntelligence | null | undefined;
	organizationId: string;
	patientId: string;
}) => {
	const normalizedIntelligence = normalizePatientSessionIntelligence(intelligence);
	const nextPatientClinicalState = normalizePatientClinicalState({
		diagnosis: {
			differentialDx: normalizedIntelligence?.differentialDx ?? [],
			workingDx: normalizedIntelligence?.workingDx ?? [],
		},
		todos: normalizedIntelligence?.todos.filter((todo) => !completedTodoIds.includes(todo.id)) ?? [],
	});

	await db
		.update(patients)
		.set({
			diagnosis: nextPatientClinicalState.diagnosis,
			todos: nextPatientClinicalState.todos,
		})
		.where(and(eq(patients.id, patientId), eq(patients.organizationId, organizationId)));
};

export const updatePatientSessionMetadata = async ({
	sessionId,
	organizationId,
	title,
	summary,
}: {
	sessionId: string;
	organizationId: string;
	title?: string;
	summary?: string;
}) => {
	const updates: { title?: string; summary?: string } = {};
	if (title) {
		updates.title = title;
	}
	if (summary) {
		updates.summary = summary;
	}
	if (!updates.title && !updates.summary) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "No session metadata provided" });
	}

	const [updated] = await db
		.update(patientSessions)
		.set(updates)
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	await refreshPatientSummary({
		organizationId,
		patientId: updated.patientId,
		sessionId: updated.id,
	});

	return withNormalizedPatientSessionState(updated);
};

export const updatePatientSessionFinalTranscript = async ({
	sessionId,
	organizationId,
	finalTranscript,
	transcriptMetadata,
}: {
	sessionId: string;
	organizationId: string;
	finalTranscript: string;
	transcriptMetadata?: PatientSessionTranscriptMetadata | null;
}) => {
	const [updated] = await db
		.update(patientSessions)
		.set({
			finalTranscript,
			...(transcriptMetadata ? { transcriptMetadata } : {}),
		})
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	await refreshPatientSummary({
		organizationId,
		patientId: updated.patientId,
		sessionId: updated.id,
	});

	return updated;
};

export const updatePatientSessionTitle = async ({
	sessionId,
	organizationId,
	title,
}: {
	sessionId: string;
	organizationId: string;
	title: string;
}) =>
	updatePatientSessionMetadata({
		sessionId,
		organizationId,
		title,
	});

export const finalizePatientSession = async ({
	sessionId,
	organizationId,
	finalTranscript = "",
	practitionerEmail,
	practitionerName,
	refreshPatientSummaryOnFinalize = true,
	summary,
	title,
}: {
	sessionId: string;
	organizationId: string;
	finalTranscript?: string;
	practitionerEmail?: string | null;
	practitionerName?: string | null;
	refreshPatientSummaryOnFinalize?: boolean;
	summary?: string;
	title?: string;
}) => {
	const session = await db.query.patientSessions.findFirst({
		where: {
			id: sessionId,
			organizationId,
		},
		columns: {
			activeDurationSeconds: true,
			activeSegmentStartedAt: true,
			createdAt: true,
			finalizedAt: true,
			status: true,
		},
	});

	if (!session) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	const nowIso = new Date().toISOString();
	const updates: Record<string, unknown> = {
		finalTranscript: finalTranscript ?? "",
		...getCompletedSessionTimingUpdate({ nowIso, session }),
	};

	if (summary) {
		updates.summary = summary;
	}
	if (title) {
		updates.title = title;
	}

	const [updated] = await db
		.update(patientSessions)
		.set(updates)
		.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
		.returning();

	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Patient session not found" });
	}

	const normalizedSession = withNormalizedPatientSessionState(updated);
	await syncPatientClinicalStateFromSessionIntelligence({
		completedTodoIds: normalizedSession.completedTodoIds,
		intelligence: normalizedSession.intelligence,
		organizationId,
		patientId: normalizedSession.patientId,
	});

	if (refreshPatientSummaryOnFinalize) {
		await refreshPatientSummary({
			organizationId,
			patientId: normalizedSession.patientId,
			sessionId: normalizedSession.id,
		});
	}

	try {
		await syncSessionTreatmentPlan({
			organizationId,
			practitionerEmail,
			practitionerName,
			sessionId: normalizedSession.id,
		});
	} catch (error) {
		logger.error({
			message: "Failed to sync session treatment plan after session finalization",
			metadata: {
				organizationId,
				patientId: normalizedSession.patientId,
				sessionId: normalizedSession.id,
			},
			error,
		});
	}

	return normalizedSession;
};

export const updatePatientSessionSummary = async ({
	sessionId,
	organizationId,
	summary,
	title,
}: {
	sessionId: string;
	organizationId: string;
	summary: string;
	title: string;
}) => {
	try {
		const [updatedSession] = await db
			.update(patientSessions)
			.set({ summary, title })
			.where(and(eq(patientSessions.id, sessionId), eq(patientSessions.organizationId, organizationId)))
			.returning();

		if (!updatedSession) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Patient session not found",
			});
		}

		return withNormalizedPatientSessionState(updatedSession);
	} catch {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update patient session summary",
		});
	}
};

export const deletePatientSession = async ({ organizationId, patientId, sessionId }: FindPatientSessionInput) => {
	const session = await getPatientSession({ organizationId, patientId, sessionId });

	if (!session) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Patient session not found",
		});
	}

	return db
		.delete(patientSessions)
		.where(and(eq(patientSessions.organizationId, organizationId), eq(patientSessions.id, sessionId)));
};
