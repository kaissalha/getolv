"use client";

import { ArchiveIcon, MailIcon, MailOpenIcon, StarIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import { Checkbox } from "@starter/ui/components/checkbox";

import type { MailThreadBulkAction } from "./use-mail-thread-list-actions";

type MailThreadSelectionBarProps = {
	allSelected: boolean;
	onBulkAction: (action: MailThreadBulkAction) => void;
	onClearSelection: () => void;
	onToggleSelectAll: () => void;
	selectedCount: number;
};

export const MailThreadSelectionBar = ({
	allSelected,
	onBulkAction,
	onClearSelection,
	onToggleSelectAll,
	selectedCount,
}: MailThreadSelectionBarProps) => {
	const t = useTranslations("mail");

	return (
		<div className='flex shrink-0 items-center gap-2 px-4 py-2'>
			<Checkbox
				aria-label={allSelected ? t("deselectAll") : t("selectAll")}
				checked={allSelected}
				onCheckedChange={onToggleSelectAll}
			/>
			<span className='text-sm font-medium'>{t("selected", { count: selectedCount })}</span>
			<div className='ms-auto flex items-center gap-1'>
				<Button
					variant='ghost'
					size='icon'
					className='size-7'
					aria-label={t("markRead")}
					title={t("markRead")}
					onClick={() => onBulkAction("markRead")}
				>
					<MailIcon className='size-3.5' />
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='size-7'
					aria-label={t("markUnread")}
					title={t("markUnread")}
					onClick={() => onBulkAction("markUnread")}
				>
					<MailOpenIcon className='size-3.5' />
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='size-7'
					aria-label={t("star")}
					title={t("star")}
					onClick={() => onBulkAction("star")}
				>
					<StarIcon className='size-3.5' />
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='size-7'
					aria-label={t("archive")}
					title={t("archive")}
					onClick={() => onBulkAction("archive")}
				>
					<ArchiveIcon className='size-3.5' />
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='size-7 text-muted-foreground hover:text-destructive'
					aria-label={t("moveToTrash")}
					title={t("moveToTrash")}
					onClick={() => onBulkAction("trash")}
				>
					<Trash2Icon className='size-3.5' />
				</Button>
				<Button
					variant='ghost'
					size='icon'
					className='size-7'
					aria-label={t("deselectAll")}
					onClick={onClearSelection}
				>
					<XIcon className='size-3.5' />
				</Button>
			</div>
		</div>
	);
};
