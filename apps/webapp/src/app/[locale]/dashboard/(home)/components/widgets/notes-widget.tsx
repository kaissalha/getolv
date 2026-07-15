"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon, StickyNoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { NoteBody } from "@/components/notes/note-body";
import { NEW_NOTE_ID, NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@getolv/ui/components/button";

import { BaseWidget } from "./base-widget";

export const NotesWidgetSkeleton = () => {
	const t = useTranslations("dashboard.widgets.notes");

	return (
		<BaseWidget title={t("title")} icon={<StickyNoteIcon className='size-3.5' />}>
			<div className='flex flex-col gap-2'>
				<div className='h-8 w-16 animate-pulse rounded bg-muted' />
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/5 animate-pulse rounded bg-muted' />
			</div>
		</BaseWidget>
	);
};

export const NotesWidget = () => {
	const t = useTranslations("dashboard.widgets.notes");
	const trpc = useTRPC();

	const { data, isLoading } = useQuery(trpc.notes.list.queryOptions({ pageSize: 3 }));

	const notes = data?.data ?? [];
	const total = data?.meta.totalData ?? 0;

	if (isLoading) return <NotesWidgetSkeleton />;

	return (
		<BaseWidget
			title={t("title")}
			icon={<StickyNoteIcon className='size-3.5' />}
			action={notes.length > 0 ? { label: t("viewAll"), href: "/dashboard/notes" } : undefined}
		>
			{!notes.length ? (
				<div className='flex flex-col items-start gap-2'>
					<p className='text-sm text-muted-foreground'>{t("empty")}</p>
					<Button type='button' variant='outline' size='sm' asChild>
						<Link href={`/dashboard/notes?${NOTE_ID_SEARCH_PARAM}=${NEW_NOTE_ID}`}>
							<PlusIcon className='size-3.5' />
							{t("addFirst")}
						</Link>
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-1'>
					<p className='mb-1 text-2xl font-normal text-foreground'>{t("total", { count: total })}</p>
					{notes.map((note) => (
						<Link
							key={note.id}
							href={`/dashboard/notes?${NOTE_ID_SEARCH_PARAM}=${encodeURIComponent(note.id)}`}
							className='flex items-center justify-between rounded-md md:p-1 text-sm transition-colors hover:bg-accent'
						>
							<span className='line-clamp-1 min-w-0'>
								<NoteBody body={note.body} />
							</span>
						</Link>
					))}
				</div>
			)}
		</BaseWidget>
	);
};
