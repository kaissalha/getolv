"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc";
import {
	assemblyAiConservativeMedicalTurnDetection,
	assemblyAiMedicalDomain,
	assemblyAiStreamingSpeechModel,
} from "@getolv/utils";
import type { AssemblyAiStreamingTurnMetadata } from "@getolv/utils";

export type ScribeStatus = "idle" | "connecting" | "recording" | "paused" | "error";
export type ScribeSpeaker = "practitioner" | "patient" | "unknown";
type ScribeSpeakerAssignments = Record<string, ScribeSpeaker>;

const TURN_DETECTION = assemblyAiConservativeMedicalTurnDetection;

export type UseScribeOptions = {
	firstSpeakerRole?: ScribeSpeaker;
	keyterms?: string[];
	onFinalTranscript?: (text: string, speaker: ScribeSpeaker, metadata: AssemblyAiStreamingTurnMetadata) => void;
	onError?: (error: Error) => void;
};

export type UseScribeReturn = {
	status: ScribeStatus;
	isRecording: boolean;
	isPaused: boolean;
	transcript: string;
	speaker: ScribeSpeaker | null;
	start: () => Promise<void>;
	stop: () => Promise<Blob | null>;
	pause: () => void;
	resume: () => void;
	error: Error | null;
};

const SAMPLE_RATE = 16000;

export const resolveAssemblyAiSpeaker = ({
	speakerLabel,
	assignments,
	firstSpeakerRole = "practitioner",
}: {
	speakerLabel?: string;
	assignments: ScribeSpeakerAssignments;
	firstSpeakerRole?: ScribeSpeaker;
}): { assignments: ScribeSpeakerAssignments; speaker: ScribeSpeaker } => {
	if (!speakerLabel) {
		return { assignments, speaker: "unknown" };
	}

	if (assignments[speakerLabel]) {
		return { assignments, speaker: assignments[speakerLabel] };
	}

	const assignedRoles = new Set(Object.values(assignments));
	const secondSpeakerRole: ScribeSpeaker = firstSpeakerRole === "practitioner" ? "patient" : "practitioner";
	const nextSpeaker: ScribeSpeaker = !assignedRoles.has(firstSpeakerRole)
		? firstSpeakerRole
		: !assignedRoles.has(secondSpeakerRole)
			? secondSpeakerRole
			: "unknown";

	return {
		assignments: { ...assignments, [speakerLabel]: nextSpeaker },
		speaker: nextSpeaker,
	};
};

export const getLiveAssemblyAiSpeaker = ({
	speakerLabel,
	assignments,
	activeSpeaker,
}: {
	speakerLabel?: string;
	assignments: ScribeSpeakerAssignments;
	activeSpeaker: Exclude<ScribeSpeaker, "unknown"> | null;
}) => {
	const assignedSpeaker = speakerLabel ? assignments[speakerLabel] : undefined;

	if (assignedSpeaker === "practitioner" || assignedSpeaker === "patient") {
		return assignedSpeaker;
	}

	return activeSpeaker;
};

export const buildAssemblyAiConnectionParams = ({ keyterms, token }: { keyterms?: string[]; token: string }) => {
	const params = new URLSearchParams({
		sample_rate: String(SAMPLE_RATE),
		speech_model: assemblyAiStreamingSpeechModel,
		speaker_labels: "true",
		max_speakers: "2",
		domain: assemblyAiMedicalDomain,
		format_turns: "true",
		token,
		min_turn_silence: String(TURN_DETECTION.minTurnSilenceMs),
		max_turn_silence: String(TURN_DETECTION.maxTurnSilenceMs),
	});

	if (keyterms && keyterms.length > 0) {
		params.set("keyterms_prompt", JSON.stringify(keyterms));
	}

	return params;
};

const getTurnBounds = ({ words }: { words?: Array<{ end: number; start: number }> }) => {
	const firstWord = words?.[0];
	const lastWord = words?.at(-1);

	return {
		endMs: lastWord?.end ?? null,
		startMs: firstWord?.start ?? null,
	};
};

const getTurnConfidence = ({
	words,
}: {
	words?: Array<{
		confidence: number;
	}>;
}) => {
	if (!words || words.length === 0) {
		return null;
	}

	const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);

	return totalConfidence / words.length;
};

