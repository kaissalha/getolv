import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { Overview } from "./components/overview";

type OverviewPageProps = {
	params: Promise<{ id: string }>;
};

export default async function OverviewPage({ params }: OverviewPageProps) {
	const { id } = await params;

	prefetch(
		trpcServer.patients.getActivityFeed.queryOptions({
			patientId: id,
		})
	);
	prefetch(
		trpcServer.patients.get.queryOptions({
			id,
		})
	);

	return (
		<HydrateClient>
			<Overview />
		</HydrateClient>
	);
}
