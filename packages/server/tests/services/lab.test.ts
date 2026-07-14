import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db, labTests } from "@starter/db";

const { getLabCountry, getRangesForTest, determineLabStatus } = vi.hoisted(() => ({
	getLabCountry: vi.fn(),
	getRangesForTest: vi.fn(),
	determineLabStatus: vi.fn(),
}));

vi.mock("../../src/services/lab-catalog", () => ({
	getLabCountry,
	getRangesForTest,
	determineLabStatus,
	findLabTestByNameOrAlias: vi.fn(),
	getLabTestsCatalog: vi.fn(),
}));

import {
	createLabReport,
	getUnassignedLabResults,
	insertLabResults,
	updateLabReportSummary,
} from "../../src/services/lab";
import { cleanupOrganization, createTestOrganization, createTestPatient } from "../helpers/db";

describe("lab service", () => {
	const organizationIds: string[] = [];
	const labTestIds: string[] = [];

	beforeEach(() => {
		getLabCountry.mockResolvedValue("US");
		getRangesForTest.mockResolvedValue({
			ranges: [{ min: 0, max: 10, status: "optimal" }],
			unit: "mg/dL",
			source: "Default",
			isOverride: false,
		});
		determineLabStatus.mockReturnValue("optimal");
	});

	afterEach(async () => {
		// Clean up organization data first (cascades to patientLabResults)
		for (const id of organizationIds) {
			await cleanupOrganization(id);
		}
		organizationIds.length = 0;

		// Then clean up lab test data (no organizationId)
		for (const id of labTestIds) {
			await db.delete(labTests).where(eq(labTests.id, id));
		}
		labTestIds.length = 0;
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

	it("creates and updates lab reports", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const report = await createLabReport({
			patientId: patient.id,
			organizationId: organization.id,
		});

		const updated = await updateLabReportSummary({ labReportId: report.id, summary: "Summary" });

		expect(updated.summary).toBe("Summary");
	});

	it("inserts and fetches unassigned lab results", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const suffix = uuidv4().slice(0, 8);
		const labTest = await createTrackedLabTest({
			code: `GLU-${suffix}`,
			name: `Glucose-${suffix}`,
			category: "Blood",
			aliases: [],
		});

		const report = await createLabReport({
			patientId: patient.id,
			organizationId: organization.id,
		});

		await insertLabResults({
			patientSessionId: null,
			patientId: patient.id,
			labReportId: report.id,
			data: [
				{
					labTestId: labTest.id,
					name: "Glucose",
					category: "Blood",
					value: 5,
					unit: "mg/dL",
					ranges: [{ min: 0, max: 10, status: "optimal" }],
				},
			],
		});

		const results = await getUnassignedLabResults({ patientId: patient.id });

		expect(results.length).toBe(1);
		expect(results[0]?.status).toBe("optimal");
	});
});
