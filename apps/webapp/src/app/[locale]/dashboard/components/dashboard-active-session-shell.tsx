"use client";

import { useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";

import { ArrowUpRightIcon, Clock3Icon, LoaderIcon, MicIcon, MicOffIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { getPatientSessionHref } from "@/components/patient-sessions/active-session-conflict-details";
import { useActiveSessionScribe } from "@/components/patient-sessions/active-session-scribe-provider";
import {
	type SessionTimingSnapshot,
	useSessionElapsedTime,
} from "@/components/patient-sessions/use-session-elapsed-time";
import type { ScribeSpeaker } from "@/hooks/scribe/use-scribe";
import { Link, usePathname } from "@/i18n/navigation";
import { Badge } from "@getolv/ui/components/badge";
import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

const ACTIVE_SESSION_ROUTE_PATTERN = /\/dashboard\/patients\/[^/]+\/session\/[^/]+(?:\/.*)?$/;

type ActiveSession = NonNullable<ReturnType<typeof useActiveSessionScribe>["activeSession"]>;

const ActiveSessionElapsedTime = ({ initialTiming }: { initialTiming: SessionTimingSnapshot }) => {
	const t = useTranslations("scribe");
	const { formattedElapsedActiveTime } = useSessionElapsedTime({
		initialTiming,
		isActive: true,
	});

	return (
		<div
			aria-label={t("sessionTimerValue", { time: formattedElapsedActiveTime })}
			aria-live='off'
			className='flex shrink-0 items-center gap-2 text-sm tabular-nums text-background/70'
			role='timer'
			title={t("sessionTimerValue", { time: formattedElapsedActiveTime })}
		>
			<Clock3Icon className='size-4 shrink-0 text-background/60' aria-hidden />
			<span className='sr-only'>{t("sessionTimerLabel")}</span>
			<span className='whitespace-nowrap font-medium tracking-wide text-background/85'>
				{formattedElapsedActiveTime}
			</span>
		</div>
	);
};

const getSpeakerLabel = ({
	patientLabel,
	practitionerLabel,
	speaker,
	unknownLabel,
}: {
	patientLabel: string;
	practitionerLabel: string;
	speaker: ScribeSpeaker;
	unknownLabel: string;
}) => {
	if (speaker === "practitioner") {
		return practitionerLabel;
	}

	if (speaker === "patient") {
		return patientLabel;
	}

	return unknownLabel;
};

const getSpeakerBadgeClassName = ({ speaker }: { speaker: ScribeSpeaker | null }) => {
	if (speaker === "practitioner") {
		return "border-background/35 bg-background text-foreground";
	}

	if (speaker === "patient") {
		return "border-background/18 bg-foreground text-background";
	}

	return "border-background/18 bg-background/10 text-background/72";
};

const ActiveSessionScribePreview = ({ activeSessionId }: { activeSessionId: string }) => {
	const t = useTranslations("scribe");
	const { currentSession, isUploading, speaker, transcript, turns } = useActiveSessionScribe();
	const isSharedSession = currentSession?.sessionId === activeSessionId;
	const latestTurn = isSharedSession ? turns.at(-1) : null;
	const previewSpeaker = transcript ? speaker : (latestTurn?.speaker ?? null);
	const previewText = transcript || latestTurn?.text || "";

	if (!isSharedSession || (!previewText && !isUploading)) {
		return null;
	}

	return (
		<div className='hidden min-w-0 flex-1 items-center gap-2 overflow-hidden xl:flex'>
			<Badge
				variant='outline'
				className={cn("shrink-0 text-xs", getSpeakerBadgeClassName({ speaker: previewSpeaker }))}
			>
				{previewSpeaker
					? getSpeakerLabel({
							speaker: previewSpeaker,
							patientLabel: t("patient"),
							practitionerLabel: t("practitioner"),
							unknownLabel: t("unknown"),
						})
					: t("liveTranscript")}
			</Badge>
			{isUploading ? (
				<div className='flex min-w-0 items-center gap-2 text-sm text-background/70'>
					<LoaderIcon className='size-3.5 animate-spin' />
					<span className='truncate'>{t("uploading")}</span>
				</div>
			) : (
				<p className={cn("truncate text-sm text-background/72", transcript && "italic")}>{previewText}</p>
			)}
		</div>
	);
};

const ActiveSessionScribeControls = ({ activeSessionId }: { activeSessionId: string }) => {
	const t = useTranslations("scribe");
	const {
		currentSession,
		isPaused,
		isUploading,
		pauseRecording,
		resumeRecording,
		startRecording,
		status,
		stopRecording,
	} = useActiveSessionScribe();
	const isSharedSession = currentSession?.sessionId === activeSessionId;
	const isActive = isSharedSession && (status === "recording" || status === "paused");

	const handleToggleRecording = useCallback(async () => {
		if (isActive) {
			await stopRecording();
			return;
		}

		await startRecording();
	}, [isActive, startRecording, stopRecording]);

	const handleTogglePause = useCallback(() => {
		if (isPaused) {
			resumeRecording();
			return;
		}

		pauseRecording();
	}, [isPaused, pauseRecording, resumeRecording]);

	return (
		<div className='flex shrink-0 items-center gap-1.5'>
			{isActive && (
				<Button
					type='button'
					variant='ghost'
					size='icon-sm'
					onClick={handleTogglePause}
					className='text-background hover:bg-background/10 hover:text-background'
					aria-label={isPaused ? t("resume") : t("pause")}
				>
					{isPaused ? <PlayIcon className='size-4' /> : <PauseIcon className='size-4' />}
				</Button>
			)}
			<Button
				type='button'
				size='sm'
				variant={isActive ? "destructive" : "secondary"}
				onClick={handleToggleRecording}
				disabled={!isSharedSession || isUploading || status === "connecting"}
				aria-label={isActive ? t("stopRecording") : t("startRecording")}
			>
				{status === "connecting" ? (
					<LoaderIcon className='size-4 animate-spin' />
				) : isActive ? (
					<MicOffIcon className='size-4' />
				) : (
					<MicIcon className='size-4' />
				)}
				<span className='hidden lg:inline'>
					{status === "connecting" ? t("connecting") : isActive ? t("stopRecording") : t("startRecording")}
				</span>
			</Button>
		</div>
	);
};

const ActiveSessionBanner = ({ activeSession }: { activeSession: ActiveSession }) => {
	const locale = useLocale();
	const t = useTranslations("scribe");
	const tCommon = useTranslations("common");

	const patientName = [activeSession.patient?.firstName, activeSession.patient?.lastName].filter(Boolean).join(" ");

	const startedAt = new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(activeSession.createdAt));

	const sessionHref = getPatientSessionHref({
		patientId: activeSession.patientId,
		sessionId: activeSession.id,
	});

	return (
		<div className='z-60 flex h-14 shrink-0 items-center gap-3 bg-foreground px-4 text-background animate-[fade-in-up] motion-reduce:animate-none [animation-duration:250ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)] md:px-5'>
			<div className='flex min-w-0 flex-1 items-center gap-3 overflow-hidden'>
				<p className='truncate text-sm text-background/72'>
					{patientName ? <span className='font-medium text-background'>{patientName}</span> : null}
					{patientName ? (
						<span className='hidden px-2 text-background/25 lg:inline' aria-hidden>
							/
						</span>
					) : null}
					<span className='hidden lg:inline'>
						{tCommon("fields.startedAt")}: {startedAt}
					</span>
				</p>
				<ActiveSessionScribePreview activeSessionId={activeSession.id} />
			</div>
			<div className='flex shrink-0 items-center gap-2'>
				<ActiveSessionScribeControls activeSessionId={activeSession.id} />
				<ActiveSessionElapsedTime
					initialTiming={{
						activeSegmentStartedAt: activeSession.activeSegmentStartedAt,
						elapsedActiveSeconds: activeSession.elapsedActiveSeconds,
					}}
				/>
				<Button asChild size='sm' variant='secondary'>
					<Link href={sessionHref} aria-label={t("goToActiveSession")}>
						<ArrowUpRightIcon className='size-4' />
						<span className='hidden sm:inline'>{t("goToActiveSession")}</span>
					</Link>
				</Button>
			</div>
		</div>
	);
};

export const DashboardActiveSessionShell = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const { activeSession } = useActiveSessionScribe();
	const shouldShowBanner = Boolean(activeSession) && !ACTIVE_SESSION_ROUTE_PATTERN.test(pathname);

	if (!shouldShowBanner || !activeSession) {
		return children;
	}

	return (
		<div
			className='flex min-h-0 flex-1 flex-col overflow-hidden bg-foreground'
			style={{ "--sidebar-inset-top": "3.5rem" } as CSSProperties}
		>
			<ActiveSessionBanner activeSession={activeSession} />
			<div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-2xl bg-background'>{children}</div>
		</div>
	);
};
