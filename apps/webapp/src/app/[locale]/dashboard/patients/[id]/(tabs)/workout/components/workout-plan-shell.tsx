"use client";

import { useParams } from "next/navigation";

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@starter/ui/components/alert-dialog";
import { Button } from "@starter/ui/components/button";

import { useWorkoutPlanShellController } from "./use-workout-plan-controller";
import { WorkoutPlanBody } from "./workout-plan-body";
import { type WorkoutPlanListItem } from "./workout-plan-summary";

type WorkoutPlanShellProps = {
	workoutPlans: WorkoutPlanListItem[];
};

export const WorkoutPlanShell = ({ workoutPlans }: WorkoutPlanShellProps) => {
	const { id: patientId } = useParams<{ id: string }>();
	const {
		deleteMutation,
		deletingPlanId,
		editedSummary,
		isEditingSummary,
		latestSelected,
		planId,
		selectedPlanId,
		setDeletingPlanId,
		setEditedSummary,
		setIsEditingSummary,
		setPlanId,
		updateSummaryMutation,
	} = useWorkoutPlanShellController({
		patientId,
		workoutPlans,
	});

	if (!selectedPlanId) {
		return null;
	}

	return (
		<>
			<div className='min-w-0 px-4 pb-52 pt-4'>
				<WorkoutPlanBody
					editedSummary={editedSummary}
					isEditingSummary={isEditingSummary}
					latestSelected={latestSelected}
					onDeleteRequest={() => setDeletingPlanId(selectedPlanId)}
					patientId={patientId}
					planId={planId}
					selectedPlanId={selectedPlanId}
					setEditedSummary={setEditedSummary}
					setIsEditingSummary={setIsEditingSummary}
					setPlanId={setPlanId}
					updateSummaryMutation={updateSummaryMutation}
					workoutPlans={workoutPlans}
				/>
			</div>

			<AlertDialog open={Boolean(deletingPlanId)} onOpenChange={(open) => !open && setDeletingPlanId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Workout Plan</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete this workout plan and all its training days. This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose render={<Button variant='secondary'>Cancel</Button>} />
						<AlertDialogClose
							onClick={() => {
								if (deletingPlanId) {
									deleteMutation.mutate({ id: deletingPlanId });
								}
							}}
							render={
								<Button variant='destructive' disabled={deleteMutation.isPending}>
									{deleteMutation.isPending ? "Deleting..." : "Delete"}
								</Button>
							}
						/>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
