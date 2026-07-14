import { Suspense } from "react";

import { notFound } from "next/navigation";

import { MailLayout } from "@/components/mail/mail-layout";
import { getQueryClient, HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

type PatientMailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function PatientMailPage({ params }: PatientMailPageProps) {
	const { id: patientId } = await params;
	const queryClient = getQueryClient();

	prefetch(trpcServer.mail.listConnections.queryOptions());

	const patient = await queryClient.fetchQuery(trpcServer.patients.get.queryOptions({ id: patientId }));

	if (!patient) {
		return notFound();
	}

	return (
		<HydrateClient>
			<Suspense>
				<MailLayout patientEmail={patient.email} defaultToEmail={patient.email} />
			</Suspense>
		</HydrateClient>
	);
}
