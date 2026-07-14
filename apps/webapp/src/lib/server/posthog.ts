"server-only";

import { headers } from "next/headers";

import { createPostHog } from "@posthog/next";
import type { Adapter, Identify } from "flags";
import { dedupe } from "flags/next";

import { auth } from "@starter/server/auth";

export const { getPostHog } = createPostHog({
	options: {
		flushAt: 1,
		flushInterval: 0,
	},
	getDistinctId: async () => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		return session?.user?.id;
	},
});

/**
 * Fetches all feature flags for the current user from PostHog.
 * This is deduplicated per-request to avoid multiple API calls.
 */
export const getAllPostHogFlags = dedupe(async () => {
	const posthog = await getPostHog();
	const { featureFlags, featureFlagPayloads } = await posthog.getAllFlagsAndPayloads();
	const context = posthog.getContext();

	return {
		distinctId: context?.distinctId ?? "",
		flags: featureFlags ?? {},
		payloads: featureFlagPayloads,
	};
});

export const getBootstrapData = async () => {
	const { distinctId, flags } = await getAllPostHogFlags();

	return {
		distinctID: distinctId,
		featureFlags: flags,
	};
};

/**
 * Creates a custom adapter that reads from pre-fetched PostHog flags.
 * This avoids making additional API calls for each flag evaluation.
 */
export const createPreFetchedPostHogAdapter = () => {
	return {
		/**
		 * Returns whether a feature flag is enabled (boolean).
		 */
		isFeatureEnabled: <ValueType = boolean>(): Adapter<ValueType, PostHogEntities> => ({
			async decide({ key }) {
				const { flags } = await getAllPostHogFlags();
				const value = flags[key];
				return (value === true ||
					value === "true" ||
					(typeof value === "string" && value !== "false")) as ValueType;
			},
		}),

		/**
		 * Returns the feature flag value (boolean or string for multivariate flags).
		 */
		featureFlagValue: <ValueType = boolean | string>(): Adapter<ValueType, PostHogEntities> => ({
			async decide({ key }) {
				const { flags } = await getAllPostHogFlags();
				return flags[key] as ValueType;
			},
		}),

		/**
		 * Returns the feature flag payload, mapped through a getter function.
		 */
		featureFlagPayload: <ValueType>(
			getter: (payload: unknown) => ValueType
		): Adapter<ValueType, PostHogEntities> => ({
			async decide({ key }) {
				const { payloads } = await getAllPostHogFlags();
				const payload = payloads?.[key];
				return getter(payload);
			},
		}),
	};
};

/**
 * Pre-fetched PostHog adapter that uses getAllFlags to batch flag evaluations.
 * Use this instead of postHogAdapter to avoid multiple API calls.
 */
export const preFetchedPostHogAdapter = createPreFetchedPostHogAdapter();

export type PostHogEntities = {
	distinctId: string;
	posthogSessionId?: string;
};

export const identify = dedupe(async () => {
	const posthog = await getPostHog();
	const context = posthog.getContext();

	return {
		distinctId: context?.distinctId ?? "",
		posthogSessionId: context?.sessionId,
	};
}) satisfies Identify<PostHogEntities>;
