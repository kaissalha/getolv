import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { LabsOverview } from "./components/labs-overview";

type LabsPageProps = {
	params: Promise<{ id: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LabsPage({ params, searchParams }: LabsPageProps) {
	const [{ id }, { report }] = await Promise.all([params, searchParams]);

	prefetch(
		trpcServer.labs.getPatientLabReports.queryOptions({
			patientId: id,
		})
	);

	if (report) {
		prefetch(
			trpcServer.labs.getLabReportWithResults.queryOptions({
				labReportId: report as string,
			})
		);
	}

	return (
		<HydrateClient>
			<LabsOverview />
		</HydrateClient>
	);
}
