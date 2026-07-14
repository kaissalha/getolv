"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { SubpathNav } from "./subpath-nav";

export const PatientNav = () => {
	const { id } = useParams<{ id: string }>();
	const t = useTranslations("dashboard.patients.tabs");

	const tabs = [
		{ href: `/dashboard/patients/${id}`, label: t("overview") },
		{ href: `/dashboard/patients/${id}/labs`, label: t("labs") },
		{ href: `/dashboard/patients/${id}/diet`, label: t("diet") },
		{ href: `/dashboard/patients/${id}/workout`, label: t("workout") },
		{ href: `/dashboard/patients/${id}/notes`, label: t("notes") },
		{ href: `/dashboard/patients/${id}/mail`, label: t("mail") },
	];

	return <SubpathNav tabs={tabs} />;
};
