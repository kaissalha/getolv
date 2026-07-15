import { z } from "zod";

import { getDailySummary } from "../../services/daily-summary";
import type { getolvRouterFactoryOptions } from "../shared";

export const createDailySummaryRouter = ({ createTRPCRouter, organizationProcedure }: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		get: organizationProcedure
			.input(
				z.object({
					now: z.date().optional(),
				})
			)
			.query(async ({ input, ctx }) =>
				getDailySummary({
					organizationId: ctx.activeOrganizationId,
					userId: ctx.user.id,
					now: input.now,
				})
			),
	});
