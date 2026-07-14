"use client";

import { useCallback, useRef } from "react";

export const useCalendarScrollSync = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const timeGutterScrollRef = useRef<HTMLDivElement>(null);
	const headerHScrollRef = useRef<HTMLDivElement>(null);
	const allDayHScrollRef = useRef<HTMLDivElement>(null);
	const isSyncingVerticalScroll = useRef(false);
	const isSyncingHorizontalScroll = useRef(false);

	const applyTimedScrollTop = useCallback(({ behavior, top }: { behavior?: ScrollBehavior; top: number }) => {
		const grid = scrollRef.current;
		const gutter = timeGutterScrollRef.current;
		isSyncingVerticalScroll.current = true;

		if (grid) {
			grid.scrollTo({ behavior, top });
		}

		if (gutter) {
			gutter.scrollTo({ behavior, top });
		}

		requestAnimationFrame(() => {
			isSyncingVerticalScroll.current = false;
		});
	}, []);

	const handleTimedAreaScroll = useCallback(() => {
		if (isSyncingVerticalScroll.current) {
			return;
		}

		const grid = scrollRef.current;
		const gutter = timeGutterScrollRef.current;

		if (!grid || !gutter || gutter.scrollTop === grid.scrollTop) {
			return;
		}

		isSyncingVerticalScroll.current = true;
		gutter.scrollTop = grid.scrollTop;

		requestAnimationFrame(() => {
			isSyncingVerticalScroll.current = false;
		});
	}, []);

	const handleTimeGutterScroll = useCallback(() => {
		if (isSyncingVerticalScroll.current) {
			return;
		}

		const grid = scrollRef.current;
		const gutter = timeGutterScrollRef.current;

		if (!grid || !gutter || grid.scrollTop === gutter.scrollTop) {
			return;
		}

		isSyncingVerticalScroll.current = true;
		grid.scrollTop = gutter.scrollTop;

		requestAnimationFrame(() => {
			isSyncingVerticalScroll.current = false;
		});
	}, []);

	const handleHorizontalScroll = useCallback(({ source }: { source: HTMLDivElement }) => {
		if (isSyncingHorizontalScroll.current) {
			return;
		}

		const left = source.scrollLeft;
		const targets = [headerHScrollRef.current, allDayHScrollRef.current, scrollRef.current].filter(
			(element): element is HTMLDivElement => Boolean(element) && element !== source
		);

		if (targets.length === 0) {
			return;
		}

		isSyncingHorizontalScroll.current = true;

		for (const element of targets) {
			if (element.scrollLeft !== left) {
				element.scrollLeft = left;
			}
		}

		requestAnimationFrame(() => {
			isSyncingHorizontalScroll.current = false;
		});
	}, []);

	return {
		allDayHScrollRef,
		applyTimedScrollTop,
		handleHorizontalScroll,
		handleTimeGutterScroll,
		handleTimedAreaScroll,
		headerHScrollRef,
		scrollRef,
		timeGutterScrollRef,
	};
};
