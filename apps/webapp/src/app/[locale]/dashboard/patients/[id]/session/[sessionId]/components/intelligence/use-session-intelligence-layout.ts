"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useContainerWidth } from "react-grid-layout";
import type { Layout, LayoutItem, ResizeHandleAxis } from "react-grid-layout";

const SESSION_INTELLIGENCE_STACKED_BREAKPOINT_PX = 640;
const SESSION_INTELLIGENCE_LAYOUT_STORAGE_KEY = "getolv:session-intelligence-pane-layout:desktop:v2";

export const SESSION_INTELLIGENCE_GRID_COLS = 4;
export const SESSION_INTELLIGENCE_GRID_ROW_HEIGHT = 80;
export const SESSION_INTELLIGENCE_GRID_MARGIN = [14, 14] as [number, number];
export const SESSION_INTELLIGENCE_GRID_CONTAINER_PADDING = [0, 0] as [number, number];
export const SESSION_INTELLIGENCE_RESIZE_HANDLES: ResizeHandleAxis[] = ["nw", "ne", "sw", "se"];

const INITIAL_LAYOUT = [
	{ i: "transcribe", x: 0, y: 0, w: 2, h: 5, minW: 1, minH: 2, maxW: SESSION_INTELLIGENCE_GRID_COLS, maxH: 20 },
	{ i: "diagnosis", x: 0, y: 5, w: 2, h: 3, minW: 1, minH: 1, maxW: SESSION_INTELLIGENCE_GRID_COLS, maxH: 24 },
	{ i: "liveNote", x: 2, y: 0, w: 2, h: 3, minW: 1, minH: 2, maxW: SESSION_INTELLIGENCE_GRID_COLS, maxH: 20 },
	{ i: "todos", x: 2, y: 3, w: 2, h: 3, minW: 1, minH: 1, maxW: SESSION_INTELLIGENCE_GRID_COLS, maxH: 16 },
	{ i: "notes", x: 2, y: 6, w: 2, h: 2, minW: 1, minH: 1, maxW: SESSION_INTELLIGENCE_GRID_COLS, maxH: 16 },
] as const;

const LAYOUT_RULES = Object.fromEntries(INITIAL_LAYOUT.map((item) => [item.i, item])) as Record<
	(typeof INITIAL_LAYOUT)[number]["i"],
	(typeof INITIAL_LAYOUT)[number]
>;

const mergeLayoutWithRules = (items: LayoutItem[]) =>
	items.map((item) => {
		const rule = LAYOUT_RULES[item.i as keyof typeof LAYOUT_RULES];

		if (!rule) {
			return item;
		}

		return {
			...item,
			maxH: rule.maxH,
			maxW: rule.maxW,
			minH: rule.minH,
			minW: rule.minW,
		};
	});

const isLayoutItemLoose = (value: unknown): value is LayoutItem => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const id = Reflect.get(value, "i");
	const x = Reflect.get(value, "x");
	const y = Reflect.get(value, "y");
	const width = Reflect.get(value, "w");
	const height = Reflect.get(value, "h");

	return (
		typeof id === "string" &&
		Number.isFinite(x) &&
		Number.isFinite(y) &&
		Number.isFinite(width) &&
		Number.isFinite(height)
	);
};

const parseStoredLayout = (raw: string | null): Layout | null => {
	if (!raw) {
		return null;
	}

	try {
		const data: unknown = JSON.parse(raw);

		if (!Array.isArray(data) || data.length === 0 || !data.every(isLayoutItemLoose)) {
			return null;
		}

		const ids = new Set(data.map((item) => item.i));

		for (const item of INITIAL_LAYOUT) {
			if (!ids.has(item.i)) {
				return null;
			}
		}

		return mergeLayoutWithRules(data.map((item) => ({ ...item })));
	} catch {
		return null;
	}
};

const getInitialDesktopLayout = () => {
	const defaultLayout = INITIAL_LAYOUT.map((item) => ({ ...item }));

	if (typeof window === "undefined") {
		return defaultLayout;
	}

	return parseStoredLayout(localStorage.getItem(SESSION_INTELLIGENCE_LAYOUT_STORAGE_KEY)) ?? defaultLayout;
};

export const useSessionIntelligenceLayout = () => {
	const { width, containerRef, mounted } = useContainerWidth();
	const [desktopLayout, setDesktopLayout] = useState<Layout>(getInitialDesktopLayout);
	const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleDesktopLayoutChange = useCallback((nextLayout: Layout) => {
		const next = mergeLayoutWithRules(nextLayout.map((item) => ({ ...item })));
		setDesktopLayout(next);

		if (typeof window === "undefined") {
			return;
		}

		if (persistTimerRef.current) {
			clearTimeout(persistTimerRef.current);
		}

		persistTimerRef.current = setTimeout(() => {
			persistTimerRef.current = null;

			try {
				localStorage.setItem(SESSION_INTELLIGENCE_LAYOUT_STORAGE_KEY, JSON.stringify(next));
			} catch {
				// Quota, private mode, or disabled storage can fail silently.
			}
		}, 300);
	}, []);

	useEffect(() => {
		return () => {
			if (persistTimerRef.current) {
				clearTimeout(persistTimerRef.current);
			}
		};
	}, []);

	return {
		containerRef,
		desktopLayout,
		handleDesktopLayoutChange,
		showStackedLayout: !mounted || width <= 0 || width < SESSION_INTELLIGENCE_STACKED_BREAKPOINT_PX,
		width,
	};
};
