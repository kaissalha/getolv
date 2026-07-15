"use client";

import type { ThreadResponse } from "@getolv/app-store";

import { MailMessage } from "./mail-message";

type MailThreadDetailBodyProps = {
	connectionId: string;
	isLoading: boolean;
	messages: ThreadResponse["messages"];
};

export const MailThreadDetailBody = ({ connectionId, isLoading, messages }: MailThreadDetailBodyProps) => {
	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent' />
			</div>
		);
	}

	return (
		<div className='min-w-0 divide-y divide-border/30 pb-6'>
			{messages.map((message, index) => (
				<MailMessage
					key={message.id}
					id={message.id}
					subject={message.subject}
					sender={message.sender}
					to={message.to}
					cc={message.cc}
					receivedOn={message.receivedOn}
					body={message.body}
					decodedBody={message.decodedBody}
					isUnread={message.isUnread}
					attachments={message.attachments}
					isLast={index === messages.length - 1}
					connectionId={connectionId}
				/>
			))}
		</div>
	);
};
