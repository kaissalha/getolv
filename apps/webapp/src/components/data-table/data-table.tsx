"use client";

import { useId } from "react";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	type Updater,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@starter/ui/components/table";
import { cn } from "@starter/ui/lib/utils";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableSelectionToolbar } from "./data-table-selection-toolbar";
import { DataTableToolbar } from "./data-table-toolbar";

type DataTableProps<TData> = {
	cellClassName?: string;
	data: TData[];
	columns: ColumnDef<TData>[];
	pageCount?: number;
	totalCount: number;
	pagination?: PaginationState;
	onPaginationChange?: (updater: Updater<PaginationState>) => void;
	sorting?: SortingState;
	onSortingChange?: (updater: Updater<SortingState>) => void;
	columnVisibility?: Record<string, boolean>;
	onColumnVisibilityChange?: (updater: Updater<Record<string, boolean>>) => void;
	searchableColumnId?: string;
	filterableColumns?: {
		columnId: string;
		options: Record<string, boolean>;
	}[];
	showNoResults?: boolean;
	noResultsMessage?: string;
	showToolbar?: boolean;
	showPagination?: boolean;
	showSelectionToolbar?: boolean;
	isLoading?: boolean;
	filters?: Record<string, Record<string, boolean>>;
	toggleFilter?: (columnId: string, value: string) => void;
	search?: string;
	onSearchChange?: (search: string) => void;
	onRowClick?: (row: TData) => void;
	onExportSelected?: (data: TData[], exportAll: boolean) => void;
	onDeleteSelected?: (data: TData[], deleteAll: boolean) => void;
	"data-testid"?: string;
};

type ColumnMeta = {
	className?: string;
};

export const DataTable = <TData,>({
	cellClassName,
	data,
	columns,
	pageCount = -1,
	totalCount,
	pagination = { pageIndex: 0, pageSize: 10 },
	onPaginationChange,
	sorting,
	onSortingChange,
	columnVisibility,
	onColumnVisibilityChange,
	searchableColumnId,
	filterableColumns = [],
	showNoResults = true,
	noResultsMessage = "No results found.",
	showToolbar = false,
	showPagination = false,
	showSelectionToolbar = false,
	isLoading = false,
	filters = {},
	toggleFilter,
	search,
	onSearchChange,
	onRowClick,
	onExportSelected,
	onDeleteSelected,
	"data-testid": testId,
}: DataTableProps<TData>) => {
	"use no memo";
	const id = useId();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange,
		enableSorting: data.length > 0,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange,
		onColumnVisibilityChange,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		state: {
			sorting,
			pagination,
			columnVisibility,
			globalFilter: search,
			columnFilters: Object.entries(filters).map(([id, values]) => ({
				id,
				value: values,
			})),
		},
		onGlobalFilterChange: onSearchChange,
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		pageCount,
	});

	return (
		<>
			{showToolbar && (
				<DataTableToolbar
					table={table}
					searchableColumnId={searchableColumnId}
					filterableColumns={filterableColumns}
					search={search}
					onSearchChange={onSearchChange}
					filters={filters}
					toggleFilter={toggleFilter}
				/>
			)}

			{showSelectionToolbar && (
				<DataTableSelectionToolbar
					table={table}
					selectedRows={table.getSelectedRowModel().rows}
					totalCount={totalCount}
					onExport={onExportSelected}
					onDelete={onDeleteSelected}
				/>
			)}

			<Table data-testid={testId}>
				<TableHeader className='sticky top-0 z-10 bg-background after:absolute after:inset-x-0 after:bottom-0 after:border-b after:border-border'>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className='hover:bg-transparent'>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										style={{
											width: `${header.getSize()}px`,
											minWidth: `${header.getSize()}px`,
										}}
										className={cn(
											cellClassName,
											(header.column.columnDef.meta as ColumnMeta)?.className
										)}
									>
										{header.isPlaceholder ? null : (
											<div
												className={cn(
													"group flex h-full w-max items-center justify-between gap-2",
													header.column.getCanSort() &&
														"cursor-pointer select-none hover:text-foreground"
												)}
												onClick={header.column.getToggleSortingHandler()}
												onKeyDown={(e) => {
													if (
														header.column.getCanSort() &&
														(e.key === "Enter" || e.key === " ")
													) {
														e.preventDefault();
														header.column.getToggleSortingHandler()?.(e);
													}
												}}
												tabIndex={header.column.getCanSort() ? 0 : undefined}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getCanSort() && (
													<>
														{{
															asc: (
																<ArrowUpIcon
																	className='h-5 w-5 shrink-0'
																	aria-hidden='true'
																/>
															),
															desc: (
																<ArrowDownIcon
																	className='h-5 w-5 shrink-0'
																	aria-hidden='true'
																/>
															),
														}[(header.column.getIsSorted() as string) ?? "default"] ?? (
															<ArrowUpDownIcon
																className='invisible h-5 w-5 shrink-0 text-foreground group-hover:visible'
																aria-hidden='true'
															/>
														)}
													</>
												)}
											</div>
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading ? (
						// Skeleton loading state with consistent row height
						Array.from({ length: pagination.pageSize }).map((_, index) => (
							<TableRow key={`skeleton-${index}`} className='h-10'>
								{columns.map((column, cellIndex) => (
									<TableCell
										key={`skeleton-cell-${cellIndex}`}
										style={{
											width: column.size ? `${column.size}px` : "auto",
											minWidth: column.size ? `${column.size}px` : "auto",
										}}
										className={cn(
											cellClassName,
											(column.meta as ColumnMeta)?.className,
											"align-middle"
										)}
									>
										<div className='animate-pulse'>
											<div
												className={cn(
													"h-5 rounded-md bg-muted",
													column.id === "select" ? "w-5" : "w-3/4"
												)}
											/>
										</div>
									</TableCell>
								))}
							</TableRow>
						))
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className={onRowClick ? "cursor-pointer" : ""}
								onClick={() => onRowClick?.(row.original)}
								data-testid={`data-table-row-${row.index}`}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										style={{
											width: `${cell.column.getSize()}px`,
											minWidth: `${cell.column.getSize()}px`,
										}}
										className={cn(
											cellClassName,
											(cell.column.columnDef.meta as ColumnMeta)?.className
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : showNoResults ? (
						<TableRow className='pointer-events-none'>
							<TableCell colSpan={columns.length} className='text-center'>
								{noResultsMessage}
							</TableCell>
						</TableRow>
					) : null}
				</TableBody>
			</Table>

			{showPagination && <DataTablePagination id={id} table={table} totalCount={totalCount} />}
		</>
	);
};
