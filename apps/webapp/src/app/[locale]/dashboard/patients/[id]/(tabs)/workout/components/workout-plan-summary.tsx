"use client";

import { Calendar, CalendarDays, Check, Dumbbell, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@getolv/ui/components/badge";
import { Button } from "@getolv/ui/components/button";
import {
	Frame,
	FrameFooter,
	FrameHeader,
	FrameHeading,
	FrameIcon,
	FramePanel,
	FrameTitle,
} from "@getolv/ui/components/frame";
import { Textarea } from "@getolv/ui/components/textarea";

import { WorkoutPlanPicker } from "./workout-plan-picker";

export type WorkoutPlanListItem = {
	createdAt: Date | string;
	id: string;
	title: string;
};

type WorkoutPlanSummaryProps = {
	currentPlanLabel: string;
	daysPerWeek: number | null;
	durationWeeks: number | null;
	editedSummary: string;
	isEditingSummary: boolean;
	latestSelected: boolean;
	onCancelEditingSummary: () => void;
	onDeleteRequest: () => void;
	onSaveSummary: () => void;
	onStartEditingSummary: () => void;
	planId: string | null;
	planSummary: string | null;
	selectedPlanTitle: string | null | undefined;
	setEditedSummary: (value: string) => void;
	setPlanId: (value: string | null) => void;
	totalExercises: number;
	updateSummaryPending: boolean;
	workoutPlans: WorkoutPlanListItem[];
};

export const WorkoutPlanSummary = ({
	currentPlanLabel,
	daysPerWeek,
	durationWeeks,
	editedSummary,
	isEditingSummary,
	latestSelected,
	onCancelEditingSummary,
	onDeleteRequest,
	onSaveSummary,
	onStartEditingSummary,
	planId,
	planSummary,
	selectedPlanTitle,
	setEditedSummary,
	setPlanId,
	totalExercises,
	updateSummaryPending,
	workoutPlans,
}: WorkoutPlanSummaryProps) => {
	const t = useTranslations("dashboard.patients.workout");
	const tCommon = useTranslations("common");

	return (
		<Frame>
			<FrameHeader className='flex-row items-center justify-between gap-4'>
				<FrameHeading>
					<FrameIcon>
						<Dumbbell className='h-4 w-4' />
					</FrameIcon>
					<FrameTitle>{selectedPlanTitle ?? t("planTitle")}</FrameTitle>
				</FrameHeading>

				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={onDeleteRequest}
						title={tCommon("delete")}
						aria-label={tCommon("delete")}
					>
						<Trash2 className='h-3.5 w-3.5 text-muted-foreground' />
					</Button>

					<WorkoutPlanPicker
						currentPlanLabel={currentPlanLabel}
						latestSelected={latestSelected}
						planId={planId}
						setPlanId={setPlanId}
						workoutPlans={workoutPlans}
					/>
				</div>
			</FrameHeader>

			<FramePanel>
				{isEditingSummary ? (
					<div className='flex flex-col gap-3'>
						<Textarea
							value={editedSummary}
							onChange={(event) => setEditedSummary(event.target.value)}
							rows={5}
							className='resize-none text-sm'
							placeholder={t("summaryPlaceholder")}
						/>
						<div className='flex items-center justify-end gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={onCancelEditingSummary}
								disabled={updateSummaryPending}
							>
								<X className='me-1.5 h-4 w-4' />
								{tCommon("cancel")}
							</Button>
							<Button size='sm' onClick={onSaveSummary} disabled={updateSummaryPending}>
								<Check className='me-1.5 h-4 w-4' />
								{tCommon("save")}
							</Button>
						</div>
					</div>
				) : (
					<div className='group relative'>
						<p className='text-sm leading-relaxed'>{planSummary || t("summaryPlaceholder")}</p>
						<Button
							variant='ghost'
							size='icon-sm'
							className='absolute -top-1 inset-e-0 opacity-0 transition-opacity group-hover:opacity-100'
							onClick={onStartEditingSummary}
							title={tCommon("edit")}
							aria-label={tCommon("edit")}
						>
							<Pencil className='h-3.5 w-3.5' />
						</Button>
					</div>
				)}
			</FramePanel>

			{(durationWeeks || daysPerWeek || totalExercises > 0) && (
				<FrameFooter>
					<div className='flex flex-wrap items-center gap-3'>
						{durationWeeks && (
							<Badge variant='secondary' size='sm' className='inline-flex items-center whitespace-nowrap'>
								<Calendar className='me-1.5 h-3 w-3 shrink-0 opacity-80' />
								{t("weeksCount", { count: durationWeeks })}
							</Badge>
						)}
						{daysPerWeek && (
							<Badge variant='secondary' size='sm' className='inline-flex items-center whitespace-nowrap'>
								<CalendarDays className='me-1.5 h-3 w-3 shrink-0 opacity-80' />
								{t("daysPerWeekCount", { count: daysPerWeek })}
							</Badge>
						)}
						{totalExercises > 0 && (
							<Badge variant='secondary' size='sm' className='inline-flex items-center whitespace-nowrap'>
								<Dumbbell className='me-1.5 h-3 w-3 shrink-0 opacity-80' />
								{t("exercisesCount", { count: totalExercises })}
							</Badge>
						)}
					</div>
				</FrameFooter>
			)}
		</Frame>
	);
};
