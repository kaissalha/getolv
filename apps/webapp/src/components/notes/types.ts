import type { NoteMention, NoteMentionResourceType } from "@getolv/db";

export type NoteWithMentions = {
	id: string;
	organizationId: string;
	body: string;
	createdAt: string;
	updatedAt: string;
	mentions: NoteMention[];
};

export type MentionOption = {
	id: string;
	type: NoteMentionResourceType;
	label: string;
};
