"use client";

import type { ReactNode } from "react";

import { ExternalLinkIcon, VideoIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@getolv/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@getolv/ui/components/credenza";
import { cn } from "@getolv/ui/lib/utils";

import type { CalendarEventWithMeta } from "../utils/calendar-utils";

type CalendarEventDetailDrawerProps = {
	event: CalendarEventWithMeta | null;
	open: boolean;
	isLoading?: boolean;
	onOpenChange: (open: boolean) => void;
};

const formatWhen = (event: CalendarEventWithMeta) => {
	if (event.start.dateTime && event.end.dateTime) {
		const start = new Date(event.start.dateTime);
		const end = new Date(event.end.dateTime);
		const opts: Intl.DateTimeFormatOptions = {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		};
		if (start.toDateString() === end.toDateString()) {
			return `${start.toLocaleString(undefined, opts)} – ${end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
		}
		return `${start.toLocaleString(undefined, opts)} – ${end.toLocaleString(undefined, opts)}`;
	}

	if (event.start.date) {
		const start = new Date(`${event.start.date}T12:00:00`);
		if (event.end?.date) {
			const endExclusive = new Date(`${event.end.date}T12:00:00`);
			const endInclusive = new Date(endExclusive);
			endInclusive.setDate(endInclusive.getDate() - 1);
			if (start.toDateString() === endInclusive.toDateString()) {
				return start.toLocaleDateString(undefined, {
					weekday: "short",
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			}
			return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} – ${endInclusive.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
		}
		return start.toLocaleDateString(undefined, {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	return null;
};

const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className='flex gap-3 px-4 py-2.5'>
		<span className='w-28 shrink-0 text-xs font-medium text-muted-foreground'>{label}</span>
		<div className='min-w-0 flex-1 text-sm text-foreground'>{children}</div>
	</div>
);

export const CalendarEventDetailDrawer = ({
	event,
	open,
	isLoading = false,
	onOpenChange,
}: CalendarEventDetailDrawerProps) => {
	const t = useTranslations("calendar.eventDetail");
	const tCommon = useTranslations("common");

	const title = event?.summary ?? t("noTitle");
	const when = event ? formatWhen(event) : null;
	const meetLink =
		event?.hangoutLink ?? event?.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video")?.uri;
	const isAllDay = Boolean(event?.start?.date && !event.start.dateTime);

	const statusLabel = (() => {
		if (!event?.status) return null;
		switch (event.status) {
			case "confirmed":
				return t("eventStatus.confirmed");
			case "tentative":
				return t("eventStatus.tentative");
			case "cancelled":
				return t("eventStatus.cancelled");
			default:
				return null;
		}
	})();

	const responseLabel = (response: NonNullable<CalendarEventWithMeta["attendees"]>[number]["responseStatus"]) => {
		switch (response) {
			case "needsAction":
				return t("response.needsAction");
			case "declined":
				return t("response.declined");
			case "tentative":
				return t("response.tentative");
			case "accepted":
				return t("response.accepted");
			default:
				return null;
		}
	};

	return (
		<Credenza type='drawer' side='right' open={open} onOpenChange={onOpenChange}>
			<CredenzaPortal>
				<CredenzaContent
					className={cn("flex min-h-0 w-full max-w-2xl flex-col overflow-hidden", "max-sm:max-h-[98dvh]")}
				>
					<CredenzaHeader className='flex shrink-0 min-w-0 flex-row items-start justify-between gap-4 border-b border-border/60 bg-background'>
						<div className='min-w-0 flex-1 overflow-hidden'>
							<div className='flex items-center gap-2'>
								{event?.calendarColor ? (
									<span
										className='size-3 shrink-0 rounded-full'
										style={{ backgroundColor: event.calendarColor }}
										aria-hidden
									/>
								) : null}
								<CredenzaTitle className='text-start'>{title}</CredenzaTitle>
							</div>
							{event?.calendarName ? (
								<p className='mt-1 truncate text-xs text-muted-foreground text-start'>
									{event.calendarName}
								</p>
							) : null}
						</div>
						<div className='flex shrink-0 flex-wrap items-center justify-end gap-1'>
							{meetLink ? (
								<Button variant='ghost' size='icon' className='size-8' title={t("joinVideo")} asChild>
									<a href={meetLink} target='_blank' rel='noopener noreferrer'>
										<VideoIcon className='size-4' />
									</a>
								</Button>
							) : null}
							{event?.htmlLink ? (
								<Button
									variant='ghost'
									size='icon'
									className='size-8'
									title={t("openInGoogle")}
									asChild
								>
									<a href={event.htmlLink} target='_blank' rel='noopener noreferrer'>
										<ExternalLinkIcon className='size-4' />
									</a>
								</Button>
							) : null}
							<CredenzaClose
								className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 shrink-0")}
								title={tCommon("close")}
							>
								<XIcon className='size-4' />
							</CredenzaClose>
						</div>
					</CredenzaHeader>

					<CredenzaBody
						scrollable={false}
						className='min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-0 [-webkit-overflow-scrolling:touch]'
					>
						{isLoading ? (
							<div className='flex items-center justify-center py-12'>
								<div className='size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
							</div>
						) : event ? (
							<div className='divide-y divide-border/30 border-b border-border/30 pb-6'>
								{when ? (
									<DetailRow label={t("when")}>
										<div className='space-y-0.5'>
											<p>{when}</p>
											{isAllDay ? (
												<p className='text-xs text-muted-foreground'>{t("allDay")}</p>
											) : null}
										</div>
									</DetailRow>
								) : null}

								{statusLabel ? <DetailRow label={t("status")}>{statusLabel}</DetailRow> : null}

								{event.location ? (
									<DetailRow label={t("location")}>
										<p className='whitespace-pre-wrap break-words'>{event.location}</p>
									</DetailRow>
								) : null}

								{event.organizer?.email || event.organizer?.displayName ? (
									<DetailRow label={t("organizer")}>
										{event.organizer.displayName && event.organizer.email
											? `${event.organizer.displayName} (${event.organizer.email})`
											: (event.organizer.displayName ?? event.organizer.email ?? "")}
									</DetailRow>
								) : null}

								{event.creator?.email || event.creator?.displayName ? (
									<DetailRow label={t("creator")}>
										{event.creator.displayName && event.creator.email
											? `${event.creator.displayName} (${event.creator.email})`
											: (event.creator.displayName ?? event.creator.email ?? "")}
									</DetailRow>
								) : null}

								{event.attendees && event.attendees.length > 0 ? (
									<DetailRow label={t("attendees")}>
										<ul className='space-y-1.5'>
											{event.attendees.map((a, index) => {
												const response = a.responseStatus
													? responseLabel(a.responseStatus)
													: null;
												return (
													<li key={`${a.email}-${index}`} className='break-words'>
														<span className='font-medium'>{a.displayName ?? a.email}</span>
														{response ? (
															<span className='ms-1 text-xs text-muted-foreground'>
																({response})
															</span>
														) : null}
													</li>
												);
											})}
										</ul>
									</DetailRow>
								) : null}

								{event.description ? (
									<DetailRow label={t("description")}>
										<p className='whitespace-pre-wrap break-words'>{event.description}</p>
									</DetailRow>
								) : null}

								{event.conferenceData?.conferenceSolution?.name ? (
									<DetailRow label={t("conference")}>
										{event.conferenceData.conferenceSolution.name}
									</DetailRow>
								) : null}

								{event.recurringEventId ? (
									<DetailRow label={t("recurring")}>
										<span className='text-muted-foreground'>{t("recurringHint")}</span>
									</DetailRow>
								) : null}

								{(event.created || event.updated) && (
									<>
										{event.created ? (
											<DetailRow label={t("created")}>
												{new Date(event.created).toLocaleString()}
											</DetailRow>
										) : null}
										{event.updated ? (
											<DetailRow label={t("updated")}>
												{new Date(event.updated).toLocaleString()}
											</DetailRow>
										) : null}
									</>
								)}
							</div>
						) : null}
					</CredenzaBody>
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};
