"use client";

import { useCallback, useState } from "react";

import type { ThreadItemData } from "./mail-thread-item";

export const useMailThreadSelection = ({ threads }: { threads: ThreadItemData[] }) => {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const selectionMode = selectedIds.size > 0;
	const allSelected = threads.length > 0 && threads.every((thread) => selectedIds.has(thread.id));

	const toggleSelection = useCallback((id: string) => {
		setSelectedIds((currentSelectedIds) => {
			const nextSelectedIds = new Set(currentSelectedIds);

			if (nextSelectedIds.has(id)) {
				nextSelectedIds.delete(id);
				return nextSelectedIds;
			}

			nextSelectedIds.add(id);
			return nextSelectedIds;
		});
	}, []);

	const toggleSelectAll = useCallback(() => {
		if (allSelected) {
			setSelectedIds(new Set());
			return;
		}

		setSelectedIds(new Set(threads.map((thread) => thread.id)));
	}, [allSelected, threads]);

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	return {
		allSelected,
		clearSelection,
		selectedIds,
		selectionMode,
		toggleSelection,
		toggleSelectAll,
	};
};
