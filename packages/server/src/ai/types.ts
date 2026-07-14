import type { InferUITools, UIMessage } from "ai";
import { z } from "zod";

import type { chatTools, dashboardChatTools } from "./tools";

/**
 * Shared app context passed through AI agents and into tools.
 */
export const appContextSchema = z
	.object({
		organizationId: z.string().optional(),
		chatId: z.string().optional(),
		userId: z.string().optional(),
		patientId: z.string().optional(),
		sessionId: z.string().optional(),
		patientContext: z.string().optional(),
		currentUser: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
		locale: z.string().optional(),
		timezone: z.string().optional(),
	})
	.strict();

export type AppContext = z.infer<typeof appContextSchema>;

/**
 * Base message metadata shared across all chat types
 */
export type BaseMessageMetadata = {
	createdAt?: string;
};

/**
 * Base custom UI data types shared across all chat types
 */
export type BaseCustomUIDataTypes = {
	attachment: {
		documentId: string;
		filename: string;
		mediaType: string;
	};
	error: {
		message: string;
	};
	"chat-created": {
		chatId: string;
	};
	"append-message": string;
	"title-generated": undefined;
};

/**
 * Stage type for multi-step UI processes
 */
export type Stage = "noData" | "processing" | "complete";

/**
 * Chat tool types inferred from patient chat tool registry
 */
export type PatientChatTools = InferUITools<typeof chatTools>;

/**
 * Chat tool types inferred from dashboard chat tool registry
 */
export type DashboardChatTools = InferUITools<typeof dashboardChatTools>;

/**
 * Base ChatUIMessage type that all specific chat message types should extend.
 * `UIMessage` is invariant on its type parameters; `any` is the practical supertype so dashboard and patient messages both assign here.
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type BaseChatUIMessage = UIMessage<any, any, any>;

/**
 * Patient session custom UI data types
 */
export type PatientSessionCustomUIDataTypes = {
	"chat-summary": {
		summary: string;
	};
	"summary-generated": {
		stage: Stage;
		title: string;
		shortSummary: string;
		fullSummary: string;
	};
	"todos-generated": {
		stage: Stage;
		todos: string[];
	};
} & BaseCustomUIDataTypes;

/**
 * Dashboard chat message type (no additional custom data)
 */
export type DashboardChatUIMessage = UIMessage<BaseMessageMetadata, BaseCustomUIDataTypes, DashboardChatTools>;

/**
 * Patient session chat message type (with session-specific custom data)
 */
export type PatientSessionChatUIMessage = UIMessage<
	BaseMessageMetadata,
	PatientSessionCustomUIDataTypes,
	PatientChatTools
>;

/**
 * Async generator that yields values from a ReadableStream.
 * Useful for tRPC streaming mutations with createUIMessageStream.
 */
export const streamToAsyncIterable = async function* <T>(stream: ReadableStream<T>) {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			yield value;
		}
	} finally {
		reader.releaseLock();
	}
};
