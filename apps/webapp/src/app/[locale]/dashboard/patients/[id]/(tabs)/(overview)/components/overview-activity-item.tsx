"use client";

import type { LucideIcon } from "lucide-react";
import { DumbbellIcon, FileTextIcon, MailIcon, StickyNoteIcon, StethoscopeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { MAIL_THREAD_ID_PARAM } from "@/components/mail/mail-url-state";
import { NoteBody } from "@/components/notes/note-body";
import { NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import { useFormatRelativeDate } from "@/hooks/use-relative-date-formatter";
import type { RouterOutput } from "@getolv/server";
import { Button } from "@getolv/ui/components/button";
import {
	TimelineBadge,
	TimelineContent,
	TimelineDescription,
	TimelineItem,
	TimelineMarker,
	TimelineTime,
	TimelineTitle,
} from "@getolv/ui/components/timeline";

type PatientActivityItem = RouterOutput["patients"]["getActivityFeed"][number];

type OverviewActivityItemProps = {
	activity: PatientActivityItem;
	index: number;
	onOpen: (activity: PatientActivityItem) => void;
	onPreviewTreatmentPlan: ({ sessionId }: { sessionId: string }) => void;
	previewingSessionId: string | null;
};

const activityIcons = {
	email: MailIcon,
	"lab-report": FileTextIcon,
	note: StickyNoteIcon,
	session: StethoscopeIcon,
	"workout-plan": DumbbellIcon,
} satisfies Record<PatientActivityItem["type"], LucideIcon>;

const formatAbsoluteDate = ({ value }: { value: string }) => {
	const date = new Date(value);

	return new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
};

export const getActivityHref = ({ activity, patientId }: { activity: PatientActivityItem; patientId: string }) => {
	switch (activity.type) {
		case "email":
			return `/dashboard/patients/${patientId}/mail?${MAIL_THREAD_ID_PARAM}=${encodeURIComponent(activity.threadId)}`;
		case "lab-report":
			return `/dashboard/patients/${patientId}/labs?report=${encodeURIComponent(activity.id)}`;
		case "note":
			return `/dashboard/patients/${patientId}/notes?${NOTE_ID_SEARCH_PARAM}=${encodeURIComponent(activity.id)}`;
		case "session":
			return `/dashboard/patients/${patientId}/session/${activity.id}`;
		case "workout-plan":
			return `/dashboard/patients/${patientId}/workout?plan=${encodeURIComponent(activity.id)}`;
	}
};

export const OverviewActivityItem = ({
	activity,
	index,
	onOpen,
	onPreviewTreatmentPlan,
	previewingSessionId,
}: OverviewActivityItemProps) => {
	const t = useTranslations("dashboard.patients.overview");
	const formatRelativeDate = useFormatRelativeDate();
	const Icon = activityIcons[activity.type];
	let label = "";
	let title: string | null = null;
	let description = "";

	switch (activity.type) {
		case "email": {
			const fallbackSender = activity.senderName || activity.senderEmail;

			label = t("emailLabel");
			title = activity.subject || activity.senderName || activity.senderEmail || t("untitledEmail");
			description = activity.snippet || fallbackSender;
			break;
		}
		case "lab-report":
			label = t("labReportLabel");
			title = activity.patientSessionTitle || t("labReportTitle");
			description =
				activity.summary ||
				(activity.reportDate
					? t("reportDate", { date: formatAbsoluteDate({ value: activity.reportDate }) })
					: "");
			break;
		case "note":
			label = t("noteLabel");
			description = activity.body;
			break;
		case "session":
			label = t("sessionLabel");
			title = activity.title || t("untitledSession");
			description = activity.summary || "";
			break;
		case "workout-plan":
			label = t("workoutPlanLabel");
			title = activity.title || t("untitledWorkoutPlan");
			description = activity.summary || "";
			break;
	}

	const titleContent =
		title && activity.type === "session" ? (
			<div className='flex min-w-0 items-start justify-between gap-2'>
				<TimelineTitle className='min-w-0 flex-1' onClick={() => onOpen(activity)}>
					{title}
				</TimelineTitle>
				{activity.hasTreatmentPlan ? (
					<Button
						variant='ghost'
						size='icon-sm'
						className='-me-1 -mt-1 text-muted-foreground/70 hover:text-foreground'
						aria-label={t("previewTreatmentPlan")}
						title={t("previewTreatmentPlan")}
						loading={previewingSessionId === activity.id}
						onClick={(event) => {
							event.stopPropagation();
							onPreviewTreatmentPlan({ sessionId: activity.id });
						}}
					>
						<FileTextIcon className='size-4' />
					</Button>
				) : null}
			</div>
		) : title ? (
			<TimelineTitle onClick={() => onOpen(activity)}>{title}</TimelineTitle>
		) : null;

	return (
		<TimelineItem
			className='animate-[fade-in-up] [animation-duration:350ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]'
			style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
		>
			<TimelineMarker>
				<Icon className='size-4 text-foreground/70' />
			</TimelineMarker>
			<TimelineContent>
				<div className='flex flex-wrap items-center gap-2'>
					<TimelineBadge>{label}</TimelineBadge>
					<TimelineTime>{formatRelativeDate(new Date(activity.createdAt))}</TimelineTime>
				</div>
				{titleContent}
				{description ? (
					activity.type === "note" ? (
						<button
							type='button'
							className='block w-full text-start text-sm leading-relaxed text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground active:scale-99'
							onClick={() => onOpen(activity)}
						>
							<span className='line-clamp-3 whitespace-pre-wrap'>
								<NoteBody body={description} />
							</span>
						</button>
					) : (
						<TimelineDescription className='line-clamp-3 whitespace-pre-wrap'>
							{description}
						</TimelineDescription>
					)
				) : null}
			</TimelineContent>
		</TimelineItem>
	);
};
