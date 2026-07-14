"use client";

import { useCallback, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { useMailState } from "@/hooks/use-mail-state";
import { useTRPC } from "@/lib/trpc";

import { groupMailThreadsByDate } from "./mail-thread-section-data";
import { MAIL_THREAD_ID_PARAM } from "./mail-url-state";
import { useMailThreadListActions } from "./use-mail-thread-list-actions";
import { useMailThreadListQuery } from "./use-mail-thread-list-query";
import { useMailThreadSelection } from "./use-mail-thread-selection";

type UseMailThreadListControllerProps = {
	connectionId?: string;
	patientEmail?: string;
};

export const useMailThreadListController = ({ connectionId, patientEmail }: UseMailThreadListControllerProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [threadId, setThreadId] = useQueryState(MAIL_THREAD_ID_PARAM, parseAsString);
	const {
		folder: { folder },
		search: { query },
	} = useMailState();

	const searchQuery = patientEmail ? `from:${patientEmail} OR to:${patientEmail}` : query;
	const shouldStreamClassifications = Boolean(connectionId) && (Boolean(patientEmail) || folder === "inbox");
	const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, listQueryKey, threads } = useMailThreadListQuery(
		{
			connectionId,
			folder,
			searchQuery,
			shouldStreamClassifications,
		}
	);
	const sections = useMemo(() => groupMailThreadsByDate({ threads }), [threads]);
	const { allSelected, clearSelection, selectedIds, selectionMode, toggleSelection, toggleSelectAll } =
		useMailThreadSelection({ threads });
	const { getThreadActions, handleBulkAction } = useMailThreadListActions({
		clearSelection,
		connectionId,
		listQueryKey,
		selectedIds,
	});

	const handleThreadClick = useCallback(
		({ id }: { id: string }) => {
			if (selectionMode) {
				toggleSelection(id);
				return;
			}

			void setThreadId(id);
		},
		[selectionMode, setThreadId, toggleSelection]
	);

	const prefetchThread = useCallback(
		({ id }: { id: string }) => {
			if (!connectionId) {
				return;
			}

			void queryClient.prefetchQuery(trpc.mail.getThread.queryOptions({ connectionId, threadId: id }));
		},
		[connectionId, queryClient, trpc.mail.getThread]
	);

	const handleLoadMore = useCallback(() => {
		if (isLoading || isFetchingNextPage || !hasNextPage) {
			return;
		}

		void fetchNextPage({ cancelRefetch: false });
	}, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

	return {
		allSelected,
		clearSelection,
		getThreadActions,
		handleBulkAction,
		handleLoadMore,
		handleThreadClick,
		hasNextPage: Boolean(hasNextPage),
		isFetchingNextPage,
		isLoading,
		prefetchThread,
		sections,
		selectedIds,
		selectionMode,
		threadId,
		threads,
		toggleSelection,
		toggleSelectAll,
	};
};
