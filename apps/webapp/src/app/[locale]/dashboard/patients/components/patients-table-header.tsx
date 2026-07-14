"use client";

import { PlusIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { SearchableHeader } from "@/app/[locale]/dashboard/components/layout/searchable-header";
import { Link } from "@/i18n/navigation";
import { Button } from "@starter/ui/components/button";

export const PatientsTableHeader = () => {
	const tBreadcrumbs = useTranslations("breadcrumbs");
	const tPatients = useTranslations("dashboard.patients");
	const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));

	return (
		<SearchableHeader
			icon={<UsersIcon />}
			title={tBreadcrumbs("patients")}
			search={search}
			onSearchChange={(value) => setSearch(value || null)}
			searchPlaceholder={tPatients("search")}
			actions={
				<Link href='/dashboard/patients/create'>
					<Button size='sm'>
						<PlusIcon /> {tPatients("newPatient")}
					</Button>
				</Link>
			}
		/>
	);
};
