"use client";

import { useCallback } from "react";

import { parseAsString, useQueryState } from "nuqs";

import { MAIL_COMPOSE_NEW, MAIL_COMPOSE_PARAM } from "@/components/mail/mail-url-state";
import { useMailState } from "@/hooks/use-mail-state";

export const useMailPageHeaderController = () => {
	const [, setCompose] = useQueryState(MAIL_COMPOSE_PARAM, parseAsString);
	const {
		search: { filters, onRemoveFilter, onSearchChange, search },
	} = useMailState();

	const onCompose = useCallback(() => {
		void setCompose(MAIL_COMPOSE_NEW);
	}, [setCompose]);

	return {
		filters,
		onCompose,
		onRemoveFilter,
		onSearchChange,
		search,
	};
};
