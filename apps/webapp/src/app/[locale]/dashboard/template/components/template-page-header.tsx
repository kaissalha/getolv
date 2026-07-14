"use client";

import { LayoutTemplateIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { SearchableHeader } from "@/app/[locale]/dashboard/components/layout/searchable-header";

export const TemplatePageHeader = () => {
	const tBreadcrumbs = useTranslations("breadcrumbs");

	return <SearchableHeader icon={<LayoutTemplateIcon />} title={tBreadcrumbs("template")} />;
};
