import { cache } from "react";

import { and, eq, ilike, or, sql } from "drizzle-orm";

import {
	type Country,
	db,
	type LabTest,
	labTestRangeOverrides,
	labTestReferenceRanges,
	labTests,
	type ReferenceRanges,
} from "@starter/db";

import { getLocationFromHeaders } from "./location";

export type LabTestWithRanges = LabTest & {
	unit: string;
	ranges: ReferenceRanges;
	source: string | null;
};

/**
 * Get the country code for lab reference ranges based on geo-location.
 * Maps the country code from headers to our supported countries (US, CA).
 * Defaults to US if the country is not supported.
 */
export const getLabCountry = async (): Promise<Country> => {
	const location = await getLocationFromHeaders();
	const countryCode = location.countryCode.toUpperCase();

	// Map country code to our supported countries
	if (countryCode === "CA") {
		return "CA";
	}

	// Default to US for all other countries
	return "US";
};

/**
 * Get all lab tests from the catalog with reference ranges for a specific country.
 */
export const getLabTestsCatalog = cache(async ({ country }: { country: Country }): Promise<LabTestWithRanges[]> => {
	const results = await db
		.select({
			id: labTests.id,
			code: labTests.code,
			loincCode: labTests.loincCode,
			name: labTests.name,
			category: labTests.category,
			aliases: labTests.aliases,
			createdAt: labTests.createdAt,
			updatedAt: labTests.updatedAt,
			unit: labTestReferenceRanges.unit,
			ranges: labTestReferenceRanges.ranges,
			source: labTestReferenceRanges.source,
		})
		.from(labTests)
		.innerJoin(labTestReferenceRanges, eq(labTests.id, labTestReferenceRanges.labTestId))
		.where(eq(labTestReferenceRanges.country, country));

	return results;
});

/**
 * Find a lab test by name or alias (case-insensitive).
 */
export const findLabTestByNameOrAlias = cache(async ({ name }: { name: string }): Promise<LabTest | null> => {
	const normalizedName = name.trim().toLowerCase();

	// First, try exact match on code or name
	const exactMatch = await db
		.select()
		.from(labTests)
		.where(or(ilike(labTests.code, normalizedName), ilike(labTests.name, normalizedName)))
		.limit(1);

	if (exactMatch.length > 0) {
		return exactMatch[0];
	}

	// Search in aliases using JSONB containment
	const aliasMatch = await db
		.select()
		.from(labTests)
		.where(sql`EXISTS (
			SELECT 1 FROM jsonb_array_elements_text(${labTests.aliases}) AS alias
			WHERE LOWER(alias) = ${normalizedName}
		)`)
		.limit(1);

	if (aliasMatch.length > 0) {
		return aliasMatch[0];
	}

	return null;
});

/**
 * Get reference ranges for a lab test, applying override hierarchy:
 * 1. Patient override (if exists)
 * 2. Default ranges from lab_test_reference_ranges for the country
 */
export const getRangesForTest = async ({
	labTestId,
	patientId,
	country,
}: {
	labTestId: string;
	patientId: string;
	country: Country;
}): Promise<{ ranges: ReferenceRanges; unit: string; source: string | null; isOverride: boolean } | null> => {
	// First, check for patient override
	const patientOverride = await db
		.select()
		.from(labTestRangeOverrides)
		.where(and(eq(labTestRangeOverrides.labTestId, labTestId), eq(labTestRangeOverrides.patientId, patientId)))
		.limit(1);

	if (patientOverride.length > 0) {
		const override = patientOverride[0];
		// If unit is not specified in override, get it from default ranges
		let unit = override.unit;
		if (!unit) {
			const defaultRange = await db
				.select({ unit: labTestReferenceRanges.unit })
				.from(labTestReferenceRanges)
				.where(
					and(eq(labTestReferenceRanges.labTestId, labTestId), eq(labTestReferenceRanges.country, country))
				)
				.limit(1);

			unit = defaultRange[0]?.unit ?? "";
		}

		return {
			ranges: override.ranges,
			unit,
			source: "Patient Override",
			isOverride: true,
		};
	}

	// Get default ranges for the country
	const defaultRanges = await db
		.select()
		.from(labTestReferenceRanges)
		.where(and(eq(labTestReferenceRanges.labTestId, labTestId), eq(labTestReferenceRanges.country, country)))
		.limit(1);

	if (defaultRanges.length > 0) {
		return {
			ranges: defaultRanges[0].ranges,
			unit: defaultRanges[0].unit,
			source: defaultRanges[0].source,
			isOverride: false,
		};
	}

	return null;
};

/**
 * Determine the status of a lab value based on reference ranges.
 */
export const determineLabStatus = ({
	value,
	ranges,
}: {
	value: number;
	ranges: ReferenceRanges;
}): "optimal" | "suboptimal" | "critical" => {
	for (const range of ranges) {
		if (value >= range.min && value <= range.max) {
			return range.status;
		}
	}

	// If no range matches, check if value is outside all ranges
	const allMins = ranges.map((r) => r.min);
	const allMaxs = ranges.map((r) => r.max);
	const globalMin = Math.min(...allMins);
	const globalMax = Math.max(...allMaxs);

	if (value < globalMin || value > globalMax) {
		// Value is outside all defined ranges, consider it critical
		return "critical";
	}

	// Default to suboptimal if no matching range
	return "suboptimal";
};
