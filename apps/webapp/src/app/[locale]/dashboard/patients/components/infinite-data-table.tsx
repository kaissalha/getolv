import type { ComponentProps } from "react";

import InfiniteScroll from "react-infinite-scroller";

import { DataTable } from "@/components/data-table/data-table";

type InfiniteDataTableProps<TData> = {
	loadMore: () => void;
	hasNextPage?: boolean;
	useWindow?: boolean;
} & Omit<ComponentProps<typeof DataTable<TData>>, "paginationHidden">;

export const InfiniteDataTable = <TData,>({
	data,
	columns,
	loadMore,
	hasNextPage = false,
	totalCount,
	useWindow = true,
	showNoResults = false,
	...otherProps
}: InfiniteDataTableProps<TData>) => {
	return (
		<InfiniteScroll
			loadMore={loadMore}
			hasMore={hasNextPage}
			loader={
				<div className='p-2 text-center' key='loader'>
					<div className='inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
				</div>
			}
			useWindow={useWindow}
			threshold={500}
		>
			<DataTable
				data={data}
				columns={columns}
				showNoResults={showNoResults}
				totalCount={totalCount}
				{...otherProps}
			/>
		</InfiniteScroll>
	);
};
