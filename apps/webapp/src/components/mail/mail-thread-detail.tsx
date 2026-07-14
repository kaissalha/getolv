"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@starter/ui/components/credenza";
import { cn } from "@starter/ui/lib/utils";

import { MailThreadDetailBody } from "./mail-thread-detail-body";
import { MailThreadDetailHeader } from "./mail-thread-detail-header";
import { MailThreadDetailToolbar } from "./mail-thread-detail-toolbar";
import { useMailThreadDetailController } from "./use-mail-thread-detail-controller";

type MailThreadDetailProps = {
	connectionId: string;
	onChange?: () => void;
};

export const MailThreadDetail = ({ connectionId, onChange }: MailThreadDetailProps) => {
	const t = useTranslations("mail");
	const {
		archiveThread,
		classificationLabel,
		handleClose,
		handleReply,
		handleToggleStar,
		isMobile,
		isOpen,
		isStarred,
		isThreadLoading,
		markThreadAsUnread,
		messages,
		shouldReduceMotion,
		subject,
		trashThread,
	} = useMailThreadDetailController({
		connectionId,
		onChange,
	});
	const threadAccessibleLabel = subject || t("noSubject");
	const firstSenderEmail = messages[0]?.sender?.email;

	const header = (
		<MailThreadDetailHeader
			classificationLabel={classificationLabel}
			messageCount={messages.length}
			senderEmail={firstSenderEmail}
			subject={subject}
		/>
	);

	const toolbar = (
		<MailThreadDetailToolbar
			isStarred={isStarred}
			onArchive={archiveThread}
			onMarkUnread={markThreadAsUnread}
			onReply={handleReply}
			onToggleStar={handleToggleStar}
			onTrash={trashThread}
		/>
	);

	const body = <MailThreadDetailBody connectionId={connectionId} isLoading={isThreadLoading} messages={messages} />;

	if (isMobile) {
		return (
			<Credenza type='drawer' side='right' open={isOpen} onOpenChange={(open) => !open && handleClose()}>
				<CredenzaPortal>
					<CredenzaContent
						className={cn("flex min-h-0 w-full max-w-2xl flex-col overflow-hidden", "max-sm:max-h-[98dvh]")}
					>
						<CredenzaHeader className='flex shrink-0 min-w-0 flex-row items-center justify-between gap-4 border-b border-border/60 bg-background'>
							<CredenzaTitle className='sr-only'>{threadAccessibleLabel}</CredenzaTitle>
							{header}
							{toolbar}
						</CredenzaHeader>

						<CredenzaBody
							scrollable={false}
							className='min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-0 [-webkit-overflow-scrolling:touch]'
						>
							<div data-base-ui-swipe-ignore>{body}</div>
						</CredenzaBody>
					</CredenzaContent>
				</CredenzaPortal>
			</Credenza>
		);
	}

	return (
		<AnimatePresence initial={false}>
			{isOpen && (
				<motion.section
					key='mail-thread-detail'
					className='flex min-h-0 min-w-0 flex-1 flex-col will-change-transform'
					aria-label={threadAccessibleLabel}
					initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
					animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
					exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
					transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
				>
					<div className='flex shrink-0 items-center justify-between gap-4 border-b border-border/50 px-5 py-3'>
						{header}
						<MailThreadDetailToolbar
							isStarred={isStarred}
							onArchive={archiveThread}
							onClose={handleClose}
							onMarkUnread={markThreadAsUnread}
							onReply={handleReply}
							onToggleStar={handleToggleStar}
							onTrash={trashThread}
							showClose
						/>
					</div>
					<div className='min-h-0 flex-1 overflow-y-auto'>{body}</div>
				</motion.section>
			)}
		</AnimatePresence>
	);
};
