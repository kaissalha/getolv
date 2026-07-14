import { Suspense } from "react";

import { NotesGrid } from "@/components/notes/notes-grid";
import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

type NotesPageProps = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ q?: string }>;
};

export default async function NotesPage({ params, searchParams }: NotesPageProps) {
	const [{ id: patientId }, { q: search = "" }] = await Promise.all([params, searchParams]);

	prefetch(
		trpcServer.notes.list.queryOptions({
			pageSize: 100,
			resourceType: "patient",
			resourceId: patientId,
			search,
		})
	);

	prefetch(
		trpcServer.patients.list.queryOptions({
			pageSize: 100,
		})
	);

	return (
		<div className='py-4'>
			<HydrateClient>
				<Suspense>
					<NotesGrid resourceType='patient' resourceId={patientId} patientId={patientId} />
				</Suspense>
			</HydrateClient>
		</div>
	);
}
