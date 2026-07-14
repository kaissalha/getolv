"use client";

import { ArchiveIcon, MailOpenIcon, ReplyIcon, StarIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";

type MailThreadDetailToolbarProps = {
	isStarred: boolean;
	onArchive: () => void;
	onClose?: () => void;
	onMarkUnread: () => void;
	onReply: () => void;
	onToggleStar: () => void;
	onTrash: () => void;
	showClose?: boolean;
};

export const MailThreadDetailToolbar = ({
	isStarred,
	onArchive,
	onClose,
	onMarkUnread,
	onReply,
	onToggleStar,
	onTrash,
	showClose = false,
}: MailThreadDetailToolbarProps) => {
	const t = useTranslations("mail");
	const tCommon = useTranslations("common");

	return (
		<div className='flex shrink-0 items-center gap-1'>
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				aria-label={t("reply")}
				title={t("reply")}
				onClick={onReply}
			>
				<ReplyIcon className='size-4' />
			</Button>
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				aria-label={isStarred ? t("unstar") : t("star")}
				title={isStarred ? t("unstar") : t("star")}
				onClick={onToggleStar}
			>
				<StarIcon className={isStarred ? "size-4 fill-yellow-400 text-yellow-400" : "size-4"} />
			</Button>
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				aria-label={t("archive")}
				title={t("archive")}
				onClick={onArchive}
			>
				<ArchiveIcon className='size-4' />
			</Button>
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				aria-label={t("markUnread")}
				title={t("markUnread")}
				onClick={onMarkUnread}
			>
				<MailOpenIcon className='size-4' />
			</Button>
			<Button
				variant='ghost'
				size='icon'
				className='size-8 text-muted-foreground hover:text-destructive'
				aria-label={t("moveToTrash")}
				title={t("moveToTrash")}
				onClick={onTrash}
			>
				<Trash2Icon className='size-4' />
			</Button>
			{showClose && onClose && (
				<>
					<div className='mx-1 h-6 w-px bg-border/60' />
					<Button
						variant='ghost'
						size='icon'
						className='size-8'
						aria-label={tCommon("close")}
						title={tCommon("close")}
						onClick={onClose}
					>
						<XIcon className='size-4' />
					</Button>
				</>
			)}
		</div>
	);
};
