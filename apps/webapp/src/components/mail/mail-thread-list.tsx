"use client";

import { MailEmptyState } from "./mail-empty-state";
import { MailThreadItemSkeleton } from "./mail-thread-item";
import { MailThreadSections } from "./mail-thread-sections";
import { MailThreadSelectionBar } from "./mail-thread-selection-bar";
import { useMailThreadListController } from "./use-mail-thread-list-controller";

type MailThreadListProps = {
	connectionId?: string;
	patientEmail?: string;
	compact?: boolean;
};

export const MailThreadList = ({ connectionId, patientEmail, compact = false }: MailThreadListProps) => {
	const {
		allSelected,
		clearSelection,
		getThreadActions,
		handleBulkAction,
		handleLoadMore,
		handleThreadClick,
		hasNextPage,
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
	} = useMailThreadListController({
		connectionId,
		patientEmail,
	});

	return (
		<div className='flex h-full flex-col'>
			{selectionMode && (
				<MailThreadSelectionBar
					allSelected={allSelected}
					onBulkAction={handleBulkAction}
					onClearSelection={clearSelection}
					onToggleSelectAll={toggleSelectAll}
					selectedCount={selectedIds.size}
				/>
			)}

			<div className='flex-1 overflow-y-auto'>
				{isLoading ? (
					<div>
						{Array.from({ length: 8 }).map((_, i) => (
							<MailThreadItemSkeleton key={i} compact={compact} />
						))}
					</div>
				) : threads.length === 0 ? (
					<MailEmptyState />
				) : (
					<MailThreadSections
						compact={compact}
						getThreadActions={getThreadActions}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						onLoadMore={handleLoadMore}
						onPrefetchThread={prefetchThread}
						onThreadClick={handleThreadClick}
						sections={sections}
						selectedIds={selectedIds}
						selectionMode={selectionMode}
						threadId={threadId}
						toggleSelection={toggleSelection}
					/>
				)}
			</div>
		</div>
	);
};

export const MailThreadListSkeleton = () => (
	<div className='flex h-full flex-col'>
		<div className='flex-1 overflow-y-auto'>
			{Array.from({ length: 50 }).map((_, i) => (
				<MailThreadItemSkeleton key={i} />
			))}
		</div>
	</div>
);
