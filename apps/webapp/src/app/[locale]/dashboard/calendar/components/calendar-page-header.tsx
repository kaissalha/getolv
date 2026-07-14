"use client";

import { useMemo } from "react";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import { SidebarTrigger } from "@starter/ui/components/sidebar";

const headerShellClassName =
	"sticky top-0 z-50 flex w-full shrink-0 items-center justify-between gap-2 bg-background px-4 py-3 md:flex-row md:items-center md:gap-3 md:px-5 md:py-3.5";

type CalendarPageHeaderProps = {
	currentDate: Date;
	isLoading?: boolean;
	onPrevious: () => void;
	onNext: () => void;
	onToday: () => void;
};

export const CalendarPageHeader = ({
	currentDate,
	isLoading,
	onPrevious,
	onNext,
	onToday,
}: CalendarPageHeaderProps) => {
	const t = useTranslations("calendar");
	const tBreadcrumbs = useTranslations("breadcrumbs");
	const locale = useLocale();

	const weekRangeLabel = useMemo(() => {
		const weekStart = new Date(currentDate);
		weekStart.setDate(currentDate.getDate() - currentDate.getDay());
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekEnd.getDate() + 6);

		const startMonth = weekStart.toLocaleDateString(locale, { month: "short" });
		const endMonth = weekEnd.toLocaleDateString(locale, { month: "short" });
		const year = weekStart.getFullYear();

		if (startMonth === endMonth) {
			return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`;
		}
		return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;
	}, [currentDate, locale]);

	return (
		<header className={headerShellClassName}>
			<div className='flex min-w-0 items-center gap-3 md:gap-4'>
				<SidebarTrigger className='-ms-1 shrink-0 md:hidden' purpose='navigation' />
				<div className='hidden shrink-0 md:block [&_svg:not([class*="size-"])]:size-4.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground'>
					{isLoading ? <Loader2Icon className='animate-spin' /> : <CalendarIcon />}
				</div>
				<span className='min-w-0 truncate text-lg'>{tBreadcrumbs("calendar")}</span>
				<span className='hidden text-sm font-medium text-muted-foreground md:inline'>{weekRangeLabel}</span>
			</div>
			<div className='flex items-center gap-2'>
				<Button variant='ghost' size='sm' onClick={onToday}>
					{t("today")}
				</Button>
				<div className='flex items-center'>
					<Button variant='ghost' size='icon' onClick={onPrevious}>
						<ChevronLeftIcon className='rtl:rotate-180' />
					</Button>
					<Button variant='ghost' size='icon' onClick={onNext}>
						<ChevronRightIcon className='rtl:rotate-180' />
					</Button>
				</div>
			</div>
		</header>
	);
};
