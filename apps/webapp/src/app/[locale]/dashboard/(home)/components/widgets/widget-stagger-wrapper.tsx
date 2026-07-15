"use client";

import type { ReactNode } from "react";

import { cn } from "@getolv/ui/lib/utils";

const STAGGER_DELAY_MS = 60;

export const WidgetStaggerWrapper = ({
	children,
	className,
	index,
}: {
	children: ReactNode;
	className?: string;
	index: number;
}) => {
	return (
		<div
			className={cn(
				"flex h-full min-h-0 min-w-0 w-full flex-col animate-[fade-in-up] fill-mode-both [animation-duration:400ms]",
				className
			)}
			style={{
				animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
				animationDelay: `${index * STAGGER_DELAY_MS}ms`,
			}}
		>
			{children}
		</div>
	);
};
