import type { ReactNode } from "react";

import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

type PatientLayoutProps = {
	children: ReactNode;
	params: Promise<{ id: string }>;
};

export default async function PatientLayout({ children, params }: PatientLayoutProps) {
	const { id } = await params;

	prefetch(
		trpcServer.patients.get.queryOptions({
			id,
		})
	);

	return <HydrateClient>{children}</HydrateClient>;
}
