"use client";

import { useEffect, useEffectEvent, useState } from "react";

import {
	type TranscriptTurn,
	useActiveSessionScribe,
} from "@/components/patient-sessions/active-session-scribe-provider";

export const useSessionScribeSync = ({
	initialSessionStatus,
	medicalKeyterms,
	initialTranscriptTurns,
	onTurnAppended,
	organizationId,
	patientId,
	patientName,
	sessionId,
}: {
	initialSessionStatus: "completed" | "in_progress";
	medicalKeyterms: string[];
	initialTranscriptTurns: TranscriptTurn[];
	onTurnAppended: () => void;
	organizationId: string;
	patientId: string;
	patientName: string;
	sessionId: string;
}) => {
	const { currentSession, registerSession, turns } = useActiveSessionScribe();
	const [observedTurnCount, setObservedTurnCount] = useState(initialTranscriptTurns.length);
	const isSharedSession = currentSession?.sessionId === sessionId;
	const onTurnAppendedEvent = useEffectEvent(onTurnAppended);

	useEffect(() => {
		setObservedTurnCount(initialTranscriptTurns.length);
	}, [initialTranscriptTurns.length, sessionId]);

	useEffect(() => {
		if (initialSessionStatus !== "in_progress") {
			return;
		}

		registerSession({
			sessionId,
			patientId,
			medicalKeyterms,
			organizationId,
			patientName,
			initialTurns: initialTranscriptTurns,
		});
	}, [
		initialSessionStatus,
		medicalKeyterms,
		initialTranscriptTurns,
		organizationId,
		patientId,
		patientName,
		registerSession,
		sessionId,
	]);

	useEffect(() => {
		if (!isSharedSession || turns.length <= observedTurnCount) {
			return;
		}

		const appendedTurnCount = turns.length - observedTurnCount;
		setObservedTurnCount(turns.length);

		for (let i = 0; i < appendedTurnCount; i++) {
			onTurnAppendedEvent();
		}
	}, [isSharedSession, observedTurnCount, turns.length]);
};
