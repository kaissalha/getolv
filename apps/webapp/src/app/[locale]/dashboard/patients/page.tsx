import { Suspense } from "react";

import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { PatientsTable } from "./components/patients-table";
import { PatientsTableHeader } from "./components/patients-table-header";

type PatientsPageProps = {
	searchParams: Promise<{ q?: string }>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
	const { q: search = "" } = await searchParams;

	prefetch(
		trpcServer.patients.list.infiniteQueryOptions(
			{
				pageSize: 20,
				sort: "createdAt",
				order: "desc",
				search,
			},
			{
				getNextPageParam: ({ meta }) => meta?.cursor,
			}
		)
	);

	return (
		<HydrateClient>
			<Suspense>
				<PatientsTableHeader />
				<PatientsTable />
			</Suspense>
		</HydrateClient>
	);
}
