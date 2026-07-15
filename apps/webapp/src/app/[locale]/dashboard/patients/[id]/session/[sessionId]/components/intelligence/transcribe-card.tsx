"use client";

import { useCallback } from "react";

import { AudioLinesIcon, LoaderIcon, MicIcon, MicOffIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	formatCopyCard,
	formatCopyField,
	joinCopySections,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import {
	type TranscriptTurn,
	useActiveSessionScribe,
} from "@/components/patient-sessions/active-session-scribe-provider";
import type { ScribeSpeaker } from "@/hooks/scribe/use-scribe";
import { Badge } from "@getolv/ui/components/badge";
import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

import { IntelligenceCard } from "./intelligence-card";

const SPEAKER_BADGE_CLASS_NAMES = {
	practitioner: "border-foreground bg-foreground text-background",
	patient: "border-foreground bg-background text-foreground",
	unknown: "border-border bg-background text-muted-foreground",
} satisfies Record<ScribeSpeaker, string>;

type TranscribeCardProps = {
	isSessionEnded: boolean;
	initialTurns: TranscriptTurn[];
	sessionId: string;
};

export const TranscribeCard = ({ isSessionEnded, initialTurns, sessionId }: TranscribeCardProps) => {
	const t = useTranslations("scribe");
	const {
		currentSession,
		error,
		isPaused,
		isRecording,
		isUploading,
		pauseRecording,
		resumeRecording,
		speaker,
		startRecording,
		status,
		stopRecording,
		transcript,
		turns,
	} = useActiveSessionScribe();
	const isSharedSession = currentSession?.sessionId === sessionId;
	const displayTurns = isSharedSession && turns.length > 0 ? turns : initialTurns;
	const liveError = isSharedSession ? error : null;
	const liveSpeaker = isSharedSession ? speaker : null;
	const liveTranscript = isSharedSession ? transcript : "";
	const showUploading = isSharedSession && isUploading;

	const handleToggleRecording = useCallback(async () => {
		if (isRecording) {
			await stopRecording();
		} else {
			await startRecording();
		}
	}, [isRecording, startRecording, stopRecording]);

	const handleTogglePause = useCallback(() => {
		if (isPaused) {
			resumeRecording();
		} else {
			pauseRecording();
		}
	}, [isPaused, pauseRecording, resumeRecording]);

	const speakerLabel = (spk: ScribeSpeaker) => {
		if (spk === "practitioner") return t("practitioner");
		if (spk === "patient") return t("patient");
		return t("unknown");
	};

	const isActive = isSharedSession && (status === "recording" || status === "paused");
	const getCopyValue = () => {
		const transcriptSections = displayTurns.reduce<string[]>((items, turn) => {
			const formattedTurn = formatCopyField({
				label: speakerLabel(turn.speaker),
				value: turn.text,
			});

			if (formattedTurn) {
				items.push(formattedTurn);
			}

			return items;
		}, []);
		const liveTranscriptSection = formatCopyField({
			label: liveSpeaker ? speakerLabel(liveSpeaker) : t("listening"),
			value: liveTranscript,
		});

		return formatCopyCard({
			title: t("liveTranscript"),
			sections: [
				joinCopySections({
					sections: [...transcriptSections, liveTranscriptSection],
				}) || t("emptyTranscript"),
			],
		});
	};

	return (
		<IntelligenceCard
			title={t("liveTranscript")}
			icon={<AudioLinesIcon className='size-4' />}
			className='h-full min-h-0 w-full'
			getCopyValue={getCopyValue}
			badge={
				<div className='flex shrink-0 items-center gap-1.5'>
					{isActive && (
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={handleTogglePause}
							aria-label={isPaused ? t("resume") : t("pause")}
						>
							{isPaused ? <PlayIcon className='size-4' /> : <PauseIcon className='size-4' />}
						</Button>
					)}
					<Button
						type='button'
						variant={isActive ? "destructive" : "default"}
						size='sm'
						onClick={handleToggleRecording}
						disabled={!isSharedSession || status === "connecting" || isUploading || isSessionEnded}
						className='shrink-0 transition-colors'
						aria-label={isActive ? t("stopRecording") : t("startRecording")}
					>
						{isActive ? <MicOffIcon className='size-4' /> : <MicIcon className='size-4' />}
						{status === "connecting"
							? t("connecting")
							: isActive
								? t("stopRecording")
								: t("startRecording")}
					</Button>
				</div>
			}
		>
			<div className='flex flex-col'>
				{displayTurns.length === 0 && !liveTranscript && !showUploading && (
					<p className='text-sm text-muted-foreground'>{t("emptyTranscript")}</p>
				)}

				<div className='flex flex-col gap-3'>
					{displayTurns.map((turn) => (
						<div key={turn.id} className='flex justify-center'>
							<div className='flex w-full max-w-3xl items-center gap-3'>
								<Badge
									variant='outline'
									className={cn("shrink-0 text-xs", SPEAKER_BADGE_CLASS_NAMES[turn.speaker])}
								>
									{speakerLabel(turn.speaker)}
								</Badge>
								<p className='min-w-0 flex-1 wrap-break-word text-base leading-relaxed'>{turn.text}</p>
							</div>
						</div>
					))}

					{liveTranscript && (
						<div className='flex justify-center opacity-60'>
							<div className='flex w-full max-w-3xl items-center gap-3'>
								<Badge
									variant='outline'
									className={cn(
										"shrink-0 text-xs",
										SPEAKER_BADGE_CLASS_NAMES[liveSpeaker ?? "unknown"]
									)}
								>
									{liveSpeaker ? speakerLabel(liveSpeaker) : t("listening")}
								</Badge>
								<p className='min-w-0 flex-1 break-words text-base italic leading-relaxed'>
									{liveTranscript}
								</p>
							</div>
						</div>
					)}
				</div>

				{(showUploading || liveError) && (
					<div className='mt-3 shrink-0 border-t border-border/60 pt-3'>
						{showUploading && (
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<LoaderIcon className='size-4 animate-spin' />
								{t("uploading")}
							</div>
						)}
						{liveError && <p className='text-sm text-destructive'>{liveError.message}</p>}
					</div>
				)}
			</div>
		</IntelligenceCard>
	);
};
