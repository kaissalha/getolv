"use client";

import { InboxIcon, PenSquareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@starter/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@starter/ui/components/empty";

import { MAIL_COMPOSE_NEW, MAIL_COMPOSE_PARAM } from "./mail-url-state";

export const MailEmptyState = () => {
	const t = useTranslations("mail");
	const [, setCompose] = useQueryState(MAIL_COMPOSE_PARAM, parseAsString);

	return (
		<Empty className='h-full min-h-80 border-none'>
			<EmptyHeader>
				<div className='mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10'>
					<InboxIcon className='size-8 text-primary' />
				</div>
				<EmptyTitle>{t("empty.title")}</EmptyTitle>
				<EmptyDescription>{t("empty.description")}</EmptyDescription>
			</EmptyHeader>
			<Button onClick={() => setCompose(MAIL_COMPOSE_NEW)} size='lg'>
				<PenSquareIcon />
				{t("compose")}
			</Button>
		</Empty>
	);
};
