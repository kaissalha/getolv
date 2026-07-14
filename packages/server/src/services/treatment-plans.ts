import { cache } from "react";

import { and, eq } from "drizzle-orm";

import { db, patientTreatmentPlans, type PatientTreatmentPlanContent } from "@starter/db";

export const listPatientTreatmentPlans = cache(
	async ({ organizationId, patientId }: { organizationId: string; patientId: string }) => {
		return db.query.patientTreatmentPlans.findMany({
			where: {
				organizationId,
				patientId,
			},
			columns: {
				createdAt: true,
				id: true,
				patientSessionId: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}
);

export const getSessionTreatmentPlan = cache(
	async ({
		organizationId,
		patientId,
		sessionId,
	}: {
		organizationId: string;
		patientId: string;
		sessionId: string;
	}) => {
		return db.query.patientTreatmentPlans.findFirst({
			where: {
				organizationId,
				patientId,
				patientSessionId: sessionId,
			},
			with: {
				patientSession: true,
			},
		});
	}
);

export const upsertSessionTreatmentPlan = async ({
	data,
	organizationId,
	patientId,
	practitionerEmail,
	practitionerName,
	sessionId,
}: {
	data: PatientTreatmentPlanContent;
	organizationId: string;
	patientId: string;
	practitionerEmail?: string | null;
	practitionerName?: string | null;
	sessionId: string;
}) => {
	const existingPlan = await db.query.patientTreatmentPlans.findFirst({
		where: {
			organizationId,
			patientId,
			patientSessionId: sessionId,
		},
	});

	if (!existingPlan) {
		const [createdPlan] = await db
			.insert(patientTreatmentPlans)
			.values({
				data,
				generatedByEmail: practitionerEmail ?? null,
				generatedByName: practitionerName ?? null,
				organizationId,
				patientId,
				patientSessionId: sessionId,
			})
			.returning();

		return createdPlan;
	}

	const [updatedPlan] = await db
		.update(patientTreatmentPlans)
		.set({
			data,
			generatedByEmail: practitionerEmail ?? existingPlan.generatedByEmail,
			generatedByName: practitionerName ?? existingPlan.generatedByName,
			updatedAt: new Date().toISOString(),
		})
		.where(
			and(eq(patientTreatmentPlans.id, existingPlan.id), eq(patientTreatmentPlans.organizationId, organizationId))
		)
		.returning();

	return updatedPlan;
};
