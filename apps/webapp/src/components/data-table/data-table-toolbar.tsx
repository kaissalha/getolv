"use client";

import { useRef } from "react";

import type { Table } from "@tanstack/react-table";
import { CircleAlert, CircleX, Columns3, Filter, ListFilter, Trash } from "lucide-react";
import { type MessageKeys, useTranslations } from "next-intl";

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@getolv/ui/components/alert-dialog";
import { Button } from "@getolv/ui/components/button";
import { Checkbox } from "@getolv/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@getolv/ui/components/dropdown-menu";
import { Input } from "@getolv/ui/components/input";
import { Label } from "@getolv/ui/components/label";
import { cn } from "@getolv/ui/lib/utils";

type DataTableToolbarProps<TData> = {
	table: Table<TData>;
	searchableColumnId?: string;
	filterableColumns?: {
		columnId: string;
		options: Record<string, boolean>;
	}[];
	search?: string;
	onSearchChange?: (value: string) => void;
	filters: Record<string, Record<string, boolean>>;
	toggleFilter?: (columnId: string, value: string) => void;
};

const EMPTY_FILTERABLE_COLUMNS: Array<{
	columnId: string;
	options: Record<string, boolean>;
}> = [];

export const DataTableToolbar = <TData,>({
	table,
	searchableColumnId,
	filterableColumns = EMPTY_FILTERABLE_COLUMNS,
	search,
	onSearchChange,
	filters,
	toggleFilter,
}: DataTableToolbarProps<TData>) => {
	const t = useTranslations("components.table");
	const inputRef = useRef<HTMLInputElement>(null);

	const totalSelectedFilters = Object.values(filters).reduce(
		(acc, columnFilters) => acc + Object.values(columnFilters).filter(Boolean).length,
		0
	);

	return (
		<div className='flex w-full flex-wrap items-center justify-between gap-4 bg-background p-4'>
			<div className='flex items-center gap-2'>
				{searchableColumnId && (
					<div className='relative'>
						<Input
							ref={inputRef}
							className={cn("peer h-9 min-w-60 ps-9", Boolean(search) && "pe-9")}
							value={search}
							onChange={(e) => onSearchChange?.(e.target.value)}
							placeholder={t("filters.ui.searchPlaceholder")}
							type='text'
							aria-label={t("filters.ui.searchPlaceholder")}
						/>
						<div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
							<ListFilter size={16} strokeWidth={2} aria-hidden='true' />
						</div>
						{Boolean(search) && (
							<button
								className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10  focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
								aria-label={t("filters.ui.clear")}
								onClick={() => {
									onSearchChange?.("");
									if (inputRef.current) {
										inputRef.current.focus();
									}
								}}
							>
								<CircleX size={16} strokeWidth={2} aria-hidden='true' />
							</button>
						)}
					</div>
				)}

				{/* Filter dropdown */}
				{filterableColumns.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='secondary' className='h-9'>
								<Filter
									className='-ms-1 me-2 opacity-60'
									size={16}
									strokeWidth={2}
									aria-hidden='true'
								/>
								{t("filters.ui.title")}
								{totalSelectedFilters > 0 && (
									<span className='-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 text-xs font-medium text-muted-foreground/70'>
										{totalSelectedFilters}
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start' className='w-72'>
							{filterableColumns.map((columnFilter, index) => (
								<div key={columnFilter.columnId}>
									{index > 0 && <DropdownMenuSeparator />}
									<DropdownMenuLabel className='px-3 pt-3 text-xs font-medium text-muted-foreground'>
										{t(
											`filters.values.${columnFilter.columnId}` as MessageKeys<
												IntlMessages,
												keyof IntlMessages
											>
										)}
									</DropdownMenuLabel>
									<div className='space-y-3 p-3'>
										{Object.entries(columnFilter.options).map(([value, _], i) => (
											<div key={value} className='flex items-center gap-2'>
												<Checkbox
													id={`filter-${columnFilter.columnId}-${i}`}
													checked={filters[columnFilter.columnId]?.[value] ?? false}
													onCheckedChange={() =>
														toggleFilter
															? toggleFilter(columnFilter.columnId, value)
															: false
													}
												/>
												<Label
													htmlFor={`filter-${columnFilter.columnId}-${i}`}
													className='flex grow justify-between gap-2 font-normal'
												>
													<span className='capitalize'>{value}</span>
												</Label>
											</div>
										))}
									</div>
								</div>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{/* Column visibility */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='secondary' className='h-9'>
							<Columns3 className='-ms-1 me-2 opacity-60' size={16} strokeWidth={2} aria-hidden='true' />
							{t("view.title")}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>{t("view.toggleColumns")}</DropdownMenuLabel>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
										onSelect={(event) => event.preventDefault()}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Delete button */}
			{table.getSelectedRowModel().rows.length > 0 && (
				<AlertDialog>
					<AlertDialogTrigger
						render={
							<Button className='ms-auto' variant='secondary'>
								<Trash className='-ms-1 me-2 opacity-60' size={16} strokeWidth={2} aria-hidden='true' />
								{t("delete.button")}
								<span className='-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 text-xs font-medium text-muted-foreground/70'>
									{table.getSelectedRowModel().rows.length}
								</span>
							</Button>
						}
					/>
					<AlertDialogContent>
						<div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
							<div
								className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border'
								aria-hidden='true'
							>
								<CircleAlert className='opacity-80' size={16} strokeWidth={2} />
							</div>
							<AlertDialogHeader>
								<AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
								<AlertDialogDescription>
									{t("delete.description", {
										count: table.getSelectedRowModel().rows.length,
									})}
								</AlertDialogDescription>
							</AlertDialogHeader>
						</div>
						<AlertDialogFooter>
							<AlertDialogClose render={<Button variant='secondary'>{t("delete.cancel")}</Button>} />
							<AlertDialogClose
								onClick={() => table.resetRowSelection()}
								render={<Button variant='destructive'>{t("delete.confirm")}</Button>}
							/>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
};
