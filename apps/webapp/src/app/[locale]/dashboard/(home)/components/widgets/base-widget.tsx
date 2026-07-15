"use client";

import type { CSSProperties, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@getolv/ui/lib/utils";

type BaseWidgetProps = {
	title: string;
	icon?: ReactNode;
	children: ReactNode;
	action?: {
		label: string;
		href: string;
	};
	className?: string;
	style?: CSSProperties;
};

export const BaseWidget = ({ title, icon, children, action, className, style }: BaseWidgetProps) => {
	return (
		<div
			className={cn(
				"group flex h-full min-h-52.5 w-full min-w-0 flex-col justify-between rounded-sm border border-border bg-card p-4 md:min-h-57.5",
				"transition-[background-color,box-shadow] duration-200 ease-out hover:bg-accent/40",
				className
			)}
			style={style}
		>
			{!!icon && (
				<div className='mb-3 flex items-center gap-2'>
					<span className='text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground'>
						{icon}
					</span>
					<h3 className='text-xs font-medium text-muted-foreground'>{title}</h3>
				</div>
			)}
			<div className='min-h-0 flex-1'>{children}</div>

			{action ? (
				<Link
					href={action.href}
					className='text-xs text-muted-foreground transition-colors duration-150 ease-out group-hover:text-foreground'
				>
					{action.label}
				</Link>
			) : null}
		</div>
	);
};
