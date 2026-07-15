"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import type { MailFolder } from "@/hooks/use-mail-state";
import { useMailState } from "@/hooks/use-mail-state";
import { useTRPC } from "@/lib/trpc";
import { cn } from "@getolv/ui/lib/utils";

import { MailCompose } from "./mail-compose";
import { MailConnectPrompt } from "./mail-connect-prompt";
import { MailFolderTabs } from "./mail-folder-tabs";
import { MailPatientSheet } from "./mail-patient-sheet";
import { MailThreadDetail } from "./mail-thread-detail";
import { MailThreadList, MailThreadListSkeleton } from "./mail-thread-list";
import { MAIL_THREAD_ID_PARAM } from "./mail-url-state";

type MailLayoutProps = {
	patientEmail?: string;
	defaultToEmail?: string;
};

export const MailLayout = ({ patientEmail, defaultToEmail }: MailLayoutProps) => {
	const trpc = useTRPC();
	const [threadId] = useQueryState(MAIL_THREAD_ID_PARAM, parseAsString);
	const isOpen = Boolean(threadId);
	const isPatientMode = Boolean(patientEmail);

	const {
		folder: { folder, onFolderChange },
	} = useMailState();

	const connectionsQuery = useQuery(trpc.mail.listConnections.queryOptions());

	const activeConnection = useMemo(
		() => connectionsQuery.data?.find((c) => c.status === "connected"),
		[connectionsQuery.data]
	);

	const countsQuery = useQuery(
		trpc.mail.getLabelCounts.queryOptions(
			{ connectionId: activeConnection?.id ?? "" },
			{
				enabled: Boolean(activeConnection),
				staleTime: 60_000,
				refetchInterval: 120_000,
			}
		)
	);

	const folderCounts = useMemo(() => {
		if (!countsQuery.data) return undefined;
		const map: Partial<Record<MailFolder, number>> = {};
		for (const entry of countsQuery.data) {
			if (entry) {
				map[entry.label as MailFolder] = entry.count;
			}
		}
		return map;
	}, [countsQuery.data]);

	if (connectionsQuery.isLoading) {
		return <MailThreadListSkeleton />;
	}

	if (!activeConnection) {
		return <MailConnectPrompt />;
	}

	return (
		<div className='flex h-full min-h-0 flex-col'>
			{!isPatientMode && (
				<div className='shrink-0 border-b border-border/50'>
					<MailFolderTabs activeFolder={folder} onFolderChange={onFolderChange} counts={folderCounts} />
				</div>
			)}
			<div className='relative flex min-h-0 flex-1 overflow-hidden'>
				<div
					className={cn(
						"flex w-full min-h-0 min-w-0 flex-col motion-safe:transition-[width] motion-safe:duration-220 motion-safe:ease-out-quint",
						isOpen && "md:w-105 md:shrink-0 md:border-r md:border-border/50"
					)}
				>
					<MailThreadList connectionId={activeConnection.id} patientEmail={patientEmail} compact={isOpen} />
				</div>
				<MailThreadDetail connectionId={activeConnection.id} />
			</div>
			<MailCompose connectionId={activeConnection.id} defaultToEmail={defaultToEmail} />
			<MailPatientSheet />
		</div>
	);
};
