"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { ChevronLeftIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useMobileSearch } from "@/hooks/use-mobile-search";
import { Button } from "@starter/ui/components/button";
import { Input } from "@starter/ui/components/input";
import { SidebarTrigger } from "@starter/ui/components/sidebar";

const headerShellClassName =
	"flex w-full shrink-0 items-center justify-between gap-2 px-4 py-3 md:flex-row md:items-center md:gap-3 md:px-5 md:py-3.5";
const headerWrapperClassName = "sticky top-0 z-50 bg-background";

type SearchableHeaderProps = {
	footer?: ReactNode;
	icon?: ReactNode;
	title: string;
	search?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	actions?: ReactNode;
};

export const SearchableHeader = ({
	footer,
	icon,
	title,
	search,
	onSearchChange,
	searchPlaceholder,
	actions,
}: SearchableHeaderProps) => {
	const t = useTranslations("common");
	const searchFieldPlaceholder = searchPlaceholder ?? t("search");
	const hasSearch = typeof search === "string" && !!onSearchChange;
	const mobileSearchInputRef = useRef<HTMLInputElement>(null);
	const { isMobileSearchOpen, handleMobileSearchOpen, handleMobileSearchClose } = useMobileSearch({
		onSearchChange: onSearchChange ?? (() => {}),
	});

	useEffect(() => {
		if (!isMobileSearchOpen) {
			return;
		}

		mobileSearchInputRef.current?.focus();
	}, [isMobileSearchOpen]);

	if (hasSearch && isMobileSearchOpen) {
		return (
			<div className={headerWrapperClassName}>
				<div className={headerShellClassName}>
					<Button variant='ghost' size='icon' onClick={handleMobileSearchClose} className='shrink-0 p-0'>
						<ChevronLeftIcon className='size-4.5 rtl:rotate-180' aria-hidden />
					</Button>
					<div className='relative min-w-0 flex-1'>
						<div className='pointer-events-none absolute top-1/2 inset-s-3 -translate-y-1/2'>
							<SearchIcon className='size-4.5 text-muted-foreground' aria-hidden />
						</div>
						<Input
							ref={mobileSearchInputRef}
							className='w-full'
							placeholder={searchFieldPlaceholder}
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
						{search ? (
							<Button
								variant='ghost'
								size='icon'
								className='absolute inset-e-1 top-1/2 size-6 -translate-y-1/2'
								onClick={() => onSearchChange("")}
							>
								<XIcon className='size-4' aria-hidden />
							</Button>
						) : null}
					</div>
				</div>
				{footer}
			</div>
		);
	}

	return (
		<div className={headerWrapperClassName}>
			<header className={headerShellClassName}>
				<div className='flex min-w-0 flex-1 items-center gap-3 md:gap-4'>
					<SidebarTrigger className='-ms-1 shrink-0 md:hidden' purpose='navigation' />
					{icon ? (
						<div className='hidden shrink-0 md:block [&_svg:not([class*="size-"])]:size-4.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground'>
							{icon}
						</div>
					) : null}
					<span className='min-w-0 truncate text-lg'>{title}</span>
				</div>
				<div className='flex shrink-0 items-center gap-2 md:gap-3'>
					{hasSearch ? (
						<>
							<div className='relative hidden md:block'>
								<div className='pointer-events-none absolute top-1/2 inset-s-3 -translate-y-1/2'>
									<SearchIcon className='size-4.5 text-muted-foreground' aria-hidden />
								</div>
								<Input
									placeholder={searchFieldPlaceholder}
									value={search}
									onChange={(e) => onSearchChange(e.target.value)}
								/>
							</div>
							<Button variant='ghost' size='icon' className='md:hidden' onClick={handleMobileSearchOpen}>
								<SearchIcon className='size-4.5' aria-hidden />
							</Button>
						</>
					) : null}
					{actions}
				</div>
			</header>
			{footer}
		</div>
	);
};
