import { attachDatabasePool } from "@vercel/functions";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { relations } from "./relations.ts";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required.");
}

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	// https://node-postgres.com/guides/pool-sizing#vercel
	max: 10,
	// Vercel recommends short idle timeouts so attachDatabasePool can close
	// idle connections before function suspension.
	idleTimeoutMillis: 5_000,
	connectionTimeoutMillis: 10_000,
	keepAlive: true,
	keepAliveInitialDelayMillis: 10_000,
});

if (process.env.NODE_ENV !== "test") {
	attachDatabasePool(pool);
}

export const db = drizzle({
	client: pool,
	relations,
	logger: false,
	cache:
		process.env.NODE_ENV === "test"
			? await import("./db-test-redis-cache").then(({ createTestRedisCache }) =>
					createTestRedisCache({
						url: process.env.REDIS_URL!,
						config: { ex: 60 },
					})
				)
			: upstashCache({
					url: process.env.UPSTASH_URL!,
					token: process.env.UPSTASH_TOKEN!,
					config: { ex: 60 },
				}),
});

// Export relations for use elsewhere
export * from "./relations.ts";
export * from "./schema/ai/chat.ts";
export * from "./schema/ai/daily-summary.ts";
export * from "./schema/ai/message.ts";
export * from "./schema/ai/stream.ts";
export * from "./schema/auth/accounts.ts";
export * from "./schema/auth/invitations.ts";
export * from "./schema/auth/members.ts";
export * from "./schema/auth/organizations.ts";
export * from "./schema/auth/sessions.ts";
export * from "./schema/auth/users.ts";
export * from "./schema/auth/verifications.ts";
export * from "./schema/integrations/oauth-connections.ts";
export * from "./schema/lab-tests/lab-test-range-overrides.ts";
export * from "./schema/lab-tests/lab-test-reference-ranges.ts";
export * from "./schema/lab-tests/lab-tests.ts";
export * from "./schema/media/storage.ts";
export * from "./schema/notes/note-mentions.ts";
export * from "./schema/notes/notes.ts";
export * from "./schema/patients/patients.ts";
export * from "./schema/patients/sessions/patient-lab-reports.ts";
export * from "./schema/patients/sessions/patient-lab-results.ts";
export * from "./schema/patients/sessions/patient-sessions.ts";
export * from "./schema/patients/sessions/patient-treatment-plans.ts";
export * from "./schema/patients/sessions/session-transcript-turns.ts";
export * from "./schema/patients/sessions/patient-workout-plan-days.ts";
export * from "./schema/patients/sessions/patient-workout-plan-exercises.ts";
export * from "./schema/patients/sessions/patient-workout-plans.ts";
export * from "./schema/rag/document-chunks.ts";
export * from "./schema/rag/documents.ts";
export * from "./schema/workouts/body-parts.ts";
export * from "./schema/workouts/exercise-body-parts.ts";
export * from "./schema/workouts/exercise-equipments.ts";
export * from "./schema/workouts/exercise-muscles.ts";
export * from "./schema/workouts/equipments.ts";
export * from "./schema/workouts/exercises.ts";
export * from "./schema/workouts/muscle-body-parts.ts";
export * from "./schema/workouts/muscles.ts";
export * from "./schema/subscription.ts";
export * from "./utils/pagination.ts";
export * from "./utils/search.ts";
export * from "./utils/sorting.ts";

export type Transaction = Parameters<Parameters<(typeof db)["transaction"]>[0]>[0];
export type Database = typeof db;
