"use client";

import type { LucideIcon } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@starter/ui/lib/utils";

type Tab = {
	href: string;
	label: string;
	icon?: LucideIcon;
	count?: number;
};

type SubpathNavProps = {
	tabs: Tab[];
};

export const SubpathNav = ({ tabs }: SubpathNavProps) => {
	const pathname = usePathname();

	return (
		<nav className='no-scrollbar relative flex w-full shrink-0 flex-nowrap gap-5 overflow-x-auto px-4 md:gap-7 md:px-5 after:absolute after:bottom-0 after:start-0 after:h-0.25 after:w-full after:bg-border'>
			{tabs.map((tab) => {
				const isActive = pathname === tab.href;
				const Icon = tab.icon;

				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={cn(
							"focus-visible:outline-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground ring-offset-background transition-[color,border-color] duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"relative z-10 border-b pb-3",
							isActive ? "border-foreground text-foreground" : "border-transparent"
						)}
					>
						{Icon && <Icon className='h-4 w-4' />}
						<span>{tab.label}</span>
						{tab.count !== undefined && tab.count > 0 && (
							<span className='bg-muted text-muted-foreground rounded-full py-0.5 px-1 text-xs tabular-nums'>
								{tab.count}
							</span>
						)}
					</Link>
				);
			})}
		</nav>
	);
};
