"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import { Label } from "@starter/ui/components/label";
import { Pagination, PaginationContent, PaginationItem } from "@starter/ui/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@starter/ui/components/select";

type DataTablePaginationProps<TData> = {
	id: string;
	table: Table<TData>;
	totalCount: number;
};

export const DataTablePagination = <TData,>({ id, table, totalCount }: DataTablePaginationProps<TData>) => {
	"use no memo";
	const t = useTranslations("components.table");

	return (
		<div className='flex w-full items-center justify-between gap-8 bg-background px-8 py-2.5'>
			{/* Results per page */}
			<div className='flex items-center gap-3'>
				<Label htmlFor={id} className='max-sm:sr-only'>
					{t("rowsPerPage")}
				</Label>
				<Select
					value={table.getState().pagination.pageSize.toString()}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger id={id} className='w-fit whitespace-nowrap'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className='[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2'>
						{[5, 10, 25, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={pageSize.toString()}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Page number information */}
			<div className='flex grow justify-end whitespace-nowrap text-sm text-muted-foreground'>
				<p className='whitespace-nowrap text-sm text-muted-foreground' aria-live='polite'>
					<span className='text-foreground'>
						{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
						{t("dash")}
						{Math.min(
							Math.max(
								table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
									table.getState().pagination.pageSize,
								0
							),
							table.getRowCount()
						)}
					</span>{" "}
					{t("of")} <span className='text-foreground'>{totalCount.toString()}</span>
				</p>
			</div>

			{/* Pagination buttons */}
			<div>
				<Pagination>
					<PaginationContent>
						{/* First page button */}
						<PaginationItem>
							<Button
								size='icon'
								variant='secondary'
								onClick={() => table.firstPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label={t("firstPage")}
							>
								<ChevronFirst size={16} strokeWidth={2} aria-hidden='true' />
							</Button>
						</PaginationItem>
						{/* Previous page button */}
						<PaginationItem>
							<Button
								size='icon'
								variant='secondary'
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label={t("previousPage")}
							>
								<ChevronLeft size={16} strokeWidth={2} aria-hidden='true' />
							</Button>
						</PaginationItem>
						{/* Next page button */}
						<PaginationItem>
							<Button
								size='icon'
								variant='secondary'
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								aria-label={t("nextPage")}
							>
								<ChevronRight size={16} strokeWidth={2} aria-hidden='true' />
							</Button>
						</PaginationItem>
						{/* Last page button */}
						<PaginationItem>
							<Button
								size='icon'
								variant='secondary'
								onClick={() => table.lastPage()}
								disabled={!table.getCanNextPage()}
								aria-label={t("lastPage")}
							>
								<ChevronLast size={16} strokeWidth={2} aria-hidden='true' />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};
