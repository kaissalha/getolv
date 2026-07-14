"use client";

import { CalendarDays, Flame, Plus, Snowflake } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@starter/ui/components/badge";
import { Button } from "@starter/ui/components/button";
import { Frame, FrameHeader, FrameHeading, FrameIcon, FramePanel } from "@starter/ui/components/frame";

import { type PlanExerciseRow, WorkoutDaySortableExercises } from "./workout-day-sortable-exercises";

type WorkoutDaySectionProps = {
	day: {
		coolDown: string | null;
		dayNumber: number;
		exercises: Array<PlanExerciseRow & { orderIndex: number }>;
		focus: string | null;
		id: string;
		name: string;
		warmUp: string | null;
	};
	onAddExercise: (dayId: string) => void;
	onRemoveExercise: (exerciseId: string) => void;
	onSwapExercise: (exerciseId: string) => void;
	patientId: string;
	selectedPlanId: string;
};

export const WorkoutDaySection = ({
	day,
	onAddExercise,
	onRemoveExercise,
	onSwapExercise,
	patientId,
	selectedPlanId,
}: WorkoutDaySectionProps) => {
	const t = useTranslations("dashboard.patients.workout");
	const sortedDayExercises = [...day.exercises].sort((left, right) => left.orderIndex - right.orderIndex);

	return (
		<Frame key={day.id}>
			<FrameHeader className='flex-row items-start justify-between gap-4'>
				<FrameHeading className='items-start'>
					<FrameIcon className='mt-0.5'>
						<CalendarDays className='h-4 w-4' />
					</FrameIcon>
					<div className='flex min-w-0 flex-col gap-0.5'>
						<span className='text-xs font-medium text-muted-foreground'>
							{t("dayLabel", { dayNumber: day.dayNumber })}
						</span>
						{day.focus && <span className='text-xs text-muted-foreground'>{day.focus}</span>}
					</div>
				</FrameHeading>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={() => onAddExercise(day.id)}>
						<Plus className='me-1.5 h-3.5 w-3.5' />
						{t("addExercise")}
					</Button>
					<Badge variant='secondary' size='sm' className='whitespace-nowrap'>
						{t("exercisesCount", { count: day.exercises.length })}
					</Badge>
				</div>
			</FrameHeader>

			<FramePanel className='flex flex-col p-0!'>
				{day.warmUp && (
					<div className='mt-0.5 flex items-start gap-3 border-b bg-orange-50/50 px-4 py-3 dark:bg-orange-950/10'>
						<Flame className='mt-0.5 size-4 shrink-0 text-orange-500' />
						<div className='flex flex-col gap-0.5'>
							<span className='text-xs font-semibold text-orange-700 dark:text-orange-400'>
								{t("warmUp")}
							</span>
							<span className='text-xs text-muted-foreground'>{day.warmUp}</span>
						</div>
					</div>
				)}

				{sortedDayExercises.length === 0 ? (
					<p className='px-4 py-6 text-center text-sm text-muted-foreground'>{t("noExercisesInDay")}</p>
				) : (
					<WorkoutDaySortableExercises
						dayId={day.id}
						exercises={sortedDayExercises}
						patientId={patientId}
						selectedPlanId={selectedPlanId}
						onRemove={onRemoveExercise}
						onSwap={onSwapExercise}
					/>
				)}

				{day.coolDown && (
					<div className='mt-0.5 flex items-start gap-3 border-t bg-blue-50/50 px-4 py-3 dark:bg-blue-950/10'>
						<Snowflake className='mt-0.5 size-4 shrink-0 text-blue-500' />
						<div className='flex flex-col gap-0.5'>
							<span className='text-xs font-semibold text-blue-700 dark:text-blue-400'>
								{t("coolDown")}
							</span>
							<span className='text-xs text-muted-foreground'>{day.coolDown}</span>
						</div>
					</div>
				)}
			</FramePanel>
		</Frame>
	);
};
