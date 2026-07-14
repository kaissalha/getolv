"use client";

import { StickyNoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { SearchableHeader } from "@/app/[locale]/dashboard/components/layout/searchable-header";

import { NewNoteButton } from "./new-note-button";

export const NotesPageHeader = () => {
	const tBreadcrumbs = useTranslations("breadcrumbs");
	const tNotes = useTranslations("notes");
	const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));

	return (
		<SearchableHeader
			icon={<StickyNoteIcon />}
			title={tBreadcrumbs("notes")}
			search={search}
			onSearchChange={(value) => setSearch(value || null)}
			searchPlaceholder={tNotes("search")}
			actions={<NewNoteButton />}
		/>
	);
};
