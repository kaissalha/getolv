import { Suspense } from "react";

import { MailLayout } from "@/components/mail/mail-layout";
import { HydrateClient, prefetch } from "@/lib/server/react-query";
import { trpcServer } from "@/lib/server/trpc";

import { MailPageHeader } from "./components/mail-page-header";

export default function MailPage() {
	prefetch(trpcServer.mail.listConnections.queryOptions());

	return (
		<HydrateClient>
			<div className='flex h-dvh flex-col'>
				<Suspense>
					<MailPageHeader />
				</Suspense>
				<div className='flex-1 h-full overflow-hidden'>
					<Suspense>
						<MailLayout />
					</Suspense>
				</div>
			</div>
		</HydrateClient>
	);
}
