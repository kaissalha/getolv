"use client";

import { PlusIcon, StickyNoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@getolv/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@getolv/ui/components/empty";

import { NEW_NOTE_ID, NOTE_ID_SEARCH_PARAM } from "./notes-url-state";

export const NotesEmptyState = () => {
	const t = useTranslations("notes");
	const [, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);

	return (
		<Empty className='h-full min-h-80 border-none'>
			<EmptyHeader>
				<div className='mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10'>
					<StickyNoteIcon className='size-8 text-primary' />
				</div>
				<EmptyTitle>{t("emptyState.title")}</EmptyTitle>
				<EmptyDescription>{t("emptyState.description")}</EmptyDescription>
			</EmptyHeader>
			<Button onClick={() => setNoteId(NEW_NOTE_ID)} size='lg'>
				<PlusIcon />
				{t("newNote")}
			</Button>
		</Empty>
	);
};
