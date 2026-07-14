"use client";

import { StickyNoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import {
	formatCopyCard,
	formatCopyField,
	formatCopyList,
	formatNoteMarkupForCopy,
	joinCopyLines,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import { NoteBody } from "@/components/notes/note-body";
import { NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import type { NoteWithMentions } from "@/components/notes/types";
import { useFormatRelativeDate } from "@/hooks/use-relative-date-formatter";

import { IntelligenceCard } from "./intelligence-card";

type NotesCardProps = {
	notes: NoteWithMentions[];
	loading?: boolean;
};

export const NotesCard = ({ notes, loading }: NotesCardProps) => {
	const t = useTranslations("sessionIntelligence");
	const tCommon = useTranslations("common");
	const formatRelativeDate = useFormatRelativeDate();
	const [, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);
	const getCopyValue = () =>
		formatCopyCard({
			title: t("notes"),
			sections: [
				formatCopyList({
					items: notes.slice(0, 5).map((note) =>
						joinCopyLines({
							sections: [
								formatNoteMarkupForCopy({ value: note.body }),
								formatCopyField({
									label: tCommon("fields.date"),
									value: new Intl.DateTimeFormat(undefined, {
										dateStyle: "medium",
									}).format(new Date(note.createdAt)),
								}),
							],
						})
					),
					emptyText: t("noNotes"),
				}),
			],
		});

	return (
		<IntelligenceCard
			title={t("notes")}
			icon={<StickyNoteIcon className='size-4' />}
			loading={loading}
			className='h-full min-h-0 w-full'
			getCopyValue={getCopyValue}
		>
			{notes.length > 0 ? (
				<ul className='list-outside list-disc space-y-1.5 ps-4 marker:text-muted-foreground'>
					{notes.slice(0, 5).map((note) => (
						<li key={note.id}>
							<button
								type='button'
								onClick={() => setNoteId(note.id)}
								className='flex w-full items-baseline gap-2 text-start text-sm hover:underline'
							>
								<span className='line-clamp-1 flex-1 leading-snug'>
									<NoteBody body={note.body} />
								</span>
								<span className='shrink-0 text-xs text-muted-foreground'>
									{formatRelativeDate(new Date(note.createdAt))}
								</span>
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className='text-sm text-muted-foreground'>{t("noNotes")}</p>
			)}
		</IntelligenceCard>
	);
};
