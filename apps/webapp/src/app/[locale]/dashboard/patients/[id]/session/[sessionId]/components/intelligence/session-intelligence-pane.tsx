"use client";

import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { NoteWithMentions } from "@/components/notes/types";
import type { TranscriptTurn } from "@/components/patient-sessions/active-session-scribe-provider";

import { DiagnosisCard } from "./diagnosis-card";
import { LiveNoteCard } from "./live-note-card";
import { NotesCard } from "./notes-card";
import {
	type SessionIntelligenceCards,
	SessionIntelligenceGridLayout,
	SessionIntelligenceStackedLayout,
} from "./session-intelligence-layout";
import { TodosCard } from "./todos-card";
import { TranscribeCard } from "./transcribe-card";
import type { SessionIntelligence } from "./types";
import { useSessionIntelligenceLayout } from "./use-session-intelligence-layout";

type SessionIntelligencePaneProps = {
	completedTodoIds: string[];
	initialTranscriptTurns: TranscriptTurn[];
	intelligence: SessionIntelligence | null;
	isAnalyzing: boolean;
	isSessionEnded: boolean;
	onCompletedTodoIdsChange: (completedTodoIds: string[]) => void;
	patientNotes: NoteWithMentions[];
	sessionId: string;
};

export const SessionIntelligencePane = ({
	completedTodoIds,
	isSessionEnded,
	initialTranscriptTurns,
	onCompletedTodoIdsChange,
	patientNotes,
	sessionId,
	intelligence,
	isAnalyzing,
}: SessionIntelligencePaneProps) => {
	const t = useTranslations("sessionIntelligence");
	const { containerRef, desktopLayout, handleDesktopLayoutChange, showStackedLayout, width } =
		useSessionIntelligenceLayout();

	const todosEmpty = !intelligence?.todos?.length;
	const liveNoteEmpty = !intelligence?.liveNote;

	const cards: SessionIntelligenceCards = {
		transcribe: (
			<TranscribeCard
				isSessionEnded={isSessionEnded}
				initialTurns={initialTranscriptTurns}
				sessionId={sessionId}
			/>
		),
		liveNote: <LiveNoteCard text={intelligence?.liveNote ?? ""} loading={isAnalyzing && liveNoteEmpty} />,
		diagnosis: (
			<DiagnosisCard
				workingDx={intelligence?.workingDx ?? []}
				differentialDx={intelligence?.differentialDx ?? []}
				loading={isAnalyzing && !intelligence?.workingDx?.length}
			/>
		),
		todos: (
			<TodosCard
				todos={intelligence?.todos ?? []}
				completedTodoIds={completedTodoIds}
				disabled={isSessionEnded}
				loading={isAnalyzing && todosEmpty}
				onCompletedTodoIdsChange={onCompletedTodoIdsChange}
			/>
		),
		notes: <NotesCard notes={patientNotes} />,
	};

	return (
		<div className='flex h-full min-h-0 max-h-full flex-1 flex-col overflow-hidden'>
			{isAnalyzing && (
				<div className='flex shrink-0 items-center gap-2 border-b border-border/50 px-4 py-2 text-sm text-muted-foreground'>
					<LoaderIcon className='size-3.5 animate-spin' />
					{t("analyzing")}
				</div>
			)}

			<div className='min-h-0 flex-1 overflow-y-auto p-4 pb-36 sm:p-5 sm:pb-32'>
				<div ref={containerRef} className='min-w-0'>
					{showStackedLayout ? (
						<SessionIntelligenceStackedLayout cards={cards} />
					) : (
						<SessionIntelligenceGridLayout
							cards={cards}
							desktopLayout={desktopLayout}
							onLayoutChange={handleDesktopLayoutChange}
							width={width}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
