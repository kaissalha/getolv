"use client";

import { useQuery } from "@tanstack/react-query";
import { MailIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { readInitialMailThreadListPage } from "@/components/mail/mail-thread-list-stream";
import { MAIL_THREAD_ID_PARAM } from "@/components/mail/mail-url-state";
import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

import { BaseWidget } from "./base-widget";

const GMAIL_CONNECT_URL = "/api/integrations/gmail/connect";

const getSenderListLabel = ({ name, email }: { name?: string; email: string }) => {
	if (name && name !== email) {
		return `${name} ${email}`;
	}
	return email;
};

export const MailWidgetSkeleton = () => {
	const t = useTranslations("dashboard.widgets.mail");

	return (
		<BaseWidget title={t("title")} icon={<MailIcon className='size-3.5' />}>
			<div className='flex flex-col gap-2'>
				<div className='h-8 w-16 animate-pulse rounded bg-muted' />
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/5 animate-pulse rounded bg-muted' />
			</div>
		</BaseWidget>
	);
};

const MailWidgetThreads = ({ connectionId }: { connectionId: string }) => {
	const t = useTranslations("dashboard.widgets.mail");
	const trpc = useTRPC();

	const { data, isLoading } = useQuery({
		queryKey: ["mail", "widget", "threads", connectionId],
		queryFn: ({ signal }) =>
			readInitialMailThreadListPage({
				input: {
					connectionId,
					folder: "inbox",
					maxResults: 3,
				},
				signal,
			}),
		staleTime: 60_000,
	});

	const { data: counts, isLoading: isCountsLoading } = useQuery(
		trpc.mail.getLabelCounts.queryOptions({ connectionId }, { staleTime: 60_000 })
	);

	const threads = data?.threads ?? [];
	const inboxUnread = counts?.find((entry) => entry?.label === "inbox")?.count ?? 0;

	if (isLoading || isCountsLoading) return <MailWidgetSkeleton />;

	return (
		<BaseWidget
			title={t("title")}
			icon={<MailIcon className='size-3.5' />}
			action={threads.length > 0 ? { label: t("viewAll"), href: "/dashboard/mail" } : undefined}
		>
			{!threads.length ? (
				<div className='flex flex-col items-start gap-2'>
					<p className='text-sm text-muted-foreground'>{t("empty")}</p>
					<Button type='button' variant='outline' size='sm' asChild>
						<Link href='/dashboard/mail'>
							<PlusIcon className='size-3.5' />
							{t("goToMail")}
						</Link>
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-1'>
					<p className='mb-1 text-2xl font-normal text-foreground'>
						{t("unreadTotal", { count: inboxUnread })}
					</p>
					{threads.map((thread) => (
						<Link
							key={thread.id}
							href={`/dashboard/mail?${MAIL_THREAD_ID_PARAM}=${encodeURIComponent(thread.id)}`}
							className='flex items-center justify-between gap-2 rounded-md md:p-1 text-sm transition-colors hover:bg-accent'
						>
							<span
								className={cn(
									"line-clamp-1 min-w-0 truncate text-foreground",
									thread.isUnread && "font-medium"
								)}
							>
								{thread.subject}
							</span>
							<span className='shrink-0 text-xs text-muted-foreground'>
								{getSenderListLabel(thread.sender)}
							</span>
						</Link>
					))}
				</div>
			)}
		</BaseWidget>
	);
};

const MailWidgetDisconnected = () => {
	const t = useTranslations("dashboard.widgets.mail");
	const tConnect = useTranslations("mail.connect");

	return (
		<BaseWidget title={t("title")} icon={<MailIcon className='size-3.5' />}>
			<div className='flex flex-col items-start gap-2'>
				<p className='text-sm text-muted-foreground'>{t("notConnected")}</p>
				<Button type='button' variant='outline' size='sm' asChild>
					<a href={GMAIL_CONNECT_URL}>
						<MailIcon className='size-3.5' />
						{tConnect("button")}
					</a>
				</Button>
			</div>
		</BaseWidget>
	);
};

export const MailWidget = () => {
	const trpc = useTRPC();
	const { data: connections, isLoading } = useQuery(trpc.mail.listConnections.queryOptions());

	if (isLoading) return <MailWidgetSkeleton />;

	const activeConnection = connections?.find((c) => c.status === "connected");

	if (!activeConnection) {
		return <MailWidgetDisconnected />;
	}

	return <MailWidgetThreads connectionId={activeConnection.id} />;
};
