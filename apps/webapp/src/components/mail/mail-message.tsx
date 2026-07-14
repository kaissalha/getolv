"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, PaperclipIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPCClient } from "@/lib/trpc";
import { Avatar, AvatarFallback } from "@starter/ui/components/avatar";
import { cn } from "@starter/ui/lib/utils";

import { ShadowDomHtml } from "./shadow-dom-html";

type MessageSender = {
	name?: string;
	email: string;
};

type MessageAttachment = {
	attachmentId: string;
	filename: string;
	mimeType: string;
	size: number;
};

type MailMessageProps = {
	id: string;
	subject: string;
	sender: MessageSender;
	to: MessageSender[];
	cc: MessageSender[] | null;
	receivedOn: string;
	body: string;
	decodedBody?: string;
	isUnread: boolean;
	attachments?: MessageAttachment[];
	isLast: boolean;
	connectionId: string;
};

const getInitials = (sender: MessageSender) => {
	if (sender.name) {
		return sender.name
			.split(" ")
			.map((w) => w[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}
	return sender.email.slice(0, 2).toUpperCase();
};

const formatMessageDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
};

const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AttachmentChip = ({
	attachment,
	messageId,
	connectionId,
}: {
	attachment: MessageAttachment;
	messageId: string;
	connectionId: string;
}) => {
	const trpcClient = useTRPCClient();
	const [downloading, setDownloading] = useState(false);

	const handleDownload = () => {
		setDownloading(true);
		trpcClient.mail.getAttachment
			.query({
				connectionId,
				messageId,
				attachmentId: attachment.attachmentId,
			})
			.then((result) => {
				if (result.data) {
					const byteChars = atob(result.data.replace(/-/g, "+").replace(/_/g, "/"));
					const byteArray = new Uint8Array(byteChars.length);
					for (let i = 0; i < byteChars.length; i++) {
						byteArray[i] = byteChars.charCodeAt(i);
					}
					const blob = new Blob([byteArray], { type: attachment.mimeType });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = attachment.filename;
					a.click();
					URL.revokeObjectURL(url);
				}
			})
			.catch(() => {})
			.then(() => setDownloading(false));
	};

	return (
		<button
			type='button'
			onClick={handleDownload}
			disabled={downloading}
			className='flex cursor-pointer items-center gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/70 disabled:opacity-50'
		>
			<PaperclipIcon className='size-3.5 shrink-0 text-muted-foreground' />
			<span className='max-w-32 truncate'>{attachment.filename}</span>
			<span className='shrink-0 text-muted-foreground'>{formatFileSize(attachment.size)}</span>
			<DownloadIcon className='size-3 shrink-0 text-muted-foreground' />
		</button>
	);
};

export const MailMessage = ({
	id,
	sender,
	to,
	cc,
	receivedOn,
	body,
	decodedBody,
	attachments,
	isLast,
	connectionId,
}: MailMessageProps) => {
	const t = useTranslations("mail");
	const [isCollapsed, setIsCollapsed] = useState(!isLast);

	const senderDisplay = sender.name || sender.email;
	const htmlContent = decodedBody || body;

	return (
		<div className={cn("border-b border-border/30 last:border-b-0", !isCollapsed && "pb-4")}>
			<button
				type='button'
				className={cn(
					"flex w-full cursor-pointer items-start gap-3 border-border/40 px-4 py-3 text-start hover:bg-muted/30",
					"bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80",
					!isCollapsed && "sticky top-0 z-10 border-b"
				)}
				onClick={() => setIsCollapsed((prev) => !prev)}
			>
				<Avatar className='mt-0.5 size-8 shrink-0'>
					<AvatarFallback className='bg-primary/10 text-xs text-primary'>
						{getInitials(sender)}
					</AvatarFallback>
				</Avatar>

				<div className='min-w-0 flex-1'>
					<div className='flex items-center justify-between gap-2'>
						<span className='truncate text-sm font-medium'>{senderDisplay}</span>
						<span className='shrink-0 text-xs text-muted-foreground'>{formatMessageDate(receivedOn)}</span>
					</div>
					{isCollapsed && <p className='truncate text-xs text-muted-foreground'>{body.slice(0, 120)}</p>}
					{!isCollapsed && (
						<p className='text-xs text-muted-foreground'>
							{t("to")} {to.map((r) => r.name || r.email).join(", ")}
							{cc && cc.length > 0 && (
								<>
									{" "}
									&middot; {t("cc")} {cc.map((r) => r.name || r.email).join(", ")}
								</>
							)}
						</p>
					)}
				</div>

				{isCollapsed ? (
					<ChevronDownIcon className='mt-1 size-4 shrink-0 text-muted-foreground' />
				) : (
					<ChevronUpIcon className='mt-1 size-4 shrink-0 text-muted-foreground' />
				)}
			</button>

			{!isCollapsed && (
				<div className='max-w-full overflow-x-auto md:px-4'>
					<ShadowDomHtml className='max-w-full min-w-0' html={htmlContent} />

					{attachments && attachments.length > 0 && (
						<div className='mt-3 flex flex-wrap gap-2'>
							{attachments.map((attachment) => (
								<AttachmentChip
									key={attachment.attachmentId}
									attachment={attachment}
									messageId={id}
									connectionId={connectionId}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
