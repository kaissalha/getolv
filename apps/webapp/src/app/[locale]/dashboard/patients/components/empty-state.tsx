import type * as React from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@starter/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@starter/ui/components/empty";
import { cn } from "@starter/ui/lib/utils";

type EmptyStateProps = {
	className?: string;
	icon?: React.ReactNode;
	title: string;
	description: string;
	buttonText: string;
	onClick: () => void;
	"data-testid"?: string;
};

export const EmptyState = ({
	className,
	icon,
	title,
	description,
	buttonText,
	onClick,
	"data-testid": testId,
}: EmptyStateProps) => {
	return (
		<Empty
			className={cn(
				"h-full border-none animate-[fade-in-up] [animation-duration:400ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]",
				className
			)}
			data-testid={testId}
		>
			<EmptyHeader>
				{icon && <EmptyMedia>{icon}</EmptyMedia>}
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			<Button onClick={onClick}>
				<PlusIcon />
				<span>{buttonText}</span>
			</Button>
		</Empty>
	);
};
