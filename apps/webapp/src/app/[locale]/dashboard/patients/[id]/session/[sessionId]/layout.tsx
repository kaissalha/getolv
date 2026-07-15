import type { ReactNode } from "react";

import { headers } from "next/headers";

import { getPatientSession } from "@getolv/server";
import { auth } from "@getolv/server/auth";

export default async function SessionLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ id: string; sessionId: string }>;
}) {
	const [{ id, sessionId }, headersObj] = await Promise.all([params, headers()]);

	const session = await auth.api.getSession({
		headers: headersObj,
	});

	if (!session) {
		throw new Error("No session found");
	}

	if (!session.session.activeOrganizationId) {
		throw new Error("No active practice found");
	}

	const patientSession = await getPatientSession({
		organizationId: session.session.activeOrganizationId,
		patientId: id,
		sessionId,
	});

	if (!patientSession) {
		throw new Error("No patient session found");
	}

	return <>{children}</>;
}
