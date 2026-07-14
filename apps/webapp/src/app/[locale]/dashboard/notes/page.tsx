import { Suspense } from "react";

import { NotesGrid } from "@/components/notes/notes-grid";
import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { NotesPageHeader } from "./components/notes-page-header";

type NotesPageProps = {
	searchParams: Promise<{ q?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
	const { q: search = "" } = await searchParams;

	prefetch(
		trpcServer.notes.list.queryOptions({
			pageSize: 100,
			search,
		})
	);

	return (
		<HydrateClient>
			<div className='flex min-h-0 flex-1 flex-col'>
				<Suspense>
					<NotesPageHeader />
					<NotesGrid />
				</Suspense>
			</div>
		</HydrateClient>
	);
}
