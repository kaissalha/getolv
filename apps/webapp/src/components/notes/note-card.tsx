"use client";

import { parseAsString, useQueryState } from "nuqs";

import { Card } from "@starter/ui/components/card";
import { Skeleton } from "@starter/ui/components/skeleton";

import { NoteBody } from "./note-body";
import { NOTE_ID_SEARCH_PARAM } from "./notes-url-state";
import type { NoteWithMentions } from "./types";

type NoteCardProps = {
	note: NoteWithMentions;
};

export const NoteCard = ({ note, index = 0 }: NoteCardProps & { index?: number }) => {
	const [, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);

	return (
		<Card
			className='min-h-40 cursor-pointer p-4 transition-[box-shadow,transform] duration-200 ease-out hover:shadow-md active:scale-98 animate-[fade-in-up] [animation-duration:350ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]'
			style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
			onClick={() => setNoteId(note.id)}
		>
			<p className='line-clamp-6 whitespace-pre-wrap text-sm'>
				<NoteBody body={note.body} />
			</p>
		</Card>
	);
};

export const NoteCardSkeleton = () => (
	<Card className='min-h-40 p-4'>
		<div className='space-y-2'>
			<Skeleton className='h-4 w-full' />
			<Skeleton className='h-4 w-full' />
			<Skeleton className='h-4 w-3/4' />
		</div>
	</Card>
);
