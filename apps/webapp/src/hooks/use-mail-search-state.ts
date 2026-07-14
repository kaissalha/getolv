import { useCallback, useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import {
	buildMailSearchQuery,
	getMailSearchTextTerms,
	parseMailSearchQuery,
	removeMailSearchFilter,
	type MailSearchFilter,
} from "@/components/mail/mail-search-query";
import { useTRPC } from "@/lib/trpc";

type UseMailSearchStateOptions = {
	defaultSearch?: string;
};

const MAIL_SEARCH_AI_HINT_TERMS = new Set([
	"after",
	"attachment",
	"attachments",
	"before",
	"between",
	"during",
	"last",
	"month",
	"since",
	"this",
	"today",
	"until",
	"week",
	"year",
	"yesterday",
]);
const MAIL_SEARCH_NOISE_TERMS = new Set(["email", "emails", "gmail", "mail", "message", "messages"]);

const getCurrentLocalDate = () => {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");

	return `${now.getFullYear()}-${month}-${day}`;
};

export const useMailSearchState = ({ defaultSearch = "" }: UseMailSearchStateOptions = {}) => {
	const trpc = useTRPC();
	const [search, setSearch] = useQueryState("q", parseAsString.withDefault(defaultSearch));
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const localDate = getCurrentLocalDate();
	const { filters } = useMemo(() => parseMailSearchQuery({ search }), [search]);
	const localQuery = useMemo(() => buildMailSearchQuery({ search }), [search]);
	const meaningfulTextTerms = useMemo(
		() => getMailSearchTextTerms({ search: localQuery }).filter((term) => !MAIL_SEARCH_NOISE_TERMS.has(term)),
		[localQuery]
	);
	const shouldUseAiRewrite = useMemo(
		() =>
			search.trim().length > 0 &&
			(meaningfulTextTerms.length >= 3 ||
				meaningfulTextTerms.some((term) => MAIL_SEARCH_AI_HINT_TERMS.has(term) || term.includes("@"))),
		[meaningfulTextTerms, search]
	);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [search]);

	const rewriteQuery = useQuery(
		trpc.mail.rewriteSearchQuery.queryOptions(
			{
				localDate,
				search: debouncedSearch.trim(),
			},
			{
				enabled: shouldUseAiRewrite && debouncedSearch.trim().length > 0,
				retry: false,
				staleTime: 300_000,
			}
		)
	);

	const onRemoveFilter = useCallback(
		async ({ filter }: { filter: MailSearchFilter }) => {
			const nextSearch = removeMailSearchFilter({ filter, search });

			await setSearch(nextSearch || null);
		},
		[search, setSearch]
	);
	const query = useMemo(() => {
		const rewrittenSearch = search === debouncedSearch ? rewriteQuery.data?.query.trim() : null;

		if (!rewrittenSearch) {
			return localQuery;
		}

		return buildMailSearchQuery({ search: rewrittenSearch });
	}, [debouncedSearch, localQuery, rewriteQuery.data?.query, search]);

	return useMemo(
		() => ({
			filters,
			onRemoveFilter,
			onSearchChange: setSearch,
			query,
			search,
		}),
		[filters, onRemoveFilter, query, search, setSearch]
	);
};
