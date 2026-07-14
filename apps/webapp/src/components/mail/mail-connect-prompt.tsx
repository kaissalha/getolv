"use client";

import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@starter/ui/components/empty";

const GMAIL_CONNECT_URL = "/api/integrations/gmail/connect";

export const MailConnectPrompt = () => {
	const t = useTranslations("mail.connect");

	return (
		<Empty className='h-full min-h-80 border-none'>
			<EmptyHeader>
				<div className='mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10'>
					<MailIcon className='size-8 text-primary' />
				</div>
				<EmptyTitle>{t("title")}</EmptyTitle>
				<EmptyDescription>{t("description")}</EmptyDescription>
			</EmptyHeader>
			<Button asChild size='lg'>
				<a href={GMAIL_CONNECT_URL}>{t("button")}</a>
			</Button>
		</Empty>
	);
};
