"use client";

import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@getolv/ui/components/button";

export const CalendarConnectCard = () => {
	const t = useTranslations("calendar");

	const handleConnect = () => {
		window.location.assign("/api/integrations/google-calendar/connect");
	};

	return (
		<div className='flex flex-1 items-center justify-center p-6'>
			<div className='flex max-w-sm flex-col items-center gap-4 text-center animate-[fade-in-up] [animation-duration:400ms] [animation-fill-mode:both] [animation-timing-function:cubic-bezier(0.23,1,0.32,1)]'>
				<div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
					<CalendarIcon className='size-6 text-muted-foreground' />
				</div>
				<div className='flex flex-col gap-1.5'>
					<h2 className='text-lg font-semibold'>{t("connectTitle")}</h2>
					<p className='text-sm text-muted-foreground'>{t("connectDescription")}</p>
				</div>
				<Button onClick={handleConnect}>{t("connectButton")}</Button>
			</div>
		</div>
	);
};
