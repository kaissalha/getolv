import { z } from "zod";

import { getPatientActivityFeed } from "../../services/patient-activity-feed";
import {
	createPatient,
	getPatient,
	getPatientByEmail,
	listPatients,
	updatePatient,
	updatePatientClinicalState,
} from "../../services/patients";
import { PaginationSchema } from "../../types/pagination";
import type { StarterRouterFactoryOptions } from "../shared";

const patientTodoSchema = z.object({
	id: z.string(),
	text: z.string(),
	category: z.string().nullable(),
});

const patientDiagnosisEntrySchema = z.object({
	name: z.string(),
	reasoning: z.string().nullable(),
	evidence: z.string().nullable(),
	missing: z.string().nullable(),
	verifyNext: z.string().nullable(),
});

const patientDiagnosisSchema = z.object({
	workingDx: z.array(patientDiagnosisEntrySchema),
	differentialDx: z.array(patientDiagnosisEntrySchema),
});

export const createPatientsRouter = ({ createTRPCRouter, organizationProcedure }: StarterRouterFactoryOptions) =>
	createTRPCRouter({
		get: organizationProcedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.query(async ({ input, ctx }) => getPatient({ ...input, organizationId: ctx.activeOrganizationId })),
		getByEmail: organizationProcedure
			.input(
				z.object({
					email: z.email(),
				})
			)
			.query(async ({ input, ctx }) =>
				getPatientByEmail({ email: input.email, organizationId: ctx.activeOrganizationId })
			),
		list: organizationProcedure
			.input(
				PaginationSchema.extend({
					search: z.string().optional(),
				})
			)
			.query(async ({ input, ctx }) => listPatients({ ...input, organizationId: ctx.activeOrganizationId })),
		getActivityFeed: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
				})
			)
			.query(async ({ input, ctx }) =>
				getPatientActivityFeed({
					organizationId: ctx.activeOrganizationId,
					patientId: input.patientId,
				})
			),
		create: organizationProcedure
			.input(
				z.object({
					firstName: z.string(),
					lastName: z.string(),
					email: z.email(),
					phoneNumber: z.string().nullable().optional(),
					dateOfBirth: z.string().nullable().optional(),
					gender: z.string().nullable().optional(),
					allergies: z.string().nullable().optional(),
					currentMedications: z.string().nullable().optional(),
					pastMedicalHistory: z.string().nullable().optional(),
					familyMedicalHistory: z.string().nullable().optional(),
					additionalContext: z.string().max(1000).nullable().optional(),
				})
			)
			.mutation(async ({ input, ctx }) => createPatient({ ...input, organizationId: ctx.activeOrganizationId })),
		update: organizationProcedure
			.input(
				z.object({
					id: z.string(),
					firstName: z.string(),
					lastName: z.string(),
					email: z.email(),
					phoneNumber: z.string().nullable().optional(),
					dateOfBirth: z.string().nullable().optional(),
					gender: z.string().nullable().optional(),
					allergies: z.string().nullable().optional(),
					currentMedications: z.string().nullable().optional(),
					pastMedicalHistory: z.string().nullable().optional(),
					familyMedicalHistory: z.string().nullable().optional(),
					additionalContext: z.string().max(1000).nullable().optional(),
				})
			)
			.mutation(async ({ input, ctx }) => updatePatient({ ...input, organizationId: ctx.activeOrganizationId })),
		updateClinicalState: organizationProcedure
			.input(
				z.object({
					id: z.string(),
					diagnosis: patientDiagnosisSchema,
					todos: z.array(patientTodoSchema),
				})
			)
			.mutation(async ({ input, ctx }) =>
				updatePatientClinicalState({
					...input,
					organizationId: ctx.activeOrganizationId,
				})
			),
	});
