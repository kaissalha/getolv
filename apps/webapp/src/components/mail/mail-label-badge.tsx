import type { CSSProperties } from "react";

import type { MailLabelSummary } from "@starter/app-store";
import { Skeleton } from "@starter/ui/components/skeleton";
import { cn } from "@starter/ui/lib/utils";

type MailLabelBadgeProps = {
	className?: string;
	label: MailLabelSummary;
};

const getMailLabelBadgeStyle = (label: MailLabelSummary) => {
	if (!label.backgroundColor && !label.textColor) {
		return undefined;
	}

	return {
		backgroundColor: label.backgroundColor ?? undefined,
		borderColor: label.textColor ?? label.backgroundColor ?? undefined,
		color: label.textColor ?? undefined,
	} satisfies CSSProperties;
};

export const MailLabelBadge = ({ className, label }: MailLabelBadgeProps) => {
	return (
		<span
			className={cn(
				"inline-flex min-w-0 max-w-full items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap",
				!label.backgroundColor && !label.textColor && "border-border/60 bg-muted/60 text-muted-foreground",
				className
			)}
			style={getMailLabelBadgeStyle(label)}
		>
			<span className='truncate'>{label.name}</span>
		</span>
	);
};

export const MailLabelBadgeSkeleton = ({ className }: { className?: string }) => {
	return <Skeleton aria-hidden className={cn("h-5 w-20 rounded-full", className)} />;
};
