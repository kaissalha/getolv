import { type NextRequest, NextResponse } from "next/server";

import { withErrorHandler } from "@/utils/with-error-handler";
import { handleGoogleCalendarCallback } from "@getolv/app-store";
import { getBaseURL } from "@getolv/utils";

export const GET = withErrorHandler(async (request: NextRequest) => {
	const { searchParams } = request.nextUrl;

	const result = await handleGoogleCalendarCallback({
		code: searchParams.get("code"),
		state: searchParams.get("state"),
		error: searchParams.get("error"),
	});

	const baseUrl = getBaseURL();
	const redirectUrl = new URL("dashboard/calendar", baseUrl);

	if (result.success) {
		redirectUrl.searchParams.set("googleCalendarStatus", "success");
	} else {
		redirectUrl.searchParams.set("googleCalendarStatus", result.error);
	}

	return NextResponse.redirect(redirectUrl);
});
