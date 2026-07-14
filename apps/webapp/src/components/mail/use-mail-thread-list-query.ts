"use client";

import { useCallback, useMemo, useState } from "react";

import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

import type { MailFolder } from "@/hooks/use-mail-state";
import { useTRPC } from "@/lib/trpc";

import type { ThreadItemData } from "./mail-thread-item";
import {
	type MailThreadClassificationPatch,
	type MailThreadListPage,
	openMailThreadListStream,
} from "./mail-thread-list-stream";

const PAGE_SIZE = 15;

export type MailThreadInfiniteData = InfiniteData<MailThreadListPage, string | null>;

type UseMailThreadListQueryProps = {
	connectionId?: string;
	folder: MailFolder;
	searchQuery: string;
	shouldStreamClassifications: boolean;
};

const patchThreadClassifications = ({
	classifications,
	page,
}: {
	classifications: MailThreadClassificationPatch[];
	page: MailThreadListPage;
}) => {
	const classificationsByThreadId = new Map(
		classifications.map((classification) => [classification.threadId, classification])
	);

	return {
		...page,
		threads: page.threads.map((thread) => {
			const classification = classificationsByThreadId.get(thread.id);

			if (!classification) {
				return thread;
			}

			return {
				...thread,
				classificationLabel: classification.classificationLabel,
				labelIds: classification.labelIds,
			};
		}),
	} satisfies MailThreadListPage;
};

const patchThreadListClassifications = ({
	classificationPatchesByThreadId,
	threads,
}: {
	classificationPatchesByThreadId: Map<string, MailThreadClassificationPatch>;
	threads: ThreadItemData[];
}) => {
	return threads.map((thread) => {
		const classificationPatch = classificationPatchesByThreadId.get(thread.id);

		if (!classificationPatch) {
			return thread;
		}

		return {
			...thread,
			classificationLabel: classificationPatch.classificationLabel,
			labelIds: classificationPatch.labelIds,
		};
	});
};

export const useMailThreadListQuery = ({
	connectionId,
	folder,
	searchQuery,
	shouldStreamClassifications,
}: UseMailThreadListQueryProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [pendingThreadIds, setPendingThreadIds] = useState<Set<string>>(new Set());
	const [classificationPatchesByThreadId, setClassificationPatchesByThreadId] = useState<
		Map<string, MailThreadClassificationPatch>
	>(new Map());

	const listQueryKey = useMemo(
		() =>
			trpc.mail.listThreads.queryKey({
				classifyUnlabeled: shouldStreamClassifications,
				connectionId: connectionId ?? "",
				folder,
				maxResults: PAGE_SIZE,
				query: searchQuery,
			}),
		[connectionId, folder, searchQuery, shouldStreamClassifications, trpc.mail.listThreads]
	);

	const addPendingThreadIds = useCallback((threadIds: string[]) => {
		setPendingThreadIds((currentThreadIds) => {
			const nextThreadIds = new Set(currentThreadIds);
			threadIds.forEach((id) => nextThreadIds.add(id));
			return nextThreadIds;
		});
	}, []);

	const removePendingThreadIds = useCallback((threadIds: string[]) => {
		setPendingThreadIds((currentThreadIds) => {
			const nextThreadIds = new Set(currentThreadIds);
			threadIds.forEach((id) => nextThreadIds.delete(id));
			return nextThreadIds;
		});
	}, []);

	const mergeClassificationPatches = useCallback((classifications: MailThreadClassificationPatch[]) => {
		setClassificationPatchesByThreadId((currentPatchesByThreadId) => {
			const nextPatchesByThreadId = new Map(currentPatchesByThreadId);
			classifications.forEach((classification) => {
				nextPatchesByThreadId.set(classification.threadId, classification);
			});
			return nextPatchesByThreadId;
		});
	}, []);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: listQueryKey,
		queryFn: async ({ pageParam }) => {
			if (!connectionId) {
				throw new Error("Mail connection is required");
			}

			const pageToken = pageParam ?? null;
			const stream = await openMailThreadListStream({
				input: {
					classifyUnlabeled: shouldStreamClassifications,
					connectionId,
					folder,
					maxResults: PAGE_SIZE,
					pageToken: pageToken ?? undefined,
					query: searchQuery,
				},
			});

			while (true) {
				const chunk = await stream.readNextChunk();

				if (!chunk) {
					break;
				}

				if (chunk.type !== "threads") {
					continue;
				}

				const page = chunk.page;
				const pendingIds = shouldStreamClassifications
					? page.threads.filter((thread) => !thread.classificationLabel).map((thread) => thread.id)
					: [];

				if (pendingIds.length === 0) {
					void stream.cancel();
					return page;
				}

				addPendingThreadIds(pendingIds);
				void (async () => {
					try {
						while (true) {
							const classificationChunk = await stream.readNextChunk();

							if (!classificationChunk) {
								return;
							}

							if (classificationChunk.type !== "classifications") {
								continue;
							}

							const classifications = classificationChunk.classifications;
							mergeClassificationPatches(classifications);
							queryClient.setQueryData<MailThreadInfiniteData>(listQueryKey, (currentData) => {
								if (!currentData) {
									return currentData;
								}

								return {
									...currentData,
									pages: currentData.pages.map((currentPage, index) => {
										if (currentData.pageParams[index] !== pageToken) {
											return currentPage;
										}

										return patchThreadClassifications({ classifications, page: currentPage });
									}),
								};
							});
							removePendingThreadIds(classifications.map((classification) => classification.threadId));
						}
					} catch {
						return;
					} finally {
						removePendingThreadIds(pendingIds);
						void stream.cancel();
					}
				})();

				return page;
			}

			throw new Error("Mail thread stream ended before threads loaded");
		},
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextPageToken,
		enabled: Boolean(connectionId),
		refetchOnWindowFocus: false,
		staleTime: 60_000,
	});

	const baseThreads = useMemo(() => data?.pages.flatMap((page) => page.threads) ?? [], [data]);
	const threadsWithClassificationLabels = useMemo(
		() => patchThreadListClassifications({ classificationPatchesByThreadId, threads: baseThreads }),
		[baseThreads, classificationPatchesByThreadId]
	);
	const threads = useMemo(
		() =>
			threadsWithClassificationLabels.map((thread) => ({
				...thread,
				classificationLabelLoading: !thread.classificationLabel && pendingThreadIds.has(thread.id),
			})),
		[pendingThreadIds, threadsWithClassificationLabels]
	);

	return {
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		listQueryKey,
		threads,
	};
};
