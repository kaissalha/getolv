import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { afterEach, describe, expect, it } from "vitest";

import { db, labTestRangeOverrides, labTestReferenceRanges, labTests } from "@getolv/db";

import { determineLabStatus, findLabTestByNameOrAlias, getRangesForTest } from "../../src/services/lab-catalog";
import { cleanupOrganization, createTestOrganization, createTestPatient } from "../helpers/db";

describe("lab catalog service", () => {
	const organizationIds: string[] = [];
	const labTestIds: string[] = [];

	afterEach(async () => {
		// Clean up lab test data first (no organizationId)
		for (const id of labTestIds) {
			await db.delete(labTestRangeOverrides).where(eq(labTestRangeOverrides.labTestId, id));
			await db.delete(labTestReferenceRanges).where(eq(labTestReferenceRanges.labTestId, id));
			await db.delete(labTests).where(eq(labTests.id, id));
		}
		labTestIds.length = 0;

		for (const id of organizationIds) {
			await cleanupOrganization(id);
		}
		organizationIds.length = 0;
	});

	const createTrackedOrganization = async () => {
		const org = await createTestOrganization();
		organizationIds.push(org.id);
		return org;
	};

	const createTrackedLabTest = async (values: {
		code: string;
		name: string;
		category: string;
		aliases: string[];
	}) => {
		const [labTest] = await db.insert(labTests).values(values).returning();
		labTestIds.push(labTest.id);
		return labTest;
	};

	it("finds lab tests by name or alias", async () => {
		const suffix = uuidv4().slice(0, 8);
		const labTest = await createTrackedLabTest({
			code: `GLU-${suffix}`,
			name: `Glucose-${suffix}`,
			category: "Blood",
			aliases: [`Blood Sugar-${suffix}`],
		});

		const foundByName = await findLabTestByNameOrAlias({ name: `Glucose-${suffix}` });
		const foundByAlias = await findLabTestByNameOrAlias({ name: `Blood Sugar-${suffix}` });

		expect(foundByName?.id).toBe(labTest.id);
		expect(foundByAlias?.id).toBe(labTest.id);
	});

	it("returns ranges with overrides when present", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const suffix = uuidv4().slice(0, 8);
		const labTest = await createTrackedLabTest({
			code: `HGB-${suffix}`,
			name: `Hemoglobin-${suffix}`,
			category: "Blood",
			aliases: [],
		});

		await db.insert(labTestReferenceRanges).values({
			labTestId: labTest.id,
			country: "US",
			unit: "g/dL",
			ranges: [{ min: 12, max: 16, status: "optimal" }],
			source: "Default",
		});

		await db.insert(labTestRangeOverrides).values({
			labTestId: labTest.id,
			patientId: patient.id,
			unit: "g/dL",
			ranges: [{ min: 13, max: 17, status: "optimal" }],
		});

		const result = await getRangesForTest({
			labTestId: labTest.id,
			patientId: patient.id,
			country: "US",
		});

		expect(result?.isOverride).toBe(true);
		expect(result?.ranges[0]?.min).toBe(13);
	});

	it("determines status for out-of-range values", () => {
		const status = determineLabStatus({
			value: 50,
			ranges: [{ min: 0, max: 10, status: "optimal" }],
		});

		expect(status).toBe("critical");
	});
});
