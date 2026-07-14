"use client";

import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@starter/ui/components/button";
import { Dialog, DialogPopup } from "@starter/ui/components/dialog";
import { toast } from "@starter/ui/components/sonner";

import { MentionTextarea } from "./mention-textarea";
import { createMentionMarker, getMentionLabel, MENTION_PATTERN, parseMentions } from "./mention-utils";
import { NEW_NOTE_ID, NOTE_ID_SEARCH_PARAM } from "./notes-url-state";
import type { MentionOption, NoteWithMentions } from "./types";

type NoteEditorSessionProps = {
	note: NoteWithMentions | null;
	defaultMention: MentionOption | undefined;
	patients: Array<{ id: string; firstName: string; lastName: string }>;
	onSave: (data: { body: string; mentions: MentionOption[] }) => void;
	onDelete: () => void;
	onDismiss: () => void;
};

const NoteEditorSession = ({ note, defaultMention, patients, onSave, onDelete, onDismiss }: NoteEditorSessionProps) => {
	const t = useTranslations("notes");
	const tCommon = useTranslations("common");

	const [body, setBody] = useState(() => {
		if (note) return note.body;
		if (defaultMention) {
			return `${createMentionMarker(defaultMention.type, defaultMention.id, defaultMention.label)}\u00A0`;
		}
		return "";
	});

	const [mentions, setMentions] = useState<MentionOption[]>(() => {
		if (note) {
			return note.mentions.map((m) => ({
				id: m.resourceId,
				type: m.resourceType,
				label: getMentionLabel(m.resourceType, m.resourceId, patients, t(`mentions.${m.resourceType}`)),
			}));
		}
		if (defaultMention) return [defaultMention];
		return [];
	});
	const [initialBody] = useState(() => note?.body ?? "");

	const taggedItems = useMemo(() => {
		const parsed = parseMentions(body);
		const seen = new Set<string>();
		const items: Array<{ id: string; label: string; href: string }> = [];

		for (const mention of parsed) {
			const key = `${mention.type}:${mention.id}`;
			if (seen.has(key)) continue;
			seen.add(key);

			items.push({
				id: mention.id,
				label: mention.label,
				href: `/dashboard/patients/${mention.id}`,
			});
		}

		return items;
	}, [body]);

	const closeWithSave = () => {
		const trimmed = body.trim();
		const hasChanged = trimmed !== initialBody;
		const hasContent = trimmed.replace(new RegExp(MENTION_PATTERN.source, "g"), "").trim().length > 0;

		if (hasChanged && hasContent) {
			onSave({ body: trimmed, mentions });
		}
		onDismiss();
	};

	const handleDialogOpenChange = (nextOpen: boolean) => {
		if (nextOpen) return;
		closeWithSave();
	};

	return (
		<Dialog open onOpenChange={handleDialogOpenChange}>
			<DialogPopup showCloseButton={false} className='gap-0 overflow-hidden rounded-lg p-0 sm:max-w-xl'>
				<div className='p-4'>
					<MentionTextarea
						value={body}
						onChange={setBody}
						onMentionsChange={setMentions}
						patients={patients}
					/>
				</div>

				{taggedItems.length > 0 && (
					<div className='flex flex-wrap gap-2 px-4 pb-3'>
						{taggedItems.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								className='inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/60 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
							>
								<UserIcon className='size-3' />
								{item.label}
							</Link>
						))}
					</div>
				)}

				<div className='flex items-center justify-between p-3 pt-0'>
					{note ? (
						<Button
							variant='ghost'
							size='icon'
							onClick={onDelete}
							className='text-muted-foreground hover:text-destructive'
						>
							<Trash2Icon className='size-4' />
						</Button>
					) : (
						<div />
					)}
					<Button variant='ghost' onClick={closeWithSave}>
						{tCommon("save")}
					</Button>
				</div>
			</DialogPopup>
		</Dialog>
	);
};

type NoteEditorProps = {
	onSuccess?: () => void;
	patientId?: string;
	notes: NoteWithMentions[];
};

export const NoteEditor = ({ notes, onSuccess, patientId }: NoteEditorProps) => {
	const t = useTranslations("notes");
	const tCommon = useTranslations("common");
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [noteId, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);

	const { data: patientsData } = useQuery(trpc.patients.list.queryOptions({ pageSize: 100 }));

	const patients = useMemo(() => patientsData?.data ?? [], [patientsData?.data]);

	const selectedNote = useMemo<NoteWithMentions | null>(() => {
		if (!noteId || noteId === NEW_NOTE_ID) return null;
		return notes.find((n) => n.id === noteId) ?? null;
	}, [noteId, notes]);

	const defaultMention = useMemo(() => {
		if (!patientId) return undefined;
		const patient = patients.find((p) => p.id === patientId);
		if (!patient) return undefined;
		return { id: patient.id, type: "patient" as const, label: `${patient.firstName} ${patient.lastName}` };
	}, [patientId, patients]);

	const editorOpen = Boolean(noteId) && (noteId === NEW_NOTE_ID || selectedNote !== null);

	const invalidateNotes = () => queryClient.invalidateQueries({ queryKey: trpc.notes.list.queryKey() });

	const createMutation = useMutation(
		trpc.notes.create.mutationOptions({
			onSuccess: () => {
				toast.success(t("created"));
				invalidateNotes();
				onSuccess?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const updateMutation = useMutation(
		trpc.notes.update.mutationOptions({
			onSuccess: () => {
				toast.success(tCommon("saved"));
				invalidateNotes();
				onSuccess?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const deleteMutation = useMutation(
		trpc.notes.delete.mutationOptions({
			onSuccess: () => {
				toast.success(tCommon("deleted"));
				setNoteId(null);
				invalidateNotes();
				onSuccess?.();
			},
			onError: () => toast.error(tCommon("deleteFailed")),
		})
	);

	const handleSave = (data: { body: string; mentions: MentionOption[] }) => {
		const mentions = data.mentions.map((m) => ({ resourceType: m.type, resourceId: m.id }));
		const payload = { body: data.body, mentions };

		if (selectedNote) {
			updateMutation.mutate({ id: selectedNote.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	const handleDelete = () => {
		if (selectedNote) deleteMutation.mutate({ id: selectedNote.id });
	};

	if (!editorOpen || !noteId) return null;

	return (
		<NoteEditorSession
			key={noteId}
			note={selectedNote}
			defaultMention={selectedNote ? undefined : defaultMention}
			patients={patients}
			onSave={handleSave}
			onDelete={handleDelete}
			onDismiss={() => setNoteId(null)}
		/>
	);
};
