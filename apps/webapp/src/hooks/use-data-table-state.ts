import { useCallback, useMemo } from "react";

import type { PaginationState, SortingState, Updater } from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type UseDataTableStateOptions = {
	defaultPageSize?: number;
	defaultPageIndex?: number;
	defaultSorting?: string;
	defaultSearch?: string;
	defaultFilters?: Record<string, Record<string, boolean>>;
	defaultColumnVisibility?: Record<string, boolean>;
};

type FilterState = Record<string, Record<string, boolean>>;

export const useDataTableState = ({
	defaultPageSize = 10,
	defaultPageIndex = 0,
	defaultSorting = "",
	defaultSearch = "",
	defaultFilters = {},
	defaultColumnVisibility = {},
}: UseDataTableStateOptions = {}) => {
	const [pageIndex, setPageIndex] = useQueryState("page", parseAsInteger.withDefault(defaultPageIndex));
	const [pageSize, setPageSize] = useQueryState("size", parseAsInteger.withDefault(defaultPageSize));
	const [sortingStr, setSortingStr] = useQueryState("sort", parseAsString.withDefault(defaultSorting));
	const [search, setSearch] = useQueryState("q", parseAsString.withDefault(defaultSearch));
	const [filtersStr, setFiltersStr] = useQueryState(
		"filters",
		parseAsString.withDefault(JSON.stringify(defaultFilters))
	);
	const [columnVisibilityStr, setColumnVisibilityStr] = useQueryState(
		"visibility",
		parseAsString.withDefault(JSON.stringify(defaultColumnVisibility))
	);

	// Parse sorting string into a single sort state
	const sorting = useMemo(() => {
		if (!sortingStr) return [];
		const [id, dir] = sortingStr.split(":");
		return [{ id, desc: dir === "desc" }];
	}, [sortingStr]);

	const filters = useMemo(
		() => (filtersStr ? JSON.parse(filtersStr) : defaultFilters) as FilterState,
		[filtersStr, defaultFilters]
	);

	const columnVisibility = useMemo(
		() =>
			(columnVisibilityStr ? JSON.parse(columnVisibilityStr) : defaultColumnVisibility) as Record<
				string,
				boolean
			>,
		[columnVisibilityStr, defaultColumnVisibility]
	);

	// Transform boolean record filters to arrays for API
	const apiFilters = useMemo(
		() =>
			Object.entries(filters).reduce(
				(acc, [columnId, values]) => {
					const selectedValues = Object.entries(values)
						.filter(([_, isSelected]) => isSelected)
						.map(([value]) => value);

					if (selectedValues.length > 0) {
						acc[columnId] = selectedValues;
					}
					return acc;
				},
				{} as Record<string, string[]>
			),
		[filters]
	);

	const toggleFilter = useCallback(
		(columnId: string, value: string) => {
			const newFilters = { ...filters };
			if (!newFilters[columnId]) {
				newFilters[columnId] = {};
			}
			newFilters[columnId] = {
				...newFilters[columnId],
				[value]: !newFilters[columnId][value],
			};

			// Remove empty filter objects
			if (Object.values(newFilters[columnId]).every((v) => !v)) {
				delete newFilters[columnId];
			}

			setFiltersStr(Object.keys(newFilters).length === 0 ? "" : JSON.stringify(newFilters));
		},
		[filters, setFiltersStr]
	);

	const onPaginationChange = useCallback(
		(updater: Updater<PaginationState>) => {
			const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
			setPageIndex(newState.pageIndex);
			setPageSize(newState.pageSize);
		},
		[pageIndex, pageSize, setPageIndex, setPageSize]
	);

	const onSortingChange = useCallback(
		(updater: Updater<SortingState>) => {
			const newState = typeof updater === "function" ? updater(sorting) : updater;
			// Only take the first sort item if multiple are provided
			const firstSort = newState[0];
			setSortingStr(firstSort ? `${firstSort.id}:${firstSort.desc ? "desc" : "asc"}` : "");
		},
		[sorting, setSortingStr]
	);

	const onColumnVisibilityChange = useCallback(
		(updater: Updater<Record<string, boolean>>) => {
			const newState = typeof updater === "function" ? updater(columnVisibility) : updater;
			setColumnVisibilityStr(JSON.stringify(newState));
		},
		[columnVisibility, setColumnVisibilityStr]
	);

	const paginationState = useMemo(
		() => ({
			pageIndex,
			pageSize,
			onPaginationChange,
		}),
		[pageIndex, pageSize, onPaginationChange]
	);

	const sortingState = useMemo(
		() => ({
			sorting,
			onSortingChange,
		}),
		[sorting, onSortingChange]
	);

	const filtersState = useMemo(
		() => ({
			filters,
			apiFilters,
			toggleFilter,
		}),
		[filters, apiFilters, toggleFilter]
	);

	const searchState = useMemo(
		() => ({
			search,
			onSearchChange: setSearch,
		}),
		[search, setSearch]
	);

	const columnVisibilityState = useMemo(
		() => ({
			columnVisibility,
			onColumnVisibilityChange,
		}),
		[columnVisibility, onColumnVisibilityChange]
	);

	return useMemo(
		() => ({
			pagination: paginationState,
			sorting: sortingState,
			filters: filtersState,
			search: searchState,
			columnVisibility: columnVisibilityState,
		}),
		[paginationState, sortingState, filtersState, searchState, columnVisibilityState]
	);
};
