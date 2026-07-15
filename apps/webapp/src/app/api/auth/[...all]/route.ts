import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@getolv/server/auth";

export const { GET, POST } = toNextJsHandler(auth);
