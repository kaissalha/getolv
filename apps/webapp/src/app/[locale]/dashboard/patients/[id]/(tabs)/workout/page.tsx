import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { WorkoutOverview } from "./components/workout-overview";

type WorkoutPageProps = {
	params: Promise<{ id: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkoutPage({ params, searchParams }: WorkoutPageProps) {
	const [{ id }, { plan }] = await Promise.all([params, searchParams]);

	prefetch(trpcServer.workouts.listPatientWorkoutPlans.queryOptions({ patientId: id }));

	if (plan) {
		prefetch(trpcServer.workouts.getWorkoutPlan.queryOptions({ id: plan as string }));
	}

	return (
		<HydrateClient>
			<WorkoutOverview />
		</HydrateClient>
	);
}
