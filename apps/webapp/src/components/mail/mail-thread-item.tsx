"use client";

import { ArchiveIcon, MailOpenIcon, StarIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { MailLabelSummary } from "@starter/app-store";
import { Button } from "@starter/ui/components/button";
import { Checkbox } from "@starter/ui/components/checkbox";
import { Skeleton } from "@starter/ui/components/skeleton";
import { cn } from "@starter/ui/lib/utils";

import { MailLabelBadge, MailLabelBadgeSkeleton } from "./mail-label-badge";

export type ThreadItemData = {
	classificationLabel?: MailLabelSummary | null;
	classificationLabelLoading?: boolean;
	id: string;
	labelIds: string[];
	subject: string;
	snippet: string;
	sender: { name?: string; email: string };
	receivedOn: string;
	isUnread: boolean;
	isStarred: boolean;
	messageCount?: number;
};

type MailThreadItemProps = {
	thread: ThreadItemData;
	isActive: boolean;
	isSelected?: boolean;
	selectionMode?: boolean;
	compact?: boolean;
	onSelect?: (id: string) => void;
	onClick: () => void;
	onPointerEnter?: () => void;
	onArchive?: () => void;
	onTrash?: () => void;
	onToggleStar?: () => void;
	onToggleRead?: () => void;
};

const formatTime = (dateStr: string) => {
	const date = new Date(dateStr);
	const now = new Date();
	const isToday = date.toDateString() === now.toDateString();

	if (isToday) {
		return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
	}

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	if (date.toDateString() === yesterday.toDateString()) {
		return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
	}

	return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getSenderListLabel = (sender: { name?: string; email: string }) => {
	const name = sender.name?.trim();
	if (name && name !== sender.email) {
		return `${name} ${sender.email}`;
	}
	return sender.email;
};

export const MailThreadItem = ({
	thread,
	isActive,
	isSelected = false,
	selectionMode = false,
	compact = false,
	onSelect,
	onClick,
	onPointerEnter,
	onArchive,
	onTrash,
	onToggleStar,
	onToggleRead,
}: MailThreadItemProps) => {
	const t = useTranslations("mail");
	const senderLabel = getSenderListLabel(thread.sender);
	const showCount = (thread.messageCount ?? 1) > 1;

	return (
		<div
			className={cn(
				"group relative flex w-full gap-3 px-4 py-4 transition-colors hover:bg-muted/60",
				"items-start",
				!compact && "md:flex-row md:items-center",
				isActive && "bg-muted",
				isSelected && "bg-primary/5"
			)}
			onPointerEnter={onPointerEnter}
		>
			{selectionMode && (
				<div className={cn("hidden w-4 shrink-0 items-center justify-center", !compact && "md:flex")}>
					<Checkbox
						aria-label={t("selectThread")}
						checked={isSelected}
						onCheckedChange={() => onSelect?.(thread.id)}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}

			{onToggleStar && (
				<div className={cn("flex shrink-0 items-start", !compact && "md:items-center")}>
					<Button
						variant='ghost'
						size='icon'
						className={cn(
							"size-7 text-muted-foreground opacity-100 transition-[color,opacity] duration-150 ease-out hover:text-yellow-500 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
							thread.isStarred && "text-yellow-500 opacity-100"
						)}
						aria-label={thread.isStarred ? t("unstar") : t("star")}
						title={thread.isStarred ? t("unstar") : t("star")}
						onClick={(e) => {
							e.stopPropagation();
							onToggleStar();
						}}
					>
						<StarIcon className={cn("size-3.5", thread.isStarred && "fill-yellow-400 text-yellow-400")} />
					</Button>
				</div>
			)}

			<button
				type='button'
				onClick={onClick}
				className={cn(
					"flex min-w-0 flex-1 cursor-pointer flex-col gap-1 text-start",
					!compact && "md:flex-row md:items-baseline md:gap-3"
				)}
			>
				<div
					className={cn(
						"flex w-full items-center justify-between gap-2",
						!compact && "md:w-60 md:min-w-60 md:max-w-60 md:shrink-0 md:justify-start"
					)}
				>
					<span className='flex min-w-0 items-center gap-1.5 truncate'>
						<span
							className={cn(
								"truncate text-sm leading-snug",
								thread.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
							)}
						>
							{senderLabel}
						</span>
						{showCount && (
							<span className='shrink-0 text-xs text-muted-foreground/70'>{thread.messageCount}</span>
						)}
					</span>
					<span
						className={cn(
							"shrink-0 text-end text-xs tabular-nums leading-snug text-muted-foreground",
							!compact && "md:hidden"
						)}
					>
						{formatTime(thread.receivedOn)}
					</span>
				</div>

				<span className={cn("flex min-w-0 flex-1 items-center gap-2", compact && "w-full")}>
					<span
						className={cn(
							"min-w-0 flex-1 truncate text-sm",
							!compact && "md:max-w-[45%] md:flex-none",
							thread.isUnread ? "font-medium text-foreground" : "text-foreground"
						)}
					>
						{thread.subject || t("noSubject")}
					</span>
					{thread.classificationLabel ? (
						<MailLabelBadge className='shrink-0' label={thread.classificationLabel} />
					) : (
						thread.classificationLabelLoading && <MailLabelBadgeSkeleton className='shrink-0' />
					)}
					<span
						className={cn("min-w-0 flex-1 truncate text-sm text-muted-foreground/70", compact && "hidden")}
					>
						{thread.snippet}
					</span>
				</span>
			</button>

			{!compact && (
				<div className='hidden shrink-0 items-center gap-1.5 ps-1 md:flex'>
					<span className='whitespace-nowrap text-xs tabular-nums leading-snug text-muted-foreground'>
						{formatTime(thread.receivedOn)}
					</span>
					{(onArchive || onTrash || onToggleRead) && (
						<div className='flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100'>
							{onToggleRead && (
								<Button
									variant='ghost'
									size='icon'
									className='size-7'
									aria-label={t("markRead")}
									title={t("markRead")}
									onClick={(e) => {
										e.stopPropagation();
										onToggleRead();
									}}
								>
									<MailOpenIcon className='size-3.5' />
								</Button>
							)}
							{onArchive && (
								<Button
									variant='ghost'
									size='icon'
									className='size-7'
									aria-label={t("archive")}
									title={t("archive")}
									onClick={(e) => {
										e.stopPropagation();
										onArchive();
									}}
								>
									<ArchiveIcon className='size-3.5' />
								</Button>
							)}
							{onTrash && (
								<Button
									variant='ghost'
									size='icon'
									className='size-7 text-muted-foreground hover:text-destructive'
									aria-label={t("moveToTrash")}
									title={t("moveToTrash")}
									onClick={(e) => {
										e.stopPropagation();
										onTrash();
									}}
								>
									<Trash2Icon className='size-3.5' />
								</Button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export const MailThreadItemSkeleton = ({ compact = false }: { compact?: boolean }) => (
	<div
		aria-hidden
		className={cn(
			"group relative flex w-full gap-3 px-4 py-2.5",
			"flex-col border-b border-border/30",
			!compact && "md:flex-row md:items-center md:border-b-0"
		)}
	>
		<div className={cn("flex min-w-0 flex-1 flex-col gap-1", !compact && "md:flex-row md:items-baseline md:gap-3")}>
			<div
				className={cn(
					"flex w-full items-center justify-between gap-2",
					!compact && "md:w-60 md:min-w-60 md:max-w-60 md:justify-start"
				)}
			>
				<Skeleton className='h-4 w-28' />
				<Skeleton className={cn("h-3 w-12 shrink-0", !compact && "md:hidden")} />
			</div>
			<div className='flex min-w-0 flex-1 items-baseline gap-2'>
				<Skeleton className={cn("h-4 min-w-0 flex-1", !compact && "md:max-w-[45%] md:flex-none md:shrink-0")} />
				<Skeleton className={cn("h-4 min-w-0 flex-1", compact && "hidden")} />
			</div>
		</div>
		{!compact && (
			<div className='hidden shrink-0 items-center gap-1.5 ps-1 md:flex'>
				<Skeleton className='h-3.5 w-14 shrink-0' />
				<div className='flex items-center gap-0.5 opacity-40'>
					<Skeleton className='size-7 rounded-md' />
					<Skeleton className='size-7 rounded-md' />
					<Skeleton className='size-7 rounded-md' />
				</div>
			</div>
		)}
	</div>
);
