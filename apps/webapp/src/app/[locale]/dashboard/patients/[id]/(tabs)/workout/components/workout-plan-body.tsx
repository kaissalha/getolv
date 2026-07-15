"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@getolv/ui/components/alert-dialog";
import { Button } from "@getolv/ui/components/button";

import { ExerciseSearchDialog } from "./exercise-search-dialog";
import { useWorkoutPlanExerciseController } from "./use-workout-plan-controller";
import { WorkoutDaySection } from "./workout-day-section";
import { WorkoutOverviewSkeleton } from "./workout-overview-skeleton";
import { type WorkoutPlanListItem, WorkoutPlanSummary } from "./workout-plan-summary";

type WorkoutPlanBodyProps = {
	editedSummary: string;
	isEditingSummary: boolean;
	latestSelected: boolean;
	onDeleteRequest: () => void;
	patientId: string;
	planId: string | null;
	selectedPlanId: string;
	setEditedSummary: (value: string) => void;
	setIsEditingSummary: (value: boolean) => void;
	setPlanId: (value: string | null) => void;
	updateSummaryMutation: {
		isPending: boolean;
		mutate: (input: { summary: string; workoutPlanId: string }) => void;
	};
	workoutPlans: WorkoutPlanListItem[];
};

export const WorkoutPlanBody = ({
	editedSummary,
	isEditingSummary,
	latestSelected,
	onDeleteRequest,
	patientId,
	planId,
	selectedPlanId,
	setEditedSummary,
	setIsEditingSummary,
	setPlanId,
	updateSummaryMutation,
	workoutPlans,
}: WorkoutPlanBodyProps) => {
	const trpc = useTRPC();
	const t = useTranslations("dashboard.patients.workout");
	const tCommon = useTranslations("common");
	const {
		addExerciseMutation,
		addingToDayId,
		removeExerciseMutation,
		removingExerciseId,
		setAddingToDayId,
		setRemovingExerciseId,
		setSwappingExerciseId,
		swapExerciseMutation,
		swappingExerciseId,
	} = useWorkoutPlanExerciseController({
		patientId,
		selectedPlanId,
	});
	const { data: plan, isLoading } = useQuery(trpc.workouts.getWorkoutPlan.queryOptions({ id: selectedPlanId }));

	if (isLoading) {
		return <WorkoutOverviewSkeleton />;
	}

	if (!plan) {
		return null;
	}

	const selectedPlan = workoutPlans.find((workoutPlan) => workoutPlan.id === selectedPlanId);
	const totalExercises = plan.days.reduce((sum, day) => sum + day.exercises.length, 0);
	const currentPlanLabel = latestSelected ? t("latestPlan") : (selectedPlan?.title ?? t("planTitle"));

	return (
		<>
			<div className='min-w-0 animate-in fade-in-0 duration-200'>
				<div className='flex flex-col gap-6'>
					<WorkoutPlanSummary
						currentPlanLabel={currentPlanLabel}
						daysPerWeek={plan.daysPerWeek}
						durationWeeks={plan.durationWeeks}
						editedSummary={editedSummary}
						isEditingSummary={isEditingSummary}
						latestSelected={latestSelected}
						onCancelEditingSummary={() => {
							setIsEditingSummary(false);
							setEditedSummary("");
						}}
						onDeleteRequest={onDeleteRequest}
						onSaveSummary={() => {
							updateSummaryMutation.mutate({
								workoutPlanId: selectedPlanId,
								summary: editedSummary,
							});
						}}
						onStartEditingSummary={() => {
							setEditedSummary(plan.summary ?? "");
							setIsEditingSummary(true);
						}}
						planId={planId}
						planSummary={plan.summary}
						selectedPlanTitle={selectedPlan?.title}
						setEditedSummary={setEditedSummary}
						setPlanId={setPlanId}
						totalExercises={totalExercises}
						updateSummaryPending={updateSummaryMutation.isPending}
						workoutPlans={workoutPlans}
					/>

					<div className='flex flex-col gap-5'>
						{plan.days.map((day) => (
							<WorkoutDaySection
								key={day.id}
								day={day}
								onAddExercise={setAddingToDayId}
								onRemoveExercise={setRemovingExerciseId}
								onSwapExercise={setSwappingExerciseId}
								patientId={patientId}
								selectedPlanId={selectedPlanId}
							/>
						))}
					</div>
				</div>
			</div>

			<AlertDialog
				open={Boolean(removingExerciseId && removingExerciseId !== selectedPlanId)}
				onOpenChange={(open) => !open && setRemovingExerciseId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("removeExercise")}</AlertDialogTitle>
						<AlertDialogDescription>{t("removeExerciseConfirm")}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose render={<Button variant='secondary'>{tCommon("cancel")}</Button>} />
						<AlertDialogClose
							onClick={() => {
								if (removingExerciseId) {
									removeExerciseMutation.mutate({ exerciseId: removingExerciseId });
								}
							}}
							render={
								<Button variant='destructive' disabled={removeExerciseMutation.isPending}>
									{removeExerciseMutation.isPending ? "…" : t("removeExercise")}
								</Button>
							}
						/>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ExerciseSearchDialog
				open={Boolean(addingToDayId)}
				onOpenChange={(open) => !open && setAddingToDayId(null)}
				onSelect={(exercise) => {
					if (!addingToDayId) {
						return;
					}

					addExerciseMutation.mutate({
						workoutPlanDayId: addingToDayId,
						exerciseId: exercise.id,
						exerciseName: exercise.name,
						sets: 3,
						reps: "10",
						restSeconds: 60,
					});
				}}
				title={t("addExercise")}
			/>

			<ExerciseSearchDialog
				open={Boolean(swappingExerciseId)}
				onOpenChange={(open) => !open && setSwappingExerciseId(null)}
				onSelect={(exercise) => {
					if (!swappingExerciseId) {
						return;
					}

					swapExerciseMutation.mutate({
						exerciseId: swappingExerciseId,
						newExerciseId: exercise.id,
						exerciseName: exercise.name,
					});
				}}
				title={t("swapExercise")}
			/>
		</>
	);
};
