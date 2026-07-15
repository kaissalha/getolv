"use client";

import { useCallback, useEffect, useRef } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@getolv/server";
import { toast } from "@getolv/ui/components/sonner";
import { useIsMobile } from "@getolv/ui/hooks/use-mobile";

import { patchThreadClassificationInQueryData } from "./mail-thread-classification";
import { patchMailThreadStarState } from "./mail-thread-star-state";
import { MAIL_COMPOSE_PARAM, MAIL_THREAD_ID_PARAM } from "./mail-url-state";
import type { MailThreadInfiniteData } from "./use-mail-thread-list-query";

type UseMailThreadDetailControllerProps = {
	connectionId: string;
	onChange?: () => void;
};

type MailThreadDetailData = RouterOutput["mail"]["getThread"];

export const useMailThreadDetailController = ({ connectionId, onChange }: UseMailThreadDetailControllerProps) => {
	const trpc = useTRPC();
	const t = useTranslations("mail");
	const tCommon = useTranslations("common");
	const queryClient = useQueryClient();
	const isMobile = useIsMobile();
	const shouldReduceMotion = useReducedMotion();
	const [threadId, setThreadId] = useQueryState(MAIL_THREAD_ID_PARAM, parseAsString);
	const [, setCompose] = useQueryState(MAIL_COMPOSE_PARAM, parseAsString);

	const isOpen = Boolean(threadId);

	const threadQuery = useQuery(
		trpc.mail.getThread.queryOptions({ connectionId, threadId: threadId! }, { enabled: isOpen })
	);
	const thread = threadQuery.data;

	const markReadOpenedRef = useRef<string | null>(null);

	useEffect(() => {
		if (!isOpen) {
			markReadOpenedRef.current = null;
		}
	}, [isOpen]);

	const invalidateThreads = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: trpc.mail.listThreads.queryKey() });
	}, [queryClient, trpc.mail.listThreads]);

	const invalidateThread = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: trpc.mail.getThread.queryKey() });
	}, [queryClient, trpc.mail.getThread]);

	const patchThreadStarState = useCallback(
		({ isStarred, threadId }: { isStarred: boolean; threadId: string }) => {
			queryClient.setQueryData<MailThreadDetailData>(
				trpc.mail.getThread.queryKey({ connectionId, threadId }),
				(currentData) => {
					if (!currentData) {
						return currentData;
					}

					return {
						...currentData,
						latest: currentData.latest
							? patchMailThreadStarState({ isStarred, thread: currentData.latest })
							: currentData.latest,
						messages: currentData.messages.map((message) =>
							patchMailThreadStarState({ isStarred, thread: message })
						),
					};
				}
			);

			queryClient.setQueriesData<MailThreadInfiniteData>(
				{ queryKey: trpc.mail.listThreads.queryKey() },
				(currentData) => {
					if (!currentData) {
						return currentData;
					}

					return {
						...currentData,
						pages: currentData.pages.map((page) => ({
							...page,
							threads: page.threads.map((thread) => {
								if (thread.id !== threadId) {
									return thread;
								}

								return patchMailThreadStarState({ isStarred, thread });
							}),
						})),
					};
				}
			);
		},
		[connectionId, queryClient, trpc.mail.getThread, trpc.mail.listThreads]
	);

	const { mutate: markOpenedAsRead } = useMutation(
		trpc.mail.markAsRead.mutationOptions({
			onSettled: () => {
				invalidateThreads();
				invalidateThread();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	useEffect(() => {
		if (!isOpen || !threadId || !threadQuery.isSuccess || !threadQuery.data.hasUnread) {
			return;
		}
		if (markReadOpenedRef.current === threadId) {
			return;
		}
		markReadOpenedRef.current = threadId;
		markOpenedAsRead({ connectionId, threadIds: [threadId] });
	}, [connectionId, isOpen, markOpenedAsRead, threadId, threadQuery.data?.hasUnread, threadQuery.isSuccess]);

	useEffect(() => {
		const classificationLabel = thread?.classificationLabel;

		if (!threadId || !classificationLabel) {
			return;
		}

		queryClient.setQueriesData({ queryKey: trpc.mail.listThreads.queryKey() }, (currentData) =>
			patchThreadClassificationInQueryData({
				classificationLabel,
				data: currentData,
				labelIds: thread.latest?.labelIds,
				threadId,
			})
		);
	}, [queryClient, thread?.classificationLabel, thread?.latest?.labelIds, threadId, trpc.mail.listThreads]);

	const archiveMutation = useMutation(
		trpc.mail.archive.mutationOptions({
			onMutate: () => {
				toast.success(t("archived"));
				setThreadId(null);
			},
			onSettled: () => {
				invalidateThreads();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const trashMutation = useMutation(
		trpc.mail.trash.mutationOptions({
			onMutate: () => {
				toast.success(t("trashed"));
				setThreadId(null);
			},
			onSettled: () => {
				invalidateThreads();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const starMutation = useMutation(
		trpc.mail.star.mutationOptions({
			onMutate: ({ threadIds }) => {
				threadIds.forEach((id) => patchThreadStarState({ isStarred: true, threadId: id }));
			},
			onSettled: () => {
				invalidateThreads();
				invalidateThread();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const unstarMutation = useMutation(
		trpc.mail.unstar.mutationOptions({
			onMutate: ({ threadIds }) => {
				threadIds.forEach((id) => patchThreadStarState({ isStarred: false, threadId: id }));
			},
			onSettled: () => {
				invalidateThreads();
				invalidateThread();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const markUnreadMutation = useMutation(
		trpc.mail.markAsUnread.mutationOptions({
			onMutate: () => {
				toast.success(t("markedUnread"));
				setThreadId(null);
			},
			onSettled: () => {
				invalidateThreads();
				onChange?.();
			},
			onError: () => toast.error(tCommon("errors.somethingWentWrong")),
		})
	);

	const messages = thread?.messages ?? [];
	const subject = messages[0]?.subject ?? "";
	const lastMessage = messages[messages.length - 1];
	const isStarred = messages.some((message) => message.isStarred);

	const handleClose = useCallback(() => {
		setThreadId(null);
	}, [setThreadId]);

	const handleReply = useCallback(() => {
		if (!lastMessage || !threadId) {
			return;
		}

		void setCompose(
			JSON.stringify({
				threadId,
				inReplyTo: lastMessage.messageId,
				references: lastMessage.references,
				to: [lastMessage.sender],
				subject: lastMessage.subject.startsWith("Re:") ? lastMessage.subject : `Re: ${lastMessage.subject}`,
			})
		);
	}, [lastMessage, setCompose, threadId]);

	const handleToggleStar = useCallback(() => {
		if (!threadId) {
			return;
		}

		const payload = { connectionId, threadIds: [threadId] };

		if (isStarred) {
			unstarMutation.mutate(payload);
			return;
		}

		starMutation.mutate(payload);
	}, [connectionId, isStarred, starMutation, threadId, unstarMutation]);

	const archiveThread = useCallback(() => {
		if (!threadId) {
			return;
		}

		archiveMutation.mutate({ connectionId, threadIds: [threadId] });
	}, [archiveMutation, connectionId, threadId]);

	const markThreadAsUnread = useCallback(() => {
		if (!threadId) {
			return;
		}

		markUnreadMutation.mutate({ connectionId, threadIds: [threadId] });
	}, [connectionId, markUnreadMutation, threadId]);

	const trashThread = useCallback(() => {
		if (!threadId) {
			return;
		}

		trashMutation.mutate({ connectionId, threadIds: [threadId] });
	}, [connectionId, threadId, trashMutation]);

	return {
		archiveThread,
		classificationLabel: thread?.classificationLabel ?? null,
		handleClose,
		handleReply,
		handleToggleStar,
		isMobile,
		isOpen,
		isStarred,
		isThreadLoading: threadQuery.isLoading,
		markThreadAsUnread,
		messages,
		shouldReduceMotion,
		subject,
		trashThread,
	};
};
