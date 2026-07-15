import { z } from "zod";

import {
	appendTranscriptTurn,
	createPatientSession,
	deletePatientSession,
	finalizePatientSession,
	getActivePatientSession,
	getPatientSessionAudioUrl,
	getPatientSession,
	getPatientSessions,
	getSessionTranscriptTurns,
	resumePatientSession,
	updatePatientSessionAudio,
	updatePatientSessionCompletedTodoIds,
} from "../../services/patient-sessions";
import type { getolvRouterFactoryOptions } from "../shared";

const sessionTranscriptTurnMetadataSchema = z.object({
	confidence: z.number().nullable().optional(),
	endMs: z.number().nullable().optional(),
	languageCode: z.string().nullable().optional(),
	rawSpeakerLabel: z.string().nullable().optional(),
	source: z.enum(["pre_recorded", "streaming"]),
	startMs: z.number().nullable().optional(),
	streamTurnOrder: z.number().nullable().optional(),
});

export const createPatientSessionsRouter = ({
	createTRPCRouter,
	organizationProcedure,
	queueSessionTranscriptPostProcessing,
}: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		createPatientSession: organizationProcedure
			.input(
				z.object({
					endExisting: z.boolean().optional(),
					patientId: z.string(),
					title: z.string().optional(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				createPatientSession({
					endExisting: input.endExisting,
					organizationId: ctx.activeOrganizationId,
					patientId: input.patientId,
					title: input.title,
				})
			),

		getActiveSession: organizationProcedure.query(async ({ ctx }) =>
			getActivePatientSession({ organizationId: ctx.activeOrganizationId })
		),

		getPatientSessions: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
				})
			)
			.query(async ({ input, ctx }) => getPatientSessions(input.patientId, ctx.activeOrganizationId)),

		getPatientSession: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					sessionId: z.string(),
				})
			)
			.query(async ({ input, ctx }) =>
				getPatientSession({
					organizationId: ctx.activeOrganizationId,
					patientId: input.patientId,
					sessionId: input.sessionId,
				})
			),

		deletePatientSession: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					sessionId: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				deletePatientSession({
					organizationId: ctx.activeOrganizationId,
					patientId: input.patientId,
					sessionId: input.sessionId,
				})
			),

		appendTranscriptTurn: organizationProcedure
			.input(
				z.object({
					metadata: sessionTranscriptTurnMetadataSchema.optional(),
					sessionId: z.string(),
					speaker: z.enum(["practitioner", "patient", "unknown"]),
					text: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				appendTranscriptTurn({
					metadata: input.metadata,
					sessionId: input.sessionId,
					organizationId: ctx.activeOrganizationId,
					speaker: input.speaker,
					text: input.text,
				})
			),

		getTranscriptTurns: organizationProcedure
			.input(z.object({ sessionId: z.string() }))
			.query(async ({ input, ctx }) => getSessionTranscriptTurns(input.sessionId, ctx.activeOrganizationId)),

		updateAudio: organizationProcedure
			.input(
				z.object({
					sessionId: z.string(),
					audioUrl: z.string().url(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				updatePatientSessionAudio({
					sessionId: input.sessionId,
					organizationId: ctx.activeOrganizationId,
					audioUrl: input.audioUrl,
				})
			),
		updateCompletedTodoIds: organizationProcedure
			.input(
				z.object({
					sessionId: z.string(),
					completedTodoIds: z.array(z.string()),
				})
			)
			.mutation(async ({ input, ctx }) =>
				updatePatientSessionCompletedTodoIds({
					sessionId: input.sessionId,
					organizationId: ctx.activeOrganizationId,
					completedTodoIds: input.completedTodoIds,
				})
			),

		finalizeSession: organizationProcedure
			.input(
				z.object({
					sessionId: z.string(),
					finalTranscript: z.string().optional(),
					summary: z.string().optional(),
					title: z.string().optional(),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const audioUrl = await getPatientSessionAudioUrl({
					sessionId: input.sessionId,
					organizationId: ctx.activeOrganizationId,
				});
				const transcriptPostProcessingRunId = audioUrl
					? (
							await queueSessionTranscriptPostProcessing({
								audioUrl,
								organizationId: ctx.activeOrganizationId,
								practitionerEmail: ctx.user.email,
								practitionerName: ctx.user.name,
								sessionId: input.sessionId,
							})
						).runId
					: null;
				const patientSession = await finalizePatientSession({
					sessionId: input.sessionId,
					organizationId: ctx.activeOrganizationId,
					finalTranscript: input.finalTranscript ?? "",
					practitionerEmail: ctx.user.email,
					practitionerName: ctx.user.name,
					refreshPatientSummaryOnFinalize: !audioUrl,
					summary: input.summary,
					title: input.title,
				});

				return {
					patientSession,
					transcriptPostProcessingRunId,
				};
			}),

		resumeSession: organizationProcedure
			.input(
				z.object({
					endExisting: z.boolean().optional(),
					sessionId: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				resumePatientSession({
					endExisting: input.endExisting,
					organizationId: ctx.activeOrganizationId,
					sessionId: input.sessionId,
				})
			),
	});
