"use client";

import { MailIcon, PenSquareIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { SearchableHeader } from "@/app/[locale]/dashboard/components/layout/searchable-header";
import { Button } from "@getolv/ui/components/button";

import { MailSearchFilterList } from "./mail-search-filter-list";
import { useMailPageHeaderController } from "./use-mail-page-header-controller";

export const MailPageHeader = () => {
	const tBreadcrumbs = useTranslations("breadcrumbs");
	const tMail = useTranslations("mail");
	const { filters, onCompose, onRemoveFilter, onSearchChange, search } = useMailPageHeaderController();

	return (
		<SearchableHeader
			footer={<MailSearchFilterList filters={filters} onRemoveFilter={onRemoveFilter} />}
			icon={<MailIcon />}
			title={tBreadcrumbs("mail")}
			search={search}
			onSearchChange={(value) => onSearchChange(value || null)}
			searchPlaceholder={tMail("search")}
			actions={
				<Button onClick={onCompose} size='sm'>
					<PenSquareIcon />
					<span className='hidden md:inline'>{tMail("compose")}</span>
				</Button>
			}
		/>
	);
};
