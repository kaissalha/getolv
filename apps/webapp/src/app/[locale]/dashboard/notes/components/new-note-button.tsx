"use client";

import React from "react";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { NEW_NOTE_ID, NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import { Button } from "@getolv/ui/components/button";

export const NewNoteButton = () => {
	const t = useTranslations("notes");
	const [, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);

	const handleNewNote = () => {
		setNoteId(NEW_NOTE_ID);
	};
	return (
		<Button onClick={handleNewNote} size='sm'>
			<PlusIcon />
			{t("newNote")}
		</Button>
	);
};
