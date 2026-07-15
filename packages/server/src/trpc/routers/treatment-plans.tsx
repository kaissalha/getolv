import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { TreatmentPlanPdf, renderToBuffer } from "@getolv/pdf";

import { getPatient } from "../../services/patients";
import { getSessionTreatmentPlan } from "../../services/treatment-plans";
import type { getolvRouterFactoryOptions } from "../shared";

const formatDate = ({ value }: { value: string | null | undefined }) => {
	const fallbackDate = new Date();
	const date = value ? new Date(value) : fallbackDate;

	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

export const createTreatmentPlansRouter = ({ createTRPCRouter, organizationProcedure }: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		generateTreatmentPlanPdf: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					sessionId: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const [patient, treatmentPlan] = await Promise.all([
					getPatient({ id: input.patientId, organizationId: ctx.activeOrganizationId }),
					getSessionTreatmentPlan({
						organizationId: ctx.activeOrganizationId,
						patientId: input.patientId,
						sessionId: input.sessionId,
					}),
				]);

				if (!patient) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
				}

				if (!treatmentPlan) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Treatment plan not found for this session" });
				}

				const practitionerName = treatmentPlan.generatedByName ?? ctx.user.name ?? "Practitioner";
				const practitionerEmail = treatmentPlan.generatedByEmail ?? ctx.user.email;
				const sessionDate = formatDate({
					value: treatmentPlan.patientSession?.finalizedAt ?? treatmentPlan.patientSession?.createdAt,
				});
				const signedDate = formatDate({
					value: treatmentPlan.updatedAt ?? treatmentPlan.createdAt,
				});
				const pdfBuffer = await renderToBuffer(
					<TreatmentPlanPdf
						{...treatmentPlan.data}
						patient={{
							dateOfBirth: patient.dateOfBirth ?? undefined,
							email: patient.email,
							firstName: patient.firstName,
							lastName: patient.lastName,
						}}
						practitioner={{
							email: practitionerEmail ?? undefined,
							name: practitionerName,
						}}
						sessionDate={sessionDate}
						signedBy={practitionerName}
						signedDate={signedDate}
						locale='en'
					/>
				);

				return {
					base64: Buffer.from(pdfBuffer).toString("base64"),
					filename: `treatment-plan-${patient.firstName}-${patient.lastName}.pdf`,
				};
			}),
	});