type AssemblyAIMessage =
	| { type: "Begin"; id: string; expires_at: number }
	| {
			type: "Turn";
			transcript: string;
			speaker_label?: string;
			turn_is_formatted: boolean;
			end_of_turn: boolean;
			end_of_turn_confidence?: number;
			language_code?: string;
			turn_order?: number;
			words?: { confidence: number; end: number; start: number; text: string }[];
	  }
	| { type: "Termination"; audio_duration_seconds: number; session_duration_seconds: number }
	| { type: "error"; error: string };

export const useScribe = ({
	firstSpeakerRole = "practitioner",
	keyterms,
	onFinalTranscript,
	onError,
}: UseScribeOptions = {}): UseScribeReturn => {
	const [status, setStatus] = useState<ScribeStatus>("idle");
	const [transcript, setTranscript] = useState("");
	const [speaker, setSpeaker] = useState<ScribeSpeaker | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const socketRef = useRef<WebSocket | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const processorRef = useRef<ScriptProcessorNode | null>(null);
	const speakerAssignmentsRef = useRef<ScribeSpeakerAssignments>({});
	const activeSpeakerRef = useRef<Exclude<ScribeSpeaker, "unknown"> | null>(null);
	const activeTurnOrderRef = useRef<number | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const pausedRef = useRef(false);
	const onFinalTranscriptRef = useRef(onFinalTranscript);
	const onErrorRef = useRef(onError);
	const firstSpeakerRoleRef = useRef(firstSpeakerRole);
	const keytermsRef = useRef(keyterms);

	onFinalTranscriptRef.current = onFinalTranscript;
	onErrorRef.current = onError;
	firstSpeakerRoleRef.current = firstSpeakerRole;
	keytermsRef.current = keyterms;

	const trpc = useTRPC();
	const tokenQuery = useQuery({
		...trpc.scribe.getToken.queryOptions(),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	const cleanup = useCallback(() => {
		if (processorRef.current) {
			processorRef.current.disconnect();
			processorRef.current = null;
		}

		if (audioContextRef.current) {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}

		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		}
		mediaRecorderRef.current = null;

		if (mediaStreamRef.current) {
			for (const track of mediaStreamRef.current.getTracks()) {
				track.stop();
			}
			mediaStreamRef.current = null;
		}

		if (socketRef.current) {
			if (socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.send(JSON.stringify({ type: "Terminate" }));
			}
			socketRef.current.close();
			socketRef.current = null;
		}

		speakerAssignmentsRef.current = {};
		activeSpeakerRef.current = null;
		activeTurnOrderRef.current = null;
		pausedRef.current = false;
	}, []);

	useEffect(() => {
		return () => {
			cleanup();
		};
	}, [cleanup]);

	const start = useCallback(async () => {
		try {
			setStatus("connecting");
			setError(null);
			setTranscript("");
			setSpeaker(null);
			speakerAssignmentsRef.current = {};
			activeSpeakerRef.current = null;
			activeTurnOrderRef.current = null;
			audioChunksRef.current = [];
			pausedRef.current = false;

			let token: string;
			const cachedData = tokenQuery.data;

			if (cachedData && cachedData.expiresAt > Date.now() + 60000) {
				token = cachedData.token;
			} else {
				const result = await tokenQuery.refetch();
				if (!result.data) {
					throw new Error("Failed to get streaming token");
				}
				token = result.data.token;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					sampleRate: SAMPLE_RATE,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
				},
			});
			mediaStreamRef.current = stream;

			const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					audioChunksRef.current.push(e.data);
				}
			};
			mediaRecorder.start(1000);

			const connectionParams = buildAssemblyAiConnectionParams({
				keyterms: keytermsRef.current ?? [],
				token,
			});
			const wsUrl = `wss://streaming.assemblyai.com/v3/ws?${connectionParams.toString()}`;
			const socket = new WebSocket(wsUrl);
			socketRef.current = socket;

			socket.onopen = () => {
				setStatus("recording");

				const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
				audioContextRef.current = audioContext;

				const source = audioContext.createMediaStreamSource(stream);
				const processor = audioContext.createScriptProcessor(4096, 1, 1);
				processorRef.current = processor;

				processor.onaudioprocess = (event) => {
					if (socket.readyState !== WebSocket.OPEN) return;
					if (pausedRef.current) return;

					const inputData = event.inputBuffer.getChannelData(0);
					const pcmData = new Int16Array(inputData.length);

					for (let i = 0; i < inputData.length; i++) {
						const sample = Math.max(-1, Math.min(1, inputData[i]));
						pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
					}

					socket.send(pcmData.buffer);
				};

				source.connect(processor);
				processor.connect(audioContext.destination);
			};

			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data as string) as AssemblyAIMessage;

					if (data.type === "Turn") {
						const turnTranscript = data.transcript || "";

						if (typeof data.turn_order === "number" && activeTurnOrderRef.current !== data.turn_order) {
							activeTurnOrderRef.current = data.turn_order;
							activeSpeakerRef.current = null;
							setSpeaker(null);
						}

						if (turnTranscript) {
							setTranscript(turnTranscript);

							const partialSpeaker = getLiveAssemblyAiSpeaker({
								speakerLabel: data.speaker_label,
								assignments: speakerAssignmentsRef.current,
								activeSpeaker: activeSpeakerRef.current,
							});
							activeSpeakerRef.current = partialSpeaker;
							setSpeaker(partialSpeaker);
						}

						if (data.end_of_turn && data.turn_is_formatted && turnTranscript.trim()) {
							const resolvedSpeaker = resolveAssemblyAiSpeaker({
								speakerLabel: data.speaker_label,
								assignments: speakerAssignmentsRef.current,
								firstSpeakerRole: firstSpeakerRoleRef.current,
							});
							const turnBounds = getTurnBounds({ words: data.words });
							const metadata: AssemblyAiStreamingTurnMetadata = {
								confidence: getTurnConfidence({ words: data.words }),
								endMs: turnBounds.endMs,
								languageCode: data.language_code ?? null,
								rawSpeakerLabel: data.speaker_label ?? null,
								source: "streaming",
								startMs: turnBounds.startMs,
								streamTurnOrder: data.turn_order ?? null,
							};

							speakerAssignmentsRef.current = resolvedSpeaker.assignments;
							activeSpeakerRef.current = null;
							activeTurnOrderRef.current = null;

							onFinalTranscriptRef.current?.(turnTranscript, resolvedSpeaker.speaker, metadata);
							setTranscript("");
							setSpeaker(null);
						}
					} else if (data.type === "error") {
						const err = new Error(data.error);
						setError(err);
						setStatus("error");
						onErrorRef.current?.(err);
						cleanup();
					}
				} catch {
					// Ignore parse errors
				}
			};

			socket.onerror = () => {
				const err = new Error("WebSocket connection error");
				setError(err);
				setStatus("error");
				onErrorRef.current?.(err);
				cleanup();
			};

			socket.onclose = () => {
				setStatus((current) => (current === "recording" || current === "paused" ? "idle" : current));
			};
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to start recording");
			setError(error);
			setStatus("error");
			onErrorRef.current?.(error);
			cleanup();
		}
	}, [cleanup, tokenQuery]);

	const stop = useCallback(async (): Promise<Blob | null> => {
		const recorder = mediaRecorderRef.current;
		const chunks = audioChunksRef.current;

		return new Promise((resolve) => {
			if (recorder && recorder.state !== "inactive") {
				recorder.onstop = () => {
					const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
					cleanup();
					setStatus("idle");
					resolve(blob);
				};
				recorder.stop();
			} else {
				cleanup();
				setStatus("idle");
				resolve(chunks.length > 0 ? new Blob(chunks, { type: "audio/webm;codecs=opus" }) : null);
			}
		});
	}, [cleanup]);

	const pause = useCallback(() => {
		if (status !== "recording") return;
		pausedRef.current = true;
		if (mediaRecorderRef.current?.state === "recording") {
			mediaRecorderRef.current.pause();
		}
		setStatus("paused");
	}, [status]);

	const resume = useCallback(() => {
		if (status !== "paused") return;
		pausedRef.current = false;
		if (mediaRecorderRef.current?.state === "paused") {
			mediaRecorderRef.current.resume();
		}
		setStatus("recording");
	}, [status]);

	return {
		status,
		isRecording: status === "recording" || status === "paused",
		isPaused: status === "paused",
		transcript,
		speaker,
		start,
		stop,
		pause,
		resume,
		error,
	};
};
