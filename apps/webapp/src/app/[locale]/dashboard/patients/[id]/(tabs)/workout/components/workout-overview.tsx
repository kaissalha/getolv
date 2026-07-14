"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";

import { useTRPC } from "@/lib/trpc";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@starter/ui/components/empty";

import { WorkoutOverviewSkeleton } from "./workout-overview-skeleton";
import { WorkoutPlanShell } from "./workout-plan-shell";

export const WorkoutOverview = () => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const { data: workoutPlans, isLoading } = useQuery(
		trpc.workouts.listPatientWorkoutPlans.queryOptions({ patientId })
	);

	if (isLoading) {
		return <WorkoutOverviewSkeleton />;
	}

	if (!workoutPlans?.length) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant='icon'>
						<Dumbbell />
					</EmptyMedia>
					<EmptyTitle>No workout plans yet</EmptyTitle>
					<EmptyDescription>
						Start a session with this patient and ask the AI to generate a workout plan.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return <WorkoutPlanShell workoutPlans={workoutPlans} />;
};
