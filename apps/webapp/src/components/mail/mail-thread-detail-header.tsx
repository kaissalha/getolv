"use client";

import { useTranslations } from "next-intl";

import type { MailLabelSummary } from "@getolv/app-store";

import { MailLabelBadge } from "./mail-label-badge";
import { MailThreadPatientBadge } from "./mail-thread-patient-badge";

type MailThreadDetailHeaderProps = {
	classificationLabel?: MailLabelSummary | null;
	messageCount: number;
	senderEmail?: string;
	subject: string;
};

export const MailThreadDetailHeader = ({
	classificationLabel,
	messageCount,
	senderEmail,
	subject,
}: MailThreadDetailHeaderProps) => {
	const t = useTranslations("mail");

	return (
		<div className='min-w-0 flex-1 overflow-hidden'>
			<div className='flex min-w-0 items-center gap-2'>
				<h2 className='min-w-0 truncate text-base font-semibold leading-tight'>{subject || t("noSubject")}</h2>
				<MailThreadPatientBadge senderEmail={senderEmail} />
				{classificationLabel && <MailLabelBadge className='shrink-0' label={classificationLabel} />}
			</div>
			{messageCount > 1 && (
				<p className='mt-1 text-xs text-muted-foreground'>{t("messageCount", { count: messageCount })}</p>
			)}
		</div>
	);
};
