"use client";

import { useEffect, useEffectEvent, useState } from "react";

export type SessionTimingSnapshot = {
	activeSegmentStartedAt: string | null;
	elapsedActiveSeconds: number;
};

const getDisplayedElapsedActiveSeconds = ({
	isActive,
	nowMs,
	sessionTiming,
}: {
	isActive: boolean;
	nowMs: number;
	sessionTiming: SessionTimingSnapshot;
}) => {
	if (!isActive || !sessionTiming.activeSegmentStartedAt) {
		return sessionTiming.elapsedActiveSeconds;
	}

	const activeSegmentMs = nowMs - new Date(sessionTiming.activeSegmentStartedAt).getTime();

	if (!Number.isFinite(activeSegmentMs) || activeSegmentMs <= 0) {
		return sessionTiming.elapsedActiveSeconds;
	}

	return sessionTiming.elapsedActiveSeconds + Math.floor(activeSegmentMs / 1000);
};

const formatElapsedActiveTime = ({ elapsedActiveSeconds }: { elapsedActiveSeconds: number }) => {
	const hours = Math.floor(elapsedActiveSeconds / 3600);
	const minutes = Math.floor((elapsedActiveSeconds % 3600) / 60);
	const seconds = elapsedActiveSeconds % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const useSessionElapsedTime = ({
	initialTiming,
	isActive,
	timingUpdate = null,
}: {
	initialTiming: SessionTimingSnapshot;
	isActive: boolean;
	timingUpdate?: SessionTimingSnapshot | null;
}) => {
	const [nowMs, setNowMs] = useState(() => Date.now());
	const [sessionTiming, setSessionTiming] = useState(initialTiming);

	useEffect(() => {
		if (!timingUpdate) {
			return;
		}

		setNowMs(Date.now());
		setSessionTiming(timingUpdate);
	}, [timingUpdate]);

	const handleTick = useEffectEvent(() => {
		setNowMs(Date.now());
	});

	useEffect(() => {
		setNowMs(Date.now());

		if (!isActive || !sessionTiming.activeSegmentStartedAt) {
			return;
		}

		const intervalId = window.setInterval(() => {
			handleTick();
		}, 1000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [isActive, sessionTiming.activeSegmentStartedAt]);

	const elapsedActiveSeconds = getDisplayedElapsedActiveSeconds({
		isActive,
		nowMs,
		sessionTiming,
	});

	return {
		elapsedActiveSeconds,
		formattedElapsedActiveTime: formatElapsedActiveTime({ elapsedActiveSeconds }),
	};
};
