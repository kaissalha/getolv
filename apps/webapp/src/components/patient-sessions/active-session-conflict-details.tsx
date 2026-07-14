"use client";

import { Clock3Icon, StethoscopeIcon, UserIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { RouterOutput } from "@starter/server";

type ActiveSession = RouterOutput["patientSessions"]["getActiveSession"];

export const getPatientSessionHref = ({ patientId, sessionId }: { patientId: string; sessionId: string }) => {
	return `/dashboard/patients/${patientId}/session/${sessionId}`;
};

export const ActiveSessionConflictDetails = ({ activeSession }: { activeSession: ActiveSession }) => {
	const locale = useLocale();
	const tCommon = useTranslations("common");
	const tOverview = useTranslations("dashboard.patients.overview");

	if (!activeSession) {
		return null;
	}

	const patientName = [activeSession.patient?.firstName, activeSession.patient?.lastName].filter(Boolean).join(" ");
	const startedAt = new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(activeSession.createdAt));

	return (
		<div className='rounded-xl border bg-muted/35 p-3 text-start'>
			<div className='flex items-start gap-2'>
				<StethoscopeIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
				<div className='min-w-0 flex-1'>
					<p className='break-words text-sm font-medium text-foreground'>
						{activeSession.title || tOverview("untitledSession")}
					</p>
					{patientName && (
						<div className='mt-2 flex items-start gap-2 text-xs text-muted-foreground'>
							<UserIcon className='mt-0.5 size-3.5 shrink-0' />
							<span className='break-words'>
								{tCommon("fields.patient")}: {patientName}
							</span>
						</div>
					)}
					<div className='mt-2 flex items-start gap-2 text-xs text-muted-foreground'>
						<Clock3Icon className='mt-0.5 size-3.5 shrink-0' />
						<span>
							{tCommon("fields.startedAt")}: {startedAt}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
