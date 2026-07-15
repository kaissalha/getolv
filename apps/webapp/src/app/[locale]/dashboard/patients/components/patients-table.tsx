"use client";

import { useCallback, useMemo } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDataTableState } from "@/hooks/use-data-table-state";
import { useFormatRelativeDate } from "@/hooks/use-relative-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { getFullName } from "@/utils/string";
import type { Patient } from "@getolv/db";
import { Checkbox } from "@getolv/ui/components/checkbox";

import { EmptyState } from "./empty-state";
import { InfiniteDataTable } from "./infinite-data-table";

export const PatientsTable = () => {
	const commonT = useTranslations("common");
	const t = useTranslations("dashboard.patients");
	const trpc = useTRPC();
	const router = useRouter();

	const handleAddPatient = useCallback(() => {
		router.push("/dashboard/patients/create");
	}, [router]);

	const {
		pagination: { pageIndex, pageSize },
		sorting: { sorting, onSortingChange },
		search: { search },
	} = useDataTableState({
		defaultPageSize: 20,
		defaultSorting: "createdAt:desc",
	});

	const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
		trpc.patients.list.infiniteQueryOptions(
			{
				pageSize,
				sort: (sorting[0]?.id as keyof Patient) ?? "createdAt",
				order: (sorting[0]?.desc ?? true) ? "desc" : "asc",
				search,
			},
			{
				getNextPageParam: ({ meta }) => meta?.cursor,
			}
		)
	);

	const patients = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
	const total = useMemo(() => data?.pages[0]?.meta.totalData || 0, [data]);

	const formatRelativeDate = useFormatRelativeDate();

	const columns: ColumnDef<Patient>[] = useMemo(
		() => [
			{
				id: "firstName",
				accessorKey: "firstName",
				header: ({ table }) => (
					<div className='ms-0.5 flex items-center gap-5'>
						<Checkbox
							aria-label='Select all'
							checked={
								table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && undefined)
							}
							onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
							onClick={(e) => e.stopPropagation()}
						/>
						<div>{commonT("fields.name")}</div>
					</div>
				),
				cell: ({ row }) => (
					<div className='ms-0.5 flex items-center gap-5'>
						<Checkbox
							aria-label='Select row'
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							onClick={(e) => e.stopPropagation()}
						/>
						<div className='line-clamp-1'>{getFullName(row.original)}</div>
					</div>
				),
			},
			{
				header: commonT("fields.email"),
				accessorKey: "email",
				cell: ({ row }) => <div className='w-full truncate'>{row.original.email}</div>,
			},
			{
				header: commonT("fields.phoneNumber"),
				accessorKey: "phoneNumber",
				meta: {
					className: "max-md:hidden",
				},
			},
			{
				header: commonT("fields.dateAdded"),
				accessorKey: "createdAt",
				cell: ({ row }) => (
					<div className='line-clamp-1'>{formatRelativeDate(new Date(row.original.createdAt))}</div>
				),
			},
		],
		[commonT, formatRelativeDate]
	);

	return (
		<div className='flex flex-1 flex-col'>
			<InfiniteDataTable
				useWindow={true}
				data={patients}
				columns={columns}
				loadMore={async () => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				hasNextPage={hasNextPage}
				totalCount={total}
				sorting={sorting}
				onSortingChange={onSortingChange}
				showNoResults={!isLoading && !!search}
				isLoading={isLoading}
				onRowClick={(patient) => router.push(`/dashboard/patients/${patient.id}`)}
				showSelectionToolbar={true}
				data-testid='patients-table'
			/>
			{!(isLoading || search) && pageIndex === 0 && total === 0 && (
				<EmptyState
					icon={<UsersIcon />}
					title={t("title")}
					description={t("emptyStates.noPatients")}
					buttonText={t("newPatient")}
					onClick={handleAddPatient}
					data-testid='patients-empty-state'
				/>
			)}
		</div>
	);
};
