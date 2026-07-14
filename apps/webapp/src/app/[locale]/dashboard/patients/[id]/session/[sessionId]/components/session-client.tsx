"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { NoteEditor } from "@/components/notes/note-editor";
import {
	ActiveSessionConflictDetails,
	getPatientSessionHref,
} from "@/components/patient-sessions/active-session-conflict-details";
import type { TranscriptTurn } from "@/components/patient-sessions/active-session-scribe-provider";
import { useSessionElapsedTime } from "@/components/patient-sessions/use-session-elapsed-time";
import { useRouter } from "@/i18n/navigation";
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@starter/ui/components/alert-dialog";
import { Button } from "@starter/ui/components/button";

import { SessionHeader } from "./header";
import { IntelligencePromptBar } from "./intelligence/intelligence-prompt-bar";
import { SessionIntelligencePane } from "./intelligence/session-intelligence-pane";
import type { SessionIntelligence } from "./intelligence/types";
import { useSessionAnalysisController } from "./use-session-analysis-controller";
import { useSessionScribeSync } from "./use-session-scribe-sync";

type SessionClientProps = {
	initialActiveSegmentStartedAt: string | null;
	initialCompletedTodoIds: string[];
	initialElapsedActiveSeconds: number;
	initialMedicalKeyterms: string[];
	initialSessionStatus: "completed" | "in_progress";
	sessionId: string;
	patientId: string;
	organizationId: string;
	patientName: string;
	initialIntelligence: SessionIntelligence | null;
	initialTranscriptTurns: TranscriptTurn[];
};

export const SessionClient = ({
	initialActiveSegmentStartedAt,
	initialCompletedTodoIds,
	initialElapsedActiveSeconds,
	initialMedicalKeyterms,
	initialSessionStatus,
	sessionId,
	patientId,
	organizationId,
	patientName,
	initialIntelligence,
	initialTranscriptTurns,
}: SessionClientProps) => {
	const t = useTranslations("scribe");
	const tCommon = useTranslations("common");
	const router = useRouter();
	const {
		activeSession,
		handleConfirmResumeSession,
		handleCompletedTodoIdsChange,
		handleEndSession,
		handleIntelligencePrompt,
		handleResumeAlertOpenChange,
		handleResumeSession,
		handleTurnAppended,
		intelligence,
		completedTodoIds,
		isAnalyzing,
		isEnded,
		isEnding,
		isResumeAlertOpen,
		isResuming,
		isPromptDisabled,
		patientNotes,
		sessionTimingSnapshot,
	} = useSessionAnalysisController({
		initialCompletedTodoIds,
		initialIntelligence,
		initialSessionStatus,
		initialTranscriptTurns,
		patientId,
		patientName,
		sessionId,
	});

	useSessionScribeSync({
		initialSessionStatus,
		medicalKeyterms: initialMedicalKeyterms,
		initialTranscriptTurns,
		onTurnAppended: handleTurnAppended,
		organizationId,
		patientId,
		patientName,
		sessionId,
	});

	const { formattedElapsedActiveTime } = useSessionElapsedTime({
		initialTiming: {
			activeSegmentStartedAt: initialActiveSegmentStartedAt,
			elapsedActiveSeconds: initialElapsedActiveSeconds,
		},
		isActive: !isEnded,
		timingUpdate: sessionTimingSnapshot,
	});

	return (
		<div className='flex h-screen flex-col overflow-hidden'>
			<SessionHeader
				elapsedActiveTime={formattedElapsedActiveTime}
				title={patientName}
				isEnding={isEnding}
				isEnded={isEnded}
				isResuming={isResuming}
				onEndSession={handleEndSession}
				onResumeSession={handleResumeSession}
			/>
			<AlertDialog open={isResumeAlertOpen} onOpenChange={handleResumeAlertOpenChange}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("activeSessionTitle")}</AlertDialogTitle>
						<AlertDialogDescription>{t("activeSessionDescription")}</AlertDialogDescription>
						<ActiveSessionConflictDetails activeSession={activeSession ?? null} />
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={
								<Button variant='outline' disabled={isResuming}>
									{tCommon("cancel")}
								</Button>
							}
						/>
						{activeSession && (
							<Button
								variant='outline'
								disabled={isResuming}
								onClick={() => {
									handleResumeAlertOpenChange(false);
									router.push(
										getPatientSessionHref({
											patientId: activeSession.patientId,
											sessionId: activeSession.id,
										})
									);
								}}
							>
								<ArrowUpRightIcon className='size-4' />
								{t("goToActiveSession")}
							</Button>
						)}
						<Button onClick={handleConfirmResumeSession} disabled={isResuming}>
							{t("endPreviousSession")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className='relative flex min-h-0 flex-1 flex-col bg-muted/10'>
				<SessionIntelligencePane
					completedTodoIds={completedTodoIds}
					isSessionEnded={isEnded}
					initialTranscriptTurns={initialTranscriptTurns}
					onCompletedTodoIdsChange={handleCompletedTodoIdsChange}
					patientNotes={patientNotes}
					sessionId={sessionId}
					intelligence={intelligence}
					isAnalyzing={isAnalyzing}
				/>
				<IntelligencePromptBar onSubmit={handleIntelligencePrompt} disabled={isPromptDisabled} />
			</div>
			<NoteEditor notes={patientNotes} patientId={patientId} />
		</div>
	);
};
