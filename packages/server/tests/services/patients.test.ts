import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { afterEach, describe, expect, it } from "vitest";

import {
	createPatient,
	deletePatient,
	getPatient,
	getPatientByEmail,
	listPatients,
	updatePatient,
	updatePatientClinicalState,
} from "../../src/services/patients";
import { cleanupOrganization, createTestOrganization, createTestPatient } from "../helpers/db";

describe("patients service", () => {
	const organizationIds: string[] = [];

	afterEach(async () => {
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

	it("creates and fetches a patient", async () => {
		const organization = await createTrackedOrganization();

		const created = await createPatient({
			organizationId: organization.id,
			firstName: "Ada",
			lastName: "Lovelace",
			email: "ada@example.com",
		});

		const fetched = await getPatient({ id: created.id, organizationId: organization.id });

		expect(fetched?.email).toBe("ada@example.com");
	});

	it("lists patients with pagination", async () => {
		const organization = await createTrackedOrganization();
		await createTestPatient({ organizationId: organization.id });

		const result = await listPatients({ organizationId: organization.id, pageSize: 10 });

		expect(result.data.length).toBeGreaterThan(0);
		expect(result.meta.totalData).toBeGreaterThan(0);
	});

	it("updates patient and throws when missing", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const updated = await updatePatient({
			id: patient.id,
			organizationId: organization.id,
			firstName: "Updated",
			lastName: "Name",
			email: "updated@example.com",
			phoneNumber: null,
		});

		expect(updated.firstName).toBe("Updated");

		await expect(
			updatePatient({
				id: uuidv4(),
				organizationId: organization.id,
				firstName: "Missing",
				lastName: "Patient",
				email: "missing@example.com",
				phoneNumber: null,
			})
		).rejects.toBeInstanceOf(TRPCError);
	});

	it("finds a patient by email (case-insensitive) within the organization", async () => {
		const organization = await createTrackedOrganization();
		const otherOrganization = await createTrackedOrganization();

		await createPatient({
			organizationId: organization.id,
			firstName: "Grace",
			lastName: "Hopper",
			email: "Grace@example.com",
		});

		const matched = await getPatientByEmail({ email: "  GRACE@EXAMPLE.COM ", organizationId: organization.id });
		expect(matched?.firstName).toBe("Grace");

		const empty = await getPatientByEmail({ email: "", organizationId: organization.id });
		expect(empty).toBeNull();

		const otherOrg = await getPatientByEmail({
			email: "grace@example.com",
			organizationId: otherOrganization.id,
		});
		expect(otherOrg).toBeNull();
	});

	it("deletes a patient", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		await deletePatient({ id: patient.id, organizationId: organization.id });

		const fetched = await getPatient({ id: patient.id, organizationId: organization.id });
		expect(fetched).toBeUndefined();
	});

	it("updates a patient's diagnosis and active todos", async () => {
		const organization = await createTrackedOrganization();
		const patient = await createTestPatient({ organizationId: organization.id });

		const updated = await updatePatientClinicalState({
			id: patient.id,
			organizationId: organization.id,
			diagnosis: {
				workingDx: [
					{
						name: " Iron deficiency ",
						reasoning: " Low ferritin ",
						evidence: " CBC shows microcytosis ",
						missing: "",
						verifyNext: " Repeat ferritin ",
					},
				],
				differentialDx: [
					{
						name: "Anemia of chronic disease",
						reasoning: null,
						evidence: null,
						missing: "Inflammatory markers",
						verifyNext: null,
					},
				],
			},
			todos: [
				{
					id: " repeat-labs ",
					text: " Order repeat ferritin ",
					category: " labs ",
				},
				{
					id: "empty-todo",
					text: "   ",
					category: null,
				},
			],
		});

		expect(updated.diagnosis.workingDx).toEqual([
			{
				name: "Iron deficiency",
				reasoning: "Low ferritin",
				evidence: "CBC shows microcytosis",
				missing: null,
				verifyNext: "Repeat ferritin",
			},
		]);
		expect(updated.diagnosis.differentialDx).toEqual([
			{
				name: "Anemia of chronic disease",
				reasoning: null,
				evidence: null,
				missing: "Inflammatory markers",
				verifyNext: null,
			},
		]);
		expect(updated.todos).toEqual([
			{
				id: "repeat-labs",
				text: "Order repeat ferritin",
				category: "labs",
			},
		]);
	});
});
