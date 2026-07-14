import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

export default async function SessionFallbackPage({ params }: { params: Promise<{ id: string }> }) {
	const [{ id }, locale] = await Promise.all([params, getLocale()]);

	// This route should not be accessed directly.
	// Sessions should be accessed via /patients/[id]/session/[sessionId]
	// Redirect back to patient page where they can create or select a session
	redirect({ href: `/dashboard/patients/${id}`, locale });
}
