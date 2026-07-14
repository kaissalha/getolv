import type { MailFolder } from "@/hooks/use-mail-state";
import type { MailLabelSummary } from "@starter/app-store";

import type { ThreadItemData } from "./mail-thread-item";

export type MailThreadClassificationPatch = {
	classificationLabel: MailLabelSummary;
	labelIds: string[];
	threadId: string;
};

export type MailThreadListPage = {
	connectionEmail: string;
	connectionId: string;
	nextPageToken: string | null;
	threads: ThreadItemData[];
};

export type MailThreadListStreamChunk =
	| {
			page: MailThreadListPage;
			type: "threads";
	  }
	| {
			classifications: MailThreadClassificationPatch[];
			type: "classifications";
	  };

type MailThreadListStreamErrorChunk = {
	message: string;
	type: "error";
};

type MailThreadListStreamInput = {
	classifyUnlabeled?: boolean;
	connectionId: string;
	folder: MailFolder;
	maxResults: number;
	pageToken?: string;
	query?: string;
};

const getMailThreadListStreamChunk = ({ line }: { line: string }) => {
	const chunk = JSON.parse(line) as MailThreadListStreamChunk | MailThreadListStreamErrorChunk;

	if (chunk.type === "error") {
		throw new Error(chunk.message);
	}

	return chunk;
};

export const openMailThreadListStream = async ({
	input,
	signal,
}: {
	input: MailThreadListStreamInput;
	signal?: AbortSignal;
}) => {
	const response = await fetch("/api/mail/threads", {
		body: JSON.stringify(input),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to load mail threads");
	}

	if (!response.body) {
		throw new Error("Mail thread stream is unavailable");
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let bufferedText = "";

	const readNextChunk = async (): Promise<MailThreadListStreamChunk | null> => {
		while (true) {
			const lineBreakIndex = bufferedText.indexOf("\n");

			if (lineBreakIndex >= 0) {
				const line = bufferedText.slice(0, lineBreakIndex);
				bufferedText = bufferedText.slice(lineBreakIndex + 1);

				if (!line.trim()) {
					continue;
				}

				return getMailThreadListStreamChunk({ line });
			}

			const result = await reader.read();

			if (result.done) {
				const line = bufferedText.trim();
				bufferedText = "";

				return line ? getMailThreadListStreamChunk({ line }) : null;
			}

			bufferedText += decoder.decode(result.value, { stream: true });
		}
	};

	return {
		cancel: () => {
			return reader.cancel();
		},
		readNextChunk,
	};
};

export const readInitialMailThreadListPage = async ({
	input,
	signal,
}: {
	input: MailThreadListStreamInput;
	signal?: AbortSignal;
}) => {
	const stream = await openMailThreadListStream({ input, signal });

	try {
		while (true) {
			const chunk = await stream.readNextChunk();

			if (!chunk) {
				break;
			}

			if (chunk.type === "threads") {
				return chunk.page;
			}
		}
	} finally {
		void stream.cancel();
	}

	throw new Error("Mail thread stream ended before threads loaded");
};
