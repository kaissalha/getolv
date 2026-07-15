"use client";

import {
	createContext,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from "react";
import type { ReactNode } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";
import { useTranslations } from "next-intl";

import { type ScribeSpeaker, type ScribeStatus, useScribe } from "@/hooks/scribe/use-scribe";
import { useTRPC } from "@/lib/trpc";
import type { SessionTranscriptTurnMetadata } from "@getolv/db";
import type { RouterOutput } from "@getolv/server";
import { toast } from "@getolv/ui/components/sonner";
import { buildAssemblyAiMedicalKeytermsFromPatient } from "@getolv/utils";

type ActiveSession = RouterOutput["patientSessions"]["getActiveSession"];
type PatientSession = RouterOutput["patientSessions"]["getPatientSession"];

export type TranscriptTurn = {
	id: string;
	text: string;
	speaker: ScribeSpeaker;
};

type ActiveSessionScribeSession = {
	medicalKeyterms: string[];
	organizationId: string;
	patientId: string;
	patientName: string;
	sessionId: string;
};

type RegisterSessionInput = ActiveSessionScribeSession & {
	initialTurns: TranscriptTurn[];
};

type StopRecordingOptions = {
	announceStopped?: boolean;
};

type ActiveSessionScribeContextValue = {
	activeSession: ActiveSession | undefined;
	currentSession: ActiveSessionScribeSession | null;
	error: Error | null;
	isPaused: boolean;
	isRecording: boolean;
	isUploading: boolean;
	pauseRecording: () => void;
	prepareFinalize: () => Promise<void>;
	registerSession: (input: RegisterSessionInput) => void;
	resumeRecording: () => void;
	speaker: ScribeSpeaker | null;
	startRecording: () => Promise<void>;
	status: ScribeStatus;
	stopRecording: (options?: StopRecordingOptions) => Promise<void>;
	transcript: string;
	turns: TranscriptTurn[];
};

const ActiveSessionScribeContext = createContext<ActiveSessionScribeContextValue | null>(null);

const getRegisterSessionInput = ({
	activeSession,
	patientSession,
}: {
	activeSession: NonNullable<ActiveSession>;
	patientSession: PatientSession | undefined;
}): RegisterSessionInput => ({
	sessionId: activeSession.id,
	patientId: activeSession.patientId,
	organizationId: activeSession.organizationId,
	patientName: [activeSession.patient?.firstName, activeSession.patient?.lastName].filter(Boolean).join(" "),
	medicalKeyterms: buildAssemblyAiMedicalKeytermsFromPatient({
		allergies: patientSession?.patient?.allergies ?? activeSession.patient?.allergies,
		currentMedications: patientSession?.patient?.currentMedications ?? activeSession.patient?.currentMedications,
		diagnosis: patientSession?.patient?.diagnosis ?? activeSession.patient?.diagnosis,
		familyMedicalHistory:
			patientSession?.patient?.familyMedicalHistory ?? activeSession.patient?.familyMedicalHistory,
		pastMedicalHistory: patientSession?.patient?.pastMedicalHistory ?? activeSession.patient?.pastMedicalHistory,
	}),
	initialTurns:
		patientSession?.transcriptTurns.map((turn) => ({
			id: turn.id,
			speaker: turn.speaker,
			text: turn.text,
		})) ?? [],
});

export const getTranscriptTurnOverlapLength = ({
	currentTurns,
	initialTurns,
}: {
	currentTurns: TranscriptTurn[];
	initialTurns: TranscriptTurn[];
}) => {
	const maxOverlapLength = Math.min(currentTurns.length, initialTurns.length);

	for (let overlapLength = maxOverlapLength; overlapLength > 0; overlapLength -= 1) {
		const initialOffset = initialTurns.length - overlapLength;
		const hasOverlap = currentTurns.slice(0, overlapLength).every((turn, index) => {
			const initialTurn = initialTurns[initialOffset + index];

			return (
				turn.id === initialTurn.id || (turn.speaker === initialTurn.speaker && turn.text === initialTurn.text)
			);
		});

		if (hasOverlap) {
			return overlapLength;
		}
	}

	return 0;
};

export const resolveRegisteredTurns = ({
	currentTurns,
	initialTurns,
	isSessionSwitch,
}: {
	currentTurns: TranscriptTurn[];
	initialTurns: TranscriptTurn[];
	isSessionSwitch: boolean;
}) => {
	if (isSessionSwitch) {
		return initialTurns;
	}

	if (currentTurns.length === 0 || initialTurns.length === 0) {
		return currentTurns.length === 0 ? initialTurns : currentTurns;
	}

	const overlapLength = getTranscriptTurnOverlapLength({
		currentTurns,
		initialTurns,
	});

	return [...initialTurns, ...currentTurns.slice(overlapLength)];
};

export const resolveWriteSession = ({
	currentSession,
	recordingSession,
}: {
	currentSession: ActiveSessionScribeSession | null;
	recordingSession: ActiveSessionScribeSession | null;
}) => recordingSession ?? currentSession;

export const shouldQueueSessionRegistration = ({
	currentSessionId,
	isRecording,
	isUploading,
	nextSessionId,
	status,
}: {
	currentSessionId: string | null;
	isRecording: boolean;
	isUploading: boolean;
	nextSessionId: string;
	status: ScribeStatus;
}) => currentSessionId !== nextSessionId && (isRecording || isUploading || status === "connecting");

export const ActiveSessionScribeProvider = ({ children }: { children: ReactNode }) => {
	const t = useTranslations("scribe");
	const trpc = useTRPC();
	const [currentSession, setCurrentSession] = useState<ActiveSessionScribeSession | null>(null);
	const [turns, setTurns] = useState<TranscriptTurn[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isStoppingForPendingSession, setIsStoppingForPendingSession] = useState(false);
	const uploadPromiseRef = useRef<Promise<void> | null>(null);
	const pendingSessionRef = useRef<RegisterSessionInput | null>(null);
	const recordingSessionRef = useRef<ActiveSessionScribeSession | null>(null);
	const turnsSessionIdRef = useRef<string | null>(null);
	const currentSessionRef = useRef(currentSession);

	currentSessionRef.current = currentSession;

	const { data: activeSession } = useQuery(trpc.patientSessions.getActiveSession.queryOptions());
	const activeSessionDetails = useQuery({
		...trpc.patientSessions.getPatientSession.queryOptions({
			patientId: activeSession?.patientId ?? "",
			sessionId: activeSession?.id ?? "",
		}),
		enabled: Boolean(activeSession?.patientId && activeSession?.id),
	});

	const appendTurnMutation = useMutation(trpc.patientSessions.appendTranscriptTurn.mutationOptions());
	const updateAudioMutation = useMutation(trpc.patientSessions.updateAudio.mutationOptions());

	const applyRegisteredSession = useCallback(({ initialTurns, ...session }: RegisterSessionInput) => {
		const isSessionSwitch = turnsSessionIdRef.current !== session.sessionId;

		if (isSessionSwitch) {
			turnsSessionIdRef.current = session.sessionId;
		}

		setCurrentSession((current) => {
			if (
				current?.sessionId === session.sessionId &&
				current.organizationId === session.organizationId &&
				current.patientId === session.patientId &&
				current.patientName === session.patientName &&
				current.medicalKeyterms.length === session.medicalKeyterms.length &&
				current.medicalKeyterms.every((keyterm, index) => keyterm === session.medicalKeyterms[index])
			) {
				return current;
			}

			return session;
		});

		setTurns((currentTurns) => {
			return resolveRegisteredTurns({
				currentTurns,
				initialTurns,
				isSessionSwitch,
			});
		});
	}, []);

	const handleFinalTranscript = useCallback(
		(text: string, speaker: ScribeSpeaker, metadata: SessionTranscriptTurnMetadata) => {
			const session = resolveWriteSession({
				currentSession: currentSessionRef.current,
				recordingSession: recordingSessionRef.current,
			});

			if (!session) {
				return;
			}

			setTurns((currentTurns) => [...currentTurns, { id: crypto.randomUUID(), text, speaker }]);
			appendTurnMutation.mutate({
				metadata,
				sessionId: session.sessionId,
				speaker,
				text,
			});
		},
		[appendTurnMutation]
	);

	const { error, isPaused, isRecording, pause, resume, speaker, start, status, stop, transcript } = useScribe({
		keyterms: currentSession?.medicalKeyterms,
		onFinalTranscript: handleFinalTranscript,
		onError: (nextError) => {
			toast.error(t("error"), { description: nextError.message });
		},
	});

	const isRecordingRef = useRef(isRecording);
	isRecordingRef.current = isRecording;

	const registerSession = useCallback(
		(input: RegisterSessionInput) => {
			if (
				shouldQueueSessionRegistration({
					currentSessionId: turnsSessionIdRef.current,
					isRecording,
					isUploading,
					nextSessionId: input.sessionId,
					status,
				})
			) {
				pendingSessionRef.current = input;
				return;
			}

			applyRegisteredSession(input);
		},
		[applyRegisteredSession, isRecording, isUploading, status]
	);

	useEffect(() => {
		if (!activeSession) {
			return;
		}

		startTransition(() => {
			registerSession(
				getRegisterSessionInput({
					activeSession,
					patientSession: activeSessionDetails.data,
				})
			);
		});
	}, [activeSession, activeSessionDetails.data, registerSession]);

	const uploadAudio = useCallback(
		async ({ audioBlob, session }: { audioBlob: Blob; session: ActiveSessionScribeSession }) => {
			setIsUploading(true);
			let uploadError: Error | null = null;

			try {
				const blob = await upload(`sessions/${session.sessionId}/audio.webm`, audioBlob, {
					access: "private",
					handleUploadUrl: "/api/media",
					clientPayload: JSON.stringify({
						organizationId: session.organizationId,
						access: "private",
					}),
				});

				await updateAudioMutation.mutateAsync({
					sessionId: session.sessionId,
					audioUrl: blob.url,
				});
			} catch (nextError) {
				uploadError = nextError instanceof Error ? nextError : new Error("Failed to upload audio");
			}

			setIsUploading(false);

			if (uploadError) {
				toast.error(t("error"), {
					description: uploadError.message,
				});
			}
		},
		[t, updateAudioMutation]
	);

	const stopRecording = useCallback(
		async ({ announceStopped = true }: StopRecordingOptions = {}) => {
			if (uploadPromiseRef.current) {
				await uploadPromiseRef.current;
			}

			if (!isRecordingRef.current) {
				return;
			}

			const session = resolveWriteSession({
				currentSession: currentSessionRef.current,
				recordingSession: recordingSessionRef.current,
			});
			const audioBlob = await stop();

			if (audioBlob && audioBlob.size > 0 && session) {
				const uploadPromise = uploadAudio({ audioBlob, session });
				uploadPromiseRef.current = uploadPromise;
				await uploadPromise;
				uploadPromiseRef.current = null;
			}

			if (announceStopped) {
				toast.info(t("recordingStopped"));
			}
		},
		[stop, t, uploadAudio]
	);

	const prepareFinalize = useCallback(async () => {
		await stopRecording({ announceStopped: false });
	}, [stopRecording]);

	const startRecording = useCallback(async () => {
		const session = currentSessionRef.current;

		if (!session) {
			return;
		}

		recordingSessionRef.current = session;
		await start();
	}, [start]);

	const pauseRecording = useCallback(() => {
		pause();
	}, [pause]);

	const resumeRecording = useCallback(() => {
		resume();
	}, [resume]);

	const stopPendingRecording = useEffectEvent(() => {
		setIsStoppingForPendingSession(true);

		void stopRecording({ announceStopped: false }).finally(() => {
			setIsStoppingForPendingSession(false);
		});
	});

	useEffect(() => {
		if (!pendingSessionRef.current || !isRecording || isStoppingForPendingSession) {
			return;
		}

		stopPendingRecording();
	}, [isRecording, isStoppingForPendingSession]);

	useEffect(() => {
		if (status === "connecting" || isRecording || isUploading) {
			return;
		}

		recordingSessionRef.current = null;

		if (!pendingSessionRef.current) {
			return;
		}

		const pendingSession = pendingSessionRef.current;
		pendingSessionRef.current = null;
		startTransition(() => {
			applyRegisteredSession(pendingSession);
		});
	}, [applyRegisteredSession, isRecording, isUploading, status]);

	const contextValue: ActiveSessionScribeContextValue = {
		activeSession,
		currentSession,
		error,
		isPaused,
		isRecording,
		isUploading,
		pauseRecording,
		prepareFinalize,
		registerSession,
		resumeRecording,
		speaker,
		startRecording,
		status,
		stopRecording,
		transcript,
		turns,
	};

	return <ActiveSessionScribeContext.Provider value={contextValue}>{children}</ActiveSessionScribeContext.Provider>;
};

export const useActiveSessionScribe = () => {
	const context = useContext(ActiveSessionScribeContext);

	if (!context) {
		throw new Error("useActiveSessionScribe must be used within ActiveSessionScribeProvider");
	}

	return context;
};
