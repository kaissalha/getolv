"use client";

import { Clock3Icon, LoaderIcon, LogOutIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Header } from "@/app/[locale]/dashboard/components/layout/header/header";
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@starter/ui/components/alert-dialog";
import { Button } from "@starter/ui/components/button";

type SessionHeaderProps = {
	elapsedActiveTime: string;
	title: string;
	isEnding: boolean;
	isEnded: boolean;
	isResuming: boolean;
	onEndSession: () => void;
	onResumeSession: () => void;
};

const SessionTimerChip = ({ elapsedActiveTime, isRunning }: { elapsedActiveTime: string; isRunning: boolean }) => {
	const t = useTranslations("scribe");

	return (
		<div
			aria-label={t("sessionTimerValue", { time: elapsedActiveTime })}
			aria-live='off'
			className='flex min-w-19 shrink-0 items-center gap-2 text-sm text-muted-foreground tabular-nums'
			role={isRunning ? "timer" : "status"}
			title={t("sessionTimerValue", { time: elapsedActiveTime })}
		>
			<Clock3Icon className='size-4 shrink-0 text-muted-foreground/90' aria-hidden />
			<span className='sr-only'>{t("sessionTimerLabel")}</span>
			<span className='whitespace-nowrap font-medium tracking-wide text-foreground/85'>{elapsedActiveTime}</span>
		</div>
	);
};

export const SessionHeader = ({
	elapsedActiveTime,
	title,
	isEnding,
	isEnded,
	isResuming,
	onEndSession,
	onResumeSession,
}: SessionHeaderProps) => {
	const t = useTranslations("scribe");
	const tCommon = useTranslations("common");

	return (
		<Header
			item={{ label: title }}
			className='border-b'
			actions={
				<>
					<SessionTimerChip elapsedActiveTime={elapsedActiveTime} isRunning={!isEnded} /> |
					{isResuming && (
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<LoaderIcon className='size-4 animate-spin' />
							{t("resumingSession")}
						</div>
					)}
					{isEnded && !isResuming && (
						<div className='flex items-center gap-2'>
							<Button size='sm' onClick={onResumeSession}>
								<RotateCcwIcon className='size-4' />
								{t("resumeSession")}
							</Button>
						</div>
					)}
					{isEnding && !isResuming && !isEnded && (
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<LoaderIcon className='size-4 animate-spin' />
							{t("endingSession")}
						</div>
					)}
					{!isResuming && !isEnded && !isEnding && (
						<AlertDialog>
							<AlertDialogTrigger
								render={
									<Button variant='outline' size='sm'>
										<LogOutIcon className='size-4' />
										{t("endSession")}
									</Button>
								}
							/>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{t("endSession")}</AlertDialogTitle>
									<AlertDialogDescription>{t("endSessionConfirm")}</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogClose render={<Button variant='outline'>{tCommon("cancel")}</Button>} />
									<AlertDialogClose
										onClick={onEndSession}
										render={<Button>{t("endSession")}</Button>}
									/>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</>
			}
		/>
	);
};
