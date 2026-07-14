"use client";

import type { MailLabelSummary } from "@starter/app-store";

type ThreadClassificationCandidate = {
	classificationLabel?: MailLabelSummary | null;
	id: string;
	labelIds?: string[];
};

type MailThreadListPage = {
	threads: ThreadClassificationCandidate[];
};

type MailThreadInfiniteData = {
	pages: MailThreadListPage[];
	pageParams: unknown[];
};

type MailThreadListStreamData = Array<
	| {
			page: MailThreadListPage;
			type: "threads";
	  }
	| {
			classifications: unknown[];
			type: "classifications";
	  }
>;

const patchThreads = ({
	classificationLabel,
	labelIds,
	threadId,
	threads,
}: {
	classificationLabel: MailLabelSummary;
	labelIds?: string[];
	threadId: string;
	threads: ThreadClassificationCandidate[];
}) => {
	return threads.map((thread) => {
		if (thread.id !== threadId) {
			return thread;
		}

		return {
			...thread,
			classificationLabel,
			labelIds: labelIds ?? thread.labelIds,
		};
	});
};

const isThreadListPage = (value: unknown): value is MailThreadListPage => {
	return typeof value === "object" && value !== null && "threads" in value && Array.isArray(value.threads);
};

const isThreadInfiniteData = (value: unknown): value is MailThreadInfiniteData => {
	return (
		typeof value === "object" &&
		value !== null &&
		"pages" in value &&
		Array.isArray(value.pages) &&
		"pageParams" in value &&
		Array.isArray(value.pageParams)
	);
};

const isThreadListStreamData = (value: unknown): value is MailThreadListStreamData => {
	return (
		Array.isArray(value) &&
		value.some(
			(chunk) =>
				typeof chunk === "object" &&
				chunk !== null &&
				"type" in chunk &&
				chunk.type === "threads" &&
				"page" in chunk &&
				isThreadListPage(chunk.page)
		)
	);
};

export const patchThreadClassificationInQueryData = ({
	classificationLabel,
	data,
	labelIds,
	threadId,
}: {
	classificationLabel: MailLabelSummary;
	data: unknown;
	labelIds?: string[];
	threadId: string;
}) => {
	if (isThreadListStreamData(data)) {
		return data.map((chunk) => {
			if (chunk.type !== "threads") {
				return chunk;
			}

			return {
				...chunk,
				page: {
					...chunk.page,
					threads: patchThreads({
						classificationLabel,
						labelIds,
						threadId,
						threads: chunk.page.threads,
					}),
				},
			};
		});
	}

	if (isThreadInfiniteData(data)) {
		return {
			...data,
			pages: data.pages.map((page) => ({
				...page,
				threads: patchThreads({
					classificationLabel,
					labelIds,
					threadId,
					threads: page.threads,
				}),
			})),
		};
	}

	if (isThreadListPage(data)) {
		return {
			...data,
			threads: patchThreads({
				classificationLabel,
				labelIds,
				threadId,
				threads: data.threads,
			}),
		};
	}

	return data;
};
