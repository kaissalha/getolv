import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
	type SessionTimingSnapshot,
	useSessionElapsedTime,
} from "@/components/patient-sessions/use-session-elapsed-time";

type HookProps = {
	isActive: boolean;
	timingUpdate: SessionTimingSnapshot | null;
};

const renderSessionTimer = ({
	initialActiveSegmentStartedAt,
	initialElapsedActiveSeconds,
	isActive = false,
	timingUpdate = null,
}: {
	initialActiveSegmentStartedAt: string | null;
	initialElapsedActiveSeconds: number;
	isActive?: boolean;
	timingUpdate?: SessionTimingSnapshot | null;
}) =>
	renderHook(() =>
		useSessionElapsedTime({
			initialTiming: {
				activeSegmentStartedAt: initialActiveSegmentStartedAt,
				elapsedActiveSeconds: initialElapsedActiveSeconds,
			},
			isActive,
			timingUpdate,
		})
	);

describe("useSessionTimerController", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("ticks once per second while the session is active", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T10:00:00.000Z"));

		const { result } = renderSessionTimer({
			initialActiveSegmentStartedAt: "2026-04-14T10:00:00.000Z",
			initialElapsedActiveSeconds: 75,
			isActive: true,
		});

		expect(result.current.elapsedActiveSeconds).toBe(75);
		expect(result.current.formattedElapsedActiveTime).toBe("01:15");

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(result.current.elapsedActiveSeconds).toBe(78);
		expect(result.current.formattedElapsedActiveTime).toBe("01:18");
	});

	it("stays frozen when the session is completed", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T10:00:00.000Z"));

		const { result, rerender } = renderHook(
			({ isActive, timingUpdate }: HookProps) =>
				useSessionElapsedTime({
					initialTiming: {
						activeSegmentStartedAt: "2026-04-14T10:00:00.000Z",
						elapsedActiveSeconds: 60,
					},
					isActive,
					timingUpdate,
				}),
			{
				initialProps: {
					isActive: true,
					timingUpdate: null,
				} as HookProps,
			}
		);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		rerender({
			isActive: false,
			timingUpdate: {
				activeSegmentStartedAt: null,
				elapsedActiveSeconds: 62,
			},
		});

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(result.current.elapsedActiveSeconds).toBe(62);
		expect(result.current.formattedElapsedActiveTime).toBe("01:02");
	});

	it("resumes from the prior total after a timing update", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-04-14T10:05:00.000Z"));

		const { result, rerender } = renderHook(
			({ isActive, timingUpdate }: HookProps) =>
				useSessionElapsedTime({
					initialTiming: {
						activeSegmentStartedAt: null,
						elapsedActiveSeconds: 195,
					},
					isActive,
					timingUpdate,
				}),
			{
				initialProps: {
					isActive: false,
					timingUpdate: null,
				} as HookProps,
			}
		);

		rerender({
			isActive: true,
			timingUpdate: {
				activeSegmentStartedAt: "2026-04-14T10:05:00.000Z",
				elapsedActiveSeconds: 195,
			},
		});

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.elapsedActiveSeconds).toBe(197);
		expect(result.current.formattedElapsedActiveTime).toBe("03:17");
	});
});

describe("formatElapsedActiveTime", () => {
	it("formats shorter sessions as MM:SS and longer sessions as H:MM:SS", () => {
		const shortSession = renderSessionTimer({
			initialActiveSegmentStartedAt: null,
			initialElapsedActiveSeconds: 125,
		});
		const longSession = renderSessionTimer({
			initialActiveSegmentStartedAt: null,
			initialElapsedActiveSeconds: 3665,
		});

		expect(shortSession.result.current.formattedElapsedActiveTime).toBe("02:05");
		expect(longSession.result.current.formattedElapsedActiveTime).toBe("1:01:05");
	});
});
