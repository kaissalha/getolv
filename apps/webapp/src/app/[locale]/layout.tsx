import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";

import { BaseLayout } from "@/components/layout/base-layout";
import { generateLocalizedStaticParams, routing } from "@/i18n/routing";
import "@getolv/ui/globals.css";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export const generateStaticParams = generateLocalizedStaticParams;

export const metadata: Metadata = {
	title: {
		default: "getolv — the practice workspace for health & wellness professionals",
		template: "%s | getolv",
	},
	description:
		"getolv scribes your consults, surfaces live session intelligence, and keeps every patient's story — notes, labs, plans, mail, and scheduling — in one workspace.",
};

type LocaleLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const [{ locale }, messages] = await Promise.all([params, getMessages()]);

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<BaseLayout locale={locale} messages={messages}>
			{children}
		</BaseLayout>
	);
}
