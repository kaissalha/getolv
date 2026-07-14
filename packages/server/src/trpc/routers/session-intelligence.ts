import { z } from "zod";

import { generateSessionIntelligence } from "../../services/session-intelligence";
import type { StarterRouterFactoryOptions } from "../shared";

const practitionerQaTurnSchema = z.object({
	question: z.string(),
	answer: z.string(),
});

export const createSessionIntelligenceRouter = ({
	createTRPCRouter,
	organizationProcedure,
}: StarterRouterFactoryOptions) =>
	createTRPCRouter({
		analyze: organizationProcedure
			.input(
				z.object({
					sessionId: z.string(),
					patientId: z.string(),
					patientName: z.string().optional(),
					practitionerQaTurns: z.array(practitionerQaTurnSchema).optional(),
					practitionerPrompt: z.string().optional(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				generateSessionIntelligence({
					sessionId: input.sessionId,
					patientId: input.patientId,
					patientName: input.patientName ?? null,
					organizationId: ctx.activeOrganizationId,
					practitionerName: ctx.user.name,
					practitionerEmail: ctx.user.email,
					practitionerQaTurns: input.practitionerQaTurns ?? [],
					practitionerPrompt: input.practitionerPrompt,
				})
			),
	});
