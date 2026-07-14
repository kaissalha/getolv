"use client";

import type { ReactNode } from "react";

import ReactGridLayout, { verticalCompactor } from "react-grid-layout";
import type { Layout } from "react-grid-layout";

import {
	SESSION_INTELLIGENCE_GRID_COLS,
	SESSION_INTELLIGENCE_GRID_CONTAINER_PADDING,
	SESSION_INTELLIGENCE_GRID_MARGIN,
	SESSION_INTELLIGENCE_GRID_ROW_HEIGHT,
	SESSION_INTELLIGENCE_RESIZE_HANDLES,
} from "./use-session-intelligence-layout";

export type SessionIntelligenceCards = {
	diagnosis: ReactNode;
	liveNote: ReactNode;
	notes: ReactNode;
	todos: ReactNode;
	transcribe: ReactNode;
};

type SessionIntelligenceGridLayoutProps = {
	cards: SessionIntelligenceCards;
	desktopLayout: Layout;
	onLayoutChange: (layout: Layout) => void;
	width: number;
};

const STACKED_CARD_KEYS = ["transcribe", "liveNote", "diagnosis", "todos", "notes"] as const;

export const SessionIntelligenceStackedLayout = ({ cards }: { cards: SessionIntelligenceCards }) => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5'>
			{STACKED_CARD_KEYS.map((key, i) => (
				<div
					key={key}
					className='animate-[fade-in-up] [animation-duration:350ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]'
					style={{ animationDelay: `${i * 50}ms` }}
				>
					{cards[key]}
				</div>
			))}
		</div>
	);
};

export const SessionIntelligenceGridLayout = ({
	cards,
	desktopLayout,
	onLayoutChange,
	width,
}: SessionIntelligenceGridLayoutProps) => {
	return (
		<ReactGridLayout
			layout={desktopLayout}
			width={width}
			gridConfig={{
				cols: SESSION_INTELLIGENCE_GRID_COLS,
				rowHeight: SESSION_INTELLIGENCE_GRID_ROW_HEIGHT,
				margin: SESSION_INTELLIGENCE_GRID_MARGIN,
				containerPadding: SESSION_INTELLIGENCE_GRID_CONTAINER_PADDING,
			}}
			dragConfig={{
				enabled: true,
				bounded: true,
				threshold: 3,
				cancel: "button, a, input, textarea, select, [role='button'], [role='link'], [role='checkbox'], [role='switch'], [role='textbox'], [role='combobox'], [contenteditable='true'], .react-resizable-handle",
			}}
			resizeConfig={{ enabled: true, handles: SESSION_INTELLIGENCE_RESIZE_HANDLES }}
			onLayoutChange={onLayoutChange}
			compactor={verticalCompactor}
			autoSize
			className='w-full'
		>
			<div key='transcribe'>{cards.transcribe}</div>
			<div key='liveNote'>{cards.liveNote}</div>
			<div key='diagnosis'>{cards.diagnosis}</div>
			<div key='todos'>{cards.todos}</div>
			<div key='notes'>{cards.notes}</div>
		</ReactGridLayout>
	);
};
