"use client";

import { useCallback, useState } from "react";

import type { Row, Table } from "@tanstack/react-table";
import { CheckIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import { DeleteConfirmationAlert } from "@/components/data-table/delete-confirmation-alert";
import { Button } from "@getolv/ui/components/button";

type DataTableSelectionToolbarProps<TData> = {
	table: Table<TData>;
	selectedRows: Row<TData>[];
	totalCount: number;
	onExport?: (selectedRows: TData[], exportAll: boolean) => void;
	onDelete?: (selectedRows: TData[], deleteAll: boolean) => void;
};

export const DataTableSelectionToolbar = <TData,>({
	table,
	selectedRows,
	totalCount,
	onExport,
	onDelete,
}: DataTableSelectionToolbarProps<TData>) => {
	const t = useTranslations("components.table");

	const [openConfirm, setOpenConfirm] = useState(false);
	// This is a virtual indicator to show that all items are selected,
	// not only the currently visible ones
	const [selectAll, setSelectAll] = useState(false);

	const selectedRowsData = selectedRows.map((row) => row.original);
	const totalSelected = selectedRows.length;
	const isAllSelected = selectedRows.length === totalCount;

	const handleSelectAll = useCallback(() => {
		setSelectAll(true);
		if (!table.getIsAllRowsSelected()) {
			table.toggleAllRowsSelected();
		}
	}, [table]);

	const handleExport = useCallback(() => {
		if (onExport) {
			onExport(selectedRowsData, selectAll);
		}
	}, [onExport, selectedRowsData, selectAll]);

	const handleDelete = useCallback(() => {
		if (onDelete) {
			onDelete(selectedRowsData, selectAll);
		}
		table.resetRowSelection();
	}, [onDelete, table, selectedRowsData, selectAll]);

	return (
		<>
			<AnimatePresence>
				{selectedRows.length > 0 && (
					<motion.div
						variants={{
							hidden: { opacity: 0, y: 20, transition: { duration: 0.1 } },
							visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
						}}
						initial='hidden'
						animate='visible'
						exit='hidden'
						className='fixed bottom-2 start-1/2 z-10 max-w-[calc(100%-16px)] -translate-x-1/2 overflow-hidden rounded-2xl bg-popover shadow-lg ring ring-border md:bottom-6'
					>
						<div
							className='pointer-events-none absolute start-0 top-0 h-full w-7 bg-linear-to-r from-popover'
							aria-hidden='true'
						/>
						<div className='no-scrollbar flex items-center gap-3 overflow-x-auto p-3'>
							<p className='whitespace-nowrap px-3 py-1 font-medium text-muted-foreground'>
								{t("selection.selected", {
									count: selectAll ? totalCount : totalSelected,
									total: totalCount,
								})}
							</p>
							{!(selectAll || isAllSelected) && (
								<Button variant='ghost' onClick={handleSelectAll}>
									<CheckIcon />
									{t("selection.selectAllNumber", { count: totalCount })}
								</Button>
							)}
							<Button variant='ghost' onClick={handleExport}>
								<DownloadIcon />
								{t("download.button")}
							</Button>
							{!selectAll && (
								<Button variant='ghost' onClick={() => setOpenConfirm(true)}>
									<TrashIcon />
									{t("delete.button")}
								</Button>
							)}
						</div>
						<div
							className='pointer-events-none absolute end-0 top-0 h-full w-7 shrink-0 bg-linear-to-l from-popover'
							aria-hidden='true'
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<DeleteConfirmationAlert
				totalSelected={totalSelected}
				open={openConfirm}
				setOpen={setOpenConfirm}
				onConfirm={handleDelete}
			/>
		</>
	);
};
