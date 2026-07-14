import { createScribeToken } from "../../services/scribe";
import type { StarterRouterFactoryOptions } from "../shared";

export const createScribeRouter = ({ createTRPCRouter, protectedProcedure }: StarterRouterFactoryOptions) =>
	createTRPCRouter({
		getToken: protectedProcedure.query(async () => {
			return createScribeToken();
		}),
	});
