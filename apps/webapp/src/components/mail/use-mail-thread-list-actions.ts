"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { toast } from "@starter/ui/components/sonner";

import type { ThreadItemData } from "./mail-thread-item";
import { patchMailThreadStarState } from "./mail-thread-star-state";
import type { MailThreadInfiniteData } from "./use-mail-thread-list-query";

export type MailThreadBulkAction = "archive" | "markRead" | "markUnread" | "star" | "trash";

type UseMailThreadListActionsProps = {
	clearSelection: () => void;
	connectionId?: string;
	listQueryKey: readonly unknown[];
	selectedIds: Set<string>;
};

export const useMailThreadListActions = ({
	clearSelection,
	connectionId,
	listQueryKey,
	selectedIds,
}: UseMailThreadListActionsProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const t = useTranslations("mail");
	const tCommon = useTranslations("common");

	const invalidateList = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: trpc.mail.listThreads.queryKey() });
	}, [queryClient, trpc.mail.listThreads]);

	const updateThreadListQueries = useCallback(
		({ updateThreads }: { updateThreads: (threads: ThreadItemData[]) => ThreadItemData[] }) => {
			queryClient.setQueryData<MailThreadInfiniteData>(listQueryKey, (currentData) => {
				if (!currentData) {
					return currentData;
				}

				return {
					...currentData,
					pages: currentData.pages.map((page) => ({
						...page,
						threads: updateThreads(page.threads),
					})),
				};
			});
		},
		[listQueryKey, queryClient]
	);

	const removeThreadsOptimistically = useCallback(
		(ids: Set<string>) => {
			updateThreadListQueries({
				updateThreads: (threads) => threads.filter((thread) => !ids.has(thread.id)),
			});
		},
		[updateThreadListQueries]
	);

	const patchThreadsOptimistically = useCallback(
		(ids: Set<string>, patch: Partial<ThreadItemData>) => {
			updateThreadListQueries({
				updateThreads: (threads) =>
					threads.map((thread) => (ids.has(thread.id) ? { ...thread, ...patch } : thread)),
			});
		},
		[updateThreadListQueries]
	);

	const patchThreadStarsOptimistically = useCallback(
		({ ids, isStarred }: { ids: Set<string>; isStarred: boolean }) => {
			updateThreadListQueries({
				updateThreads: (threads) =>
					threads.map((thread) => {
						if (!ids.has(thread.id)) {
							return thread;
						}

						return patchMailThreadStarState({ isStarred, thread });
					}),
			});
		},
		[updateThreadListQueries]
	);

	const bulkArchiveMutation = useMutation(
		trpc.mail.archive.mutationOptions({
			onMutate: () => {
				removeThreadsOptimistically(selectedIds);
				const count = selectedIds.size;
				clearSelection();
				toast.success(t("bulkArchived", { count }));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const bulkTrashMutation = useMutation(
		trpc.mail.trash.mutationOptions({
			onMutate: () => {
				removeThreadsOptimistically(selectedIds);
				const count = selectedIds.size;
				clearSelection();
				toast.success(t("bulkTrashed", { count }));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const bulkStarMutation = useMutation(
		trpc.mail.star.mutationOptions({
			onMutate: () => {
				patchThreadStarsOptimistically({ ids: selectedIds, isStarred: true });
				toast.success(t("bulkStarred", { count: selectedIds.size }));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const bulkMarkReadMutation = useMutation(
		trpc.mail.markAsRead.mutationOptions({
			onMutate: () => {
				patchThreadsOptimistically(selectedIds, { isUnread: false });
				toast.success(t("bulkMarkedRead", { count: selectedIds.size }));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const bulkMarkUnreadMutation = useMutation(
		trpc.mail.markAsUnread.mutationOptions({
			onMutate: () => {
				patchThreadsOptimistically(selectedIds, { isUnread: true });
				const count = selectedIds.size;
				clearSelection();
				toast.success(t("bulkMarkedUnread", { count }));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const inlineArchive = useMutation(
		trpc.mail.archive.mutationOptions({
			onMutate: ({ threadIds }) => {
				removeThreadsOptimistically(new Set(threadIds));
				toast.success(t("archived"));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const inlineTrash = useMutation(
		trpc.mail.trash.mutationOptions({
			onMutate: ({ threadIds }) => {
				removeThreadsOptimistically(new Set(threadIds));
				toast.success(t("trashed"));
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const inlineToggleRead = useMutation(
		trpc.mail.markAsRead.mutationOptions({
			onMutate: ({ threadIds }) => {
				patchThreadsOptimistically(new Set(threadIds), { isUnread: false });
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const inlineStar = useMutation(
		trpc.mail.star.mutationOptions({
			onMutate: ({ threadIds }) => {
				patchThreadStarsOptimistically({ ids: new Set(threadIds), isStarred: true });
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const inlineUnstar = useMutation(
		trpc.mail.unstar.mutationOptions({
			onMutate: ({ threadIds }) => {
				patchThreadStarsOptimistically({ ids: new Set(threadIds), isStarred: false });
			},
			onSettled: () => invalidateList(),
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const handleBulkAction = useCallback(
		(action: MailThreadBulkAction) => {
			if (!connectionId || selectedIds.size === 0) {
				return;
			}

			const payload = { connectionId, threadIds: Array.from(selectedIds) };
			const mutations = {
				archive: bulkArchiveMutation,
				markRead: bulkMarkReadMutation,
				markUnread: bulkMarkUnreadMutation,
				star: bulkStarMutation,
				trash: bulkTrashMutation,
			};

			mutations[action].mutate(payload);
		},
		[
			bulkArchiveMutation,
			bulkMarkReadMutation,
			bulkMarkUnreadMutation,
			bulkStarMutation,
			bulkTrashMutation,
			connectionId,
			selectedIds,
		]
	);

	const getThreadActions = useCallback(
		({ isStarred, threadId }: { isStarred: boolean; threadId: string }) => {
			if (!connectionId) {
				return {};
			}

			const starPayload = { connectionId, threadIds: [threadId] };

			return {
				onArchive: () => inlineArchive.mutate({ connectionId, threadIds: [threadId] }),
				onToggleStar: () => {
					if (isStarred) {
						inlineUnstar.mutate(starPayload);
						return;
					}

					inlineStar.mutate(starPayload);
				},
				onToggleRead: () => inlineToggleRead.mutate({ connectionId, threadIds: [threadId] }),
				onTrash: () => inlineTrash.mutate({ connectionId, threadIds: [threadId] }),
			};
		},
		[connectionId, inlineArchive, inlineStar, inlineToggleRead, inlineTrash, inlineUnstar]
	);

	return {
		getThreadActions,
		handleBulkAction,
	};
};
