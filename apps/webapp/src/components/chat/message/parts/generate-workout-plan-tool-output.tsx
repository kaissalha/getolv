"use client";

import { DumbbellIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@getolv/ui/components/badge";
import { Spinner } from "@getolv/ui/components/spinner";

import type { GenerateWorkoutPlanOutputData } from "./tool-part-types";

export const GenerateWorkoutPlanToolOutput = ({ output }: { output: GenerateWorkoutPlanOutputData }) => {
	const t = useTranslations("components.chat.message.tool.workoutPlan");

	if (!output) return null;

	if (output.stage === "processing") {
		return (
			<div className='flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3'>
				<Spinner className='size-4 text-muted-foreground' />
				<span className='text-sm text-muted-foreground'>{t("generating")}</span>
			</div>
		);
	}

	if (!output.workoutPlanId) {
		return (
			<div className='flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3'>
				<DumbbellIcon className='size-4 text-muted-foreground' />
				<span className='text-sm text-muted-foreground'>{t("failed")}</span>
			</div>
		);
	}

	return (
		<div className='w-full space-y-3 rounded-2xl border border-border/50 bg-muted/30 p-4'>
			<div className='flex items-center gap-2'>
				<DumbbellIcon className='size-4 text-primary' />
				<span className='text-sm font-medium'>{output.title ?? t("fallbackTitle")}</span>
				{output.daysCount > 0 && (
					<Badge variant='default' size='sm'>
						{t("daysCount", { count: output.daysCount })}
					</Badge>
				)}
			</div>
			{output.summary && <p className='text-sm leading-relaxed text-muted-foreground'>{output.summary}</p>}
		</div>
	);
};
