"use client";

import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroller";

import { cn } from "@getolv/ui/lib/utils";

import { MailThreadItem } from "./mail-thread-item";
import type { MailThreadSection } from "./mail-thread-section-data";

type MailThreadSectionsProps = {
	compact: boolean;
	getThreadActions: ({ isStarred, threadId }: { isStarred: boolean; threadId: string }) => {
		onArchive?: () => void;
		onToggleStar?: () => void;
		onToggleRead?: () => void;
		onTrash?: () => void;
	};
	hasNextPage?: boolean;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
	onPrefetchThread: ({ id }: { id: string }) => void;
	onThreadClick: ({ id }: { id: string }) => void;
	sections: MailThreadSection[];
	selectedIds: Set<string>;
	selectionMode: boolean;
	threadId: string | null;
	toggleSelection: (id: string) => void;
};

export const MailThreadSections = ({
	compact,
	getThreadActions,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
	onPrefetchThread,
	onThreadClick,
	sections,
	selectedIds,
	selectionMode,
	threadId,
	toggleSelection,
}: MailThreadSectionsProps) => {
	const t = useTranslations("mail");

	return (
		<InfiniteScroll
			loadMore={onLoadMore}
			hasMore={Boolean(hasNextPage)}
			useWindow={false}
			threshold={400}
			loader={
				<div className='flex items-center justify-center py-4' key='loader'>
					{isFetchingNextPage && (
						<div className='size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
					)}
				</div>
			}
		>
			{sections.map((section, sectionIndex) => (
				<div key={section.key} className={cn(sectionIndex > 0 && "mt-6")}>
					<div className='sticky top-0 z-5 bg-background/90 px-4 pb-1.5 pt-2 text-sm font-semibold text-foreground backdrop-blur-sm'>
						{t(`sections.${section.key}` as "sections.today")}
					</div>
					{section.threads.map((thread) => {
						const threadActions = getThreadActions({ isStarred: thread.isStarred, threadId: thread.id });

						return (
							<MailThreadItem
								key={thread.id}
								thread={thread}
								isActive={threadId === thread.id}
								isSelected={selectedIds.has(thread.id)}
								selectionMode={selectionMode}
								compact={compact}
								onSelect={toggleSelection}
								onClick={() => onThreadClick({ id: thread.id })}
								onPointerEnter={() => onPrefetchThread({ id: thread.id })}
								onArchive={threadActions.onArchive}
								onTrash={threadActions.onTrash}
								onToggleStar={threadActions.onToggleStar}
								onToggleRead={threadActions.onToggleRead}
							/>
						);
					})}
				</div>
			))}
		</InfiniteScroll>
	);
};
