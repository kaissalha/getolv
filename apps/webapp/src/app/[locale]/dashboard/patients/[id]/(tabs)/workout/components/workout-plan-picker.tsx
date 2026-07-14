"use client";

import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@starter/ui/components/dropdown-menu";
import { cn } from "@starter/ui/lib/utils";

import type { WorkoutPlanListItem } from "./workout-plan-summary";

type WorkoutPlanPickerProps = {
	currentPlanLabel: string;
	latestSelected: boolean;
	planId: string | null;
	setPlanId: (value: string | null) => void;
	workoutPlans: WorkoutPlanListItem[];
};

export const WorkoutPlanPicker = ({
	currentPlanLabel,
	latestSelected,
	planId,
	setPlanId,
	workoutPlans,
}: WorkoutPlanPickerProps) => {
	const t = useTranslations("dashboard.patients.workout");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					className='group flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out hover:bg-muted/70 data-[state=open]:bg-muted/70'
				>
					<span className='max-w-45 truncate'>{currentPlanLabel}</span>
					<ChevronDown className='h-4 w-4 text-muted-foreground transition-transform duration-150 ease-out group-data-[state=open]:rotate-180' />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='max-h-64 w-64 overflow-y-auto'>
				<DropdownMenuItem
					onSelect={() => setPlanId(null)}
					className={cn(
						"w-full",
						latestSelected && "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
					)}
				>
					{t("latestPlan")}
				</DropdownMenuItem>
				{workoutPlans.length > 0 && <DropdownMenuSeparator />}
				{workoutPlans.map((plan) => (
					<DropdownMenuItem
						key={plan.id}
						onSelect={() => setPlanId(plan.id)}
						className={cn(
							"w-full flex-col items-start gap-0.5",
							planId === plan.id && "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
						)}
					>
						<span className='truncate font-medium'>{plan.title}</span>
						<span className='text-xs text-muted-foreground'>
							{format(new Date(plan.createdAt), "MMM d, yyyy")}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
