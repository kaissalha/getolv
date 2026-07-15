import { createScribeToken } from "../../services/scribe";
import type { getolvRouterFactoryOptions } from "../shared";

export const createScribeRouter = ({ createTRPCRouter, protectedProcedure }: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		getToken: protectedProcedure.query(async () => {
			return createScribeToken();
		}),
	});
