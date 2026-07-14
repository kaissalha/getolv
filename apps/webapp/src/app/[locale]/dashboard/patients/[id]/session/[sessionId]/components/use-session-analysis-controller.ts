"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
	type TranscriptTurn,
	useActiveSessionScribe,
} from "@/components/patient-sessions/active-session-scribe-provider";
import type { SessionTimingSnapshot } from "@/components/patient-sessions/use-session-elapsed-time";
import { useTRPC } from "@/lib/trpc";
import { toast } from "@starter/ui/components/sonner";

import type { SessionIntelligence } from "./intelligence/types";

const INTELLIGENCE_DEBOUNCE_MS = 8000;
const MIN_TURNS_FOR_ANALYSIS = 2;

export const useSessionAnalysisController = ({
	initialCompletedTodoIds,
	initialIntelligence,
	initialSessionStatus,
	initialTranscriptTurns,
	patientId,
	patientName,
	sessionId,
}: {
	initialCompletedTodoIds: string[];
	initialIntelligence: SessionIntelligence | null;
	initialSessionStatus: "completed" | "in_progress";
	initialTranscriptTurns: TranscriptTurn[];
	patientId: string;
	patientName: string;
	sessionId: string;
}) => {
	const t = useTranslations("scribe");
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const activeSessionQueryKey = trpc.patientSessions.getActiveSession.queryKey();
	const patientQueryKey = trpc.patients.get.queryKey({ id: patientId });
	const activityFeedQueryKey = trpc.patients.getActivityFeed.queryKey({ patientId });
	const patientSessionsQueryKey = trpc.patientSessions.getPatientSessions.queryKey({ patientId });
	const notesQueryKey = trpc.notes.list.queryKey();
	const [completedTodoIds, setCompletedTodoIds] = useState(initialCompletedTodoIds);
	const [intelligence, setIntelligence] = useState(initialIntelligence);
	const [isEnded, setIsEnded] = useState(initialSessionStatus === "completed");
	const [isResumeAlertOpen, setIsResumeAlertOpen] = useState(false);
	const [sessionTimingSnapshot, setSessionTimingSnapshot] = useState<SessionTimingSnapshot | null>(null);
	const [_turnCount, setTurnCount] = useState(initialTranscriptTurns.length);
	const rollbackCompletedTodoIdsRef = useRef<string[] | null>(null);
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { currentSession, prepareFinalize } = useActiveSessionScribe();

	const { data: activeSession } = useQuery(trpc.patientSessions.getActiveSession.queryOptions());
	const { data: notesData } = useQuery(
		trpc.notes.list.queryOptions({ pageSize: 100, resourceId: patientId, resourceType: "patient" })
	);

	const analyzeMutation = useMutation(
		trpc.sessionIntelligence.analyze.mutationOptions({
			onError: (error) => {
				toast.error(t("error"), {
					description: error instanceof Error ? error.message : t("error"),
				});
			},
			onSuccess: (data) => {
				const {
					completedTodoIds: nextCompletedTodoIds,
					sessionSummary: _sessionSummary,
					sessionTitle: _sessionTitle,
					...nextIntelligence
				} = data;
				setCompletedTodoIds(nextCompletedTodoIds);
				setIntelligence(nextIntelligence);
			},
		})
	);

	const finalizeSessionMutation = useMutation(trpc.patientSessions.finalizeSession.mutationOptions());
	const updateCompletedTodoIdsMutation = useMutation(
		trpc.patientSessions.updateCompletedTodoIds.mutationOptions({
			onError: (error) => {
				setCompletedTodoIds(rollbackCompletedTodoIdsRef.current ?? []);
				toast.error(t("error"), {
					description: error instanceof Error ? error.message : t("error"),
				});
			},
			onMutate: async ({ completedTodoIds: nextCompletedTodoIds }) => {
				rollbackCompletedTodoIdsRef.current = completedTodoIds;
				setCompletedTodoIds(nextCompletedTodoIds);
			},
			onSuccess: (patientSession) => {
				rollbackCompletedTodoIdsRef.current = null;
				setCompletedTodoIds(patientSession.completedTodoIds ?? []);
			},
		})
	);
	const resumeSessionMutation = useMutation(
		trpc.patientSessions.resumeSession.mutationOptions({
			onError: (error) => {
				if (error.data?.code === "CONFLICT") {
					void queryClient.invalidateQueries({ queryKey: activeSessionQueryKey });
					setIsResumeAlertOpen(true);
					return;
				}

				toast.error(t("error"), {
					description: error instanceof Error ? error.message : t("resumeSessionError"),
				});
			},
			onSuccess: async (patientSession) => {
				setSessionTimingSnapshot({
					activeSegmentStartedAt: patientSession.activeSegmentStartedAt,
					elapsedActiveSeconds: patientSession.elapsedActiveSeconds,
				});
				setIsEnded(false);
				setIsResumeAlertOpen(false);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: activeSessionQueryKey }),
					queryClient.invalidateQueries({ queryKey: patientQueryKey }),
					queryClient.invalidateQueries({ queryKey: patientSessionsQueryKey }),
				]);
				toast.success(t("sessionResumed"));
			},
		})
	);

	const runScheduledAnalyze = useCallback(
		(practitionerPrompt?: string) => {
			if (isEnded || analyzeMutation.isPending) {
				return;
			}

			analyzeMutation.mutate({
				patientId,
				patientName,
				practitionerPrompt,
				practitionerQaTurns: intelligence?.practitionerQaTurns ?? [],
				sessionId,
			});
		},
		[analyzeMutation, intelligence?.practitionerQaTurns, isEnded, patientId, patientName, sessionId]
	);

	const runScheduledAnalyzeRef = useRef(runScheduledAnalyze);
	runScheduledAnalyzeRef.current = runScheduledAnalyze;

	const scheduleAnalysis = useCallback(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			runScheduledAnalyzeRef.current();
		}, INTELLIGENCE_DEBOUNCE_MS);
	}, []);

	const handleTurnAppended = useCallback(() => {
		setTurnCount((currentTurnCount) => {
			const nextTurnCount = currentTurnCount + 1;

			if (nextTurnCount >= MIN_TURNS_FOR_ANALYSIS) {
				scheduleAnalysis();
			}

			return nextTurnCount;
		});
	}, [scheduleAnalysis]);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		setTurnCount(initialTranscriptTurns.length);
	}, [initialTranscriptTurns.length, sessionId]);

	const handleEndSession = useCallback(async () => {
		try {
			if (!isEnded && currentSession?.sessionId === sessionId) {
				await prepareFinalize();
			}
			const data = await finalizeSessionMutation.mutateAsync({ sessionId });
			setSessionTimingSnapshot({
				activeSegmentStartedAt: data.patientSession.activeSegmentStartedAt,
				elapsedActiveSeconds: data.patientSession.elapsedActiveSeconds,
			});
			setIsEnded(true);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: activeSessionQueryKey }),
				queryClient.invalidateQueries({ queryKey: patientQueryKey }),
				queryClient.invalidateQueries({ queryKey: activityFeedQueryKey }),
				queryClient.invalidateQueries({ queryKey: patientSessionsQueryKey }),
				queryClient.invalidateQueries({ queryKey: notesQueryKey }),
			]);
			toast.success(t("sessionEnded"));
		} catch (error) {
			toast.error(t("error"), {
				description: error instanceof Error ? error.message : "Failed to end session",
			});
		}
	}, [
		activeSessionQueryKey,
		activityFeedQueryKey,
		finalizeSessionMutation,
		currentSession?.sessionId,
		isEnded,
		notesQueryKey,
		patientQueryKey,
		patientSessionsQueryKey,
		prepareFinalize,
		queryClient,
		sessionId,
		t,
	]);

	const startResumeSession = useCallback(
		({ endExisting = false }: { endExisting?: boolean } = {}) => {
			resumeSessionMutation.mutate({
				endExisting,
				sessionId,
			});
		},
		[resumeSessionMutation, sessionId]
	);

	const handleResumeSession = useCallback(() => {
		if (activeSession && activeSession.id !== sessionId) {
			setIsResumeAlertOpen(true);
			return;
		}

		startResumeSession();
	}, [activeSession, sessionId, startResumeSession]);

	const handleConfirmResumeSession = useCallback(() => {
		startResumeSession({ endExisting: true });
	}, [startResumeSession]);

	const handleCompletedTodoIdsChange = useCallback(
		(nextCompletedTodoIds: string[]) => {
			updateCompletedTodoIdsMutation.mutate({
				sessionId,
				completedTodoIds: nextCompletedTodoIds,
			});
		},
		[sessionId, updateCompletedTodoIdsMutation]
	);

	const isAnalyzing = analyzeMutation.isPending;
	const isEnding = finalizeSessionMutation.isPending;
	const isResuming = resumeSessionMutation.isPending;

	return {
		activeSession,
		completedTodoIds,
		handleConfirmResumeSession,
		handleCompletedTodoIdsChange,
		handleEndSession,
		handleIntelligencePrompt: runScheduledAnalyze,
		handleResumeAlertOpenChange: setIsResumeAlertOpen,
		handleResumeSession,
		handleTurnAppended,
		intelligence,
		isAnalyzing,
		isEnded,
		isEnding,
		isPromptDisabled: isEnded || isAnalyzing || isEnding || isResuming || updateCompletedTodoIdsMutation.isPending,
		isResumeAlertOpen,
		isResuming,
		patientNotes: notesData?.data ?? [],
		sessionTimingSnapshot,
	};
};
