"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import type { NoteMentionResourceType } from "@getolv/db";
import { Empty, EmptyHeader, EmptyTitle } from "@getolv/ui/components/empty";

import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";
import { NotesEmptyState } from "./notes-empty-state";
import { NotesGridSkeleton } from "./notes-grid-skeleton";

type NotesGridProps = {
	resourceType?: NoteMentionResourceType;
	resourceId?: string;
	patientId?: string;
};

export const NotesGrid = ({ resourceType, resourceId, patientId }: NotesGridProps) => {
	const trpc = useTRPC();
	const t = useTranslations("notes");
	const [search] = useQueryState("q", parseAsString.withDefault(""));

	const { data: notesData, isLoading } = useQuery(
		trpc.notes.list.queryOptions({ pageSize: 100, resourceType, resourceId, search })
	);

	if (isLoading) return <NotesGridSkeleton />;

	const notes = notesData?.data ?? [];

	return (
		<div className='flex flex-1 flex-col'>
			{!notes.length ? (
				search ? (
					<div className='px-4 md:px-5'>
						<Empty className='h-full min-h-80 border-none'>
							<EmptyHeader>
								<div className='mb-6 flex size-16 items-center justify-center rounded-full bg-muted'>
									<SearchIcon className='size-8 text-muted-foreground' />
								</div>
								<EmptyTitle>{t("noSearchResults")}</EmptyTitle>
							</EmptyHeader>
						</Empty>
					</div>
				) : (
					<NotesEmptyState />
				)
			) : (
				<div className='px-4 md:px-5'>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{notes.map((note, index) => (
							<NoteCard key={note.id} note={note} index={index} />
						))}
					</div>
				</div>
			)}

			<NoteEditor notes={notes} patientId={patientId} />
		</div>
	);
};
