"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";

import { BaseWidget } from "./base-widget";

export const DailySummaryWidgetSkeleton = () => {
	const t = useTranslations("dashboard.widgets.dailySummary");

	return (
		<BaseWidget title={t("title")}>
			<div className='flex flex-col gap-2'>
				<div className='h-3 w-24 animate-pulse rounded bg-muted' />
				<div className='space-y-1.5 pt-1'>
					<div className='h-4 w-full animate-pulse rounded bg-muted' />
					<div className='h-4 w-11/12 animate-pulse rounded bg-muted' />
					<div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
				</div>
			</div>
		</BaseWidget>
	);
};

export const DailySummaryWidget = () => {
	const t = useTranslations("dashboard.widgets.dailySummary");
	const trpc = useTRPC();
	const { data, isError, isLoading, isFetching } = useQuery(
		trpc.dailySummary.get.queryOptions({ now: new Date() }, { staleTime: 10 * 60_000 })
	);

	if (isLoading && !isFetching) return <DailySummaryWidgetSkeleton />;

	if (!data && isFetching) {
		return (
			<BaseWidget title={t("title")}>
				<p className='text-sm text-muted-foreground'>{t("generating")}</p>
			</BaseWidget>
		);
	}

	if (isError || !data) {
		return (
			<BaseWidget title={t("title")}>
				<p className='text-sm text-muted-foreground'>{t("error")}</p>
			</BaseWidget>
		);
	}

	if (data.needsConnection) {
		return (
			<BaseWidget title={t("title")}>
				<p className='text-sm text-muted-foreground'>{t("connectRequired")}</p>
			</BaseWidget>
		);
	}

	const periodKicker = data.usedWeeklyFallback ? t("weekFallback") : t("today");

	return (
		<BaseWidget title={t("title")}>
			<div className='flex flex-col gap-2'>
				<p className='text-xs uppercase tracking-wider text-muted-foreground'>
					{periodKicker} · {data.periodLabel}
				</p>
				<p className='text-sm md:text-base leading-relaxed text-foreground'>{data.content.summary}</p>
			</div>
		</BaseWidget>
	);
};
