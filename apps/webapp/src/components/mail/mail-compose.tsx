"use client";

import { useCallback, useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import { Button, buttonVariants } from "@getolv/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@getolv/ui/components/credenza";
import { toast } from "@getolv/ui/components/sonner";
import { cn } from "@getolv/ui/lib/utils";

import { MAIL_COMPOSE_NEW, MAIL_COMPOSE_PARAM } from "./mail-url-state";
import { type ComposeState, useComposeDraft } from "./use-compose-draft";

type MailComposeProps = {
	connectionId: string;
	defaultToEmail?: string;
};

type ComposeFormProps = {
	connectionId: string;
	composeData: ComposeState;
	onClose: () => void;
};

const ComposeForm = ({ connectionId, composeData, onClose }: ComposeFormProps) => {
	const trpc = useTRPC();
	const t = useTranslations("mail");
	const tCommon = useTranslations("common");
	const queryClient = useQueryClient();

	const isReply = Boolean(composeData.threadId);
	const {
		body,
		canSend,
		ccInput,
		ccRecipients,
		commitRecipientInput,
		handleComposeKeyDown,
		handleRecipientKeyDown,
		recipients,
		removeDraftRecipient,
		setBody,
		setCcInput,
		setSubject,
		setToInput,
		showCc,
		showCcField,
		subject,
		toInput,
		toRecipientsForSend,
	} = useComposeDraft({ composeData });

	const invalidateThreads = useCallback(
		() => queryClient.invalidateQueries({ queryKey: trpc.mail.listThreads.queryKey() }),
		[queryClient, trpc.mail.listThreads]
	);

	const sendMutation = useMutation(
		trpc.mail.send.mutationOptions({
			onSuccess: () => {
				toast.success(t("sent"));
				onClose();
				invalidateThreads();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const handleSend = () => {
		if (!toRecipientsForSend.length) {
			return;
		}

		sendMutation.mutate({
			connectionId,
			to: toRecipientsForSend,
			cc: ccRecipients.length > 0 ? ccRecipients : undefined,
			subject,
			body,
			threadId: composeData.threadId,
			inReplyTo: composeData.inReplyTo,
			references: composeData.references,
		});
	};

	return (
		<>
			<CredenzaHeader className='flex shrink-0 min-w-0 flex-row items-start justify-between gap-4 border-b border-border/60 bg-background'>
				<div className='min-w-0 flex-1 overflow-hidden'>
					<CredenzaTitle>{isReply ? t("reply") : t("newMessage")}</CredenzaTitle>
				</div>
				<div className='flex shrink-0 flex-wrap items-center justify-end gap-2'>
					<Button variant='outline' size='sm' onClick={onClose}>
						{t("discard")}
					</Button>
					<Button size='sm' onClick={handleSend} disabled={sendMutation.isPending || !canSend}>
						<SendIcon className='size-4' />
						{sendMutation.isPending ? t("sending") : t("send")}
					</Button>
					<CredenzaClose
						className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 shrink-0")}
						title={tCommon("close")}
					>
						<XIcon className='size-4' />
					</CredenzaClose>
				</div>
			</CredenzaHeader>

			<CredenzaBody
				scrollable={false}
				className='flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-0 [-webkit-overflow-scrolling:touch]'
			>
				{/* Field rows — mirrors email message header metadata */}
				<div className='divide-y divide-border/30 border-b border-border/30'>
					{/* To row */}
					<div className='flex flex-wrap items-center gap-1.5 px-4 py-2.5'>
						<span className='w-12 shrink-0 text-xs text-muted-foreground'>{t("to")}</span>
						{recipients.map((r, i) => (
							<span
								key={r.email}
								className='inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs'
							>
								{r.name || r.email}
								<button
									type='button'
									className='text-muted-foreground transition-colors hover:text-foreground'
									onClick={() => removeDraftRecipient({ field: "to", index: i })}
								>
									<XIcon className='size-3' />
								</button>
							</span>
						))}
						<input
							type='email'
							value={toInput}
							onChange={(e) => setToInput(e.target.value)}
							onKeyDown={(event) => handleRecipientKeyDown({ event, field: "to" })}
							onBlur={() => {
								commitRecipientInput({ field: "to" });
							}}
							placeholder={recipients.length === 0 ? t("addRecipient") : ""}
							className='min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
						/>
						{!showCc && (
							<button
								type='button'
								className='text-xs text-muted-foreground transition-colors hover:text-foreground'
								onClick={showCcField}
							>
								{t("cc")}
							</button>
						)}
					</div>

					{/* Cc row */}
					{showCc && (
						<div className='flex flex-wrap items-center gap-1.5 px-4 py-2.5'>
							<span className='w-12 shrink-0 text-xs text-muted-foreground'>{t("cc")}</span>
							{ccRecipients.map((r, i) => (
								<span
									key={r.email}
									className='inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs'
								>
									{r.name || r.email}
									<button
										type='button'
										className='text-muted-foreground transition-colors hover:text-foreground'
										onClick={() => removeDraftRecipient({ field: "cc", index: i })}
									>
										<XIcon className='size-3' />
									</button>
								</span>
							))}
							<input
								type='email'
								value={ccInput}
								onChange={(e) => setCcInput(e.target.value)}
								onKeyDown={(event) => handleRecipientKeyDown({ event, field: "cc" })}
								onBlur={() => {
									commitRecipientInput({ field: "cc" });
								}}
								placeholder={ccRecipients.length === 0 ? t("addRecipient") : ""}
								className='min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
							/>
						</div>
					)}

					{/* Subject row */}
					<div className='flex items-center gap-2 px-4 py-2.5'>
						<span className='w-12 shrink-0 text-xs text-muted-foreground'>{t("subject")}</span>
						<input
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder={t("subject")}
							disabled={isReply}
							className={cn(
								"flex-1 bg-transparent text-sm outline-none",
								"placeholder:text-muted-foreground",
								"disabled:cursor-default disabled:opacity-60",
								subject && "font-medium"
							)}
						/>
					</div>
				</div>

				{/* Body — like email content area */}
				<textarea
					value={body}
					onChange={(e) => setBody(e.target.value)}
					onKeyDown={(event) => handleComposeKeyDown({ event, onSend: handleSend })}
					placeholder={t("writeMessage")}
					className='min-h-52 w-full flex-1 resize-none bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted-foreground'
				/>
			</CredenzaBody>
		</>
	);
};

export const MailCompose = ({ connectionId, defaultToEmail }: MailComposeProps) => {
	const [composeParam, setComposeParam] = useQueryState(MAIL_COMPOSE_PARAM, parseAsString);

	const composeData = useMemo<ComposeState | null>(() => {
		if (!composeParam) return null;
		if (composeParam === MAIL_COMPOSE_NEW) {
			return {
				to: defaultToEmail ? [{ email: defaultToEmail }] : [],
				subject: "",
			};
		}
		try {
			return JSON.parse(composeParam) as ComposeState;
		} catch {
			return { to: [], subject: "" };
		}
	}, [composeParam, defaultToEmail]);

	const isOpen = composeData !== null;
	const handleClose = useCallback(() => setComposeParam(null), [setComposeParam]);

	return (
		<Credenza type='drawer' side='right' open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<CredenzaPortal>
				<CredenzaContent
					className={cn("flex min-h-0 w-full max-w-2xl flex-col overflow-hidden", "max-sm:max-h-[98dvh]")}
				>
					{composeData && (
						<ComposeForm
							key={composeParam}
							connectionId={connectionId}
							composeData={composeData}
							onClose={handleClose}
						/>
					)}
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};
