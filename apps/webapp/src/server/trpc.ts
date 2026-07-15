import { headers } from "next/headers";

import { start } from "workflow/api";

import { postProcessSessionTranscript } from "@/workflows/session-transcript-post-processing";
import { creategetolvTRPC } from "@getolv/server";
import { auth } from "@getolv/server/auth";

const trpc = creategetolvTRPC({
	getSession: async () =>
		auth.api.getSession({
			headers: await headers(),
		}),
	queueSessionTranscriptPostProcessing: async (input) => {
		const run = await start(postProcessSessionTranscript, [input]);

		return {
			runId: run.runId,
		};
	},
});

export const { appRouter, createTRPCContext, createTRPCRouter, protectedProcedure, organizationProcedure } = trpc;
