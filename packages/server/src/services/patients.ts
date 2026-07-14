import { cache } from "react";

import { TRPCError } from "@trpc/server";
import { and, asc, eq, inArray, sql, type SQL } from "drizzle-orm";

import {
	addFullTextSearch,
	db,
	normalizePatientClinicalState,
	type Patient,
	type PatientDiagnosis,
	type PatientTodo,
	patients,
	queryWithPagination,
	withOrderBy,
} from "@starter/db";

import type { PaginationProps } from "../types/pagination";

type ListPatientsInput = {
	organizationId: string;
	search?: string;
} & PaginationProps;

type FindPatientInput = {
	organizationId: string;
	id: string;
};

type CreatePatientInput = {
	organizationId: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string | null;
	dateOfBirth?: string | null;
	gender?: string | null;
	allergies?: string | null;
	currentMedications?: string | null;
	pastMedicalHistory?: string | null;
	familyMedicalHistory?: string | null;
	additionalContext?: string | null;
};

type UpdatePatientClinicalStateInput = {
	diagnosis: PatientDiagnosis;
	id: string;
	organizationId: string;
	todos: PatientTodo[];
};

const withNormalizedClinicalState = <TPatient extends Pick<Patient, "diagnosis" | "todos">>(patient: TPatient) => {
	const clinicalState = normalizePatientClinicalState({
		diagnosis: patient.diagnosis,
		todos: patient.todos,
	});

	return {
		...patient,
		diagnosis: clinicalState.diagnosis,
		todos: clinicalState.todos,
	};
};

export const getPatient = cache(async ({ id, organizationId }: FindPatientInput) => {
	const patient = await db.query.patients.findFirst({
		where: { id, organizationId },
	});

	return patient ? withNormalizedClinicalState(patient) : patient;
});

type FindPatientByEmailInput = {
	email: string;
	organizationId: string;
};

export const getPatientByEmail = cache(async ({ email, organizationId }: FindPatientByEmailInput) => {
	const normalizedEmail = email.trim().toLowerCase();
	if (!normalizedEmail) {
		return null;
	}

	const [patient] = await db
		.select()
		.from(patients)
		.where(and(eq(patients.organizationId, organizationId), sql`lower(${patients.email}) = ${normalizedEmail}`))
		.limit(1);

	return patient ? withNormalizedClinicalState(patient) : null;
});

export const listPatients = cache(
	async ({ pageSize = 10, cursor = null, sort, order, search, organizationId }: ListPatientsInput) => {
		const whereConditions: SQL[] = [eq(patients.organizationId, organizationId)];

		const query = db.select().from(patients).$dynamic();

		if (sort) {
			withOrderBy({ query, model: patients, orderBy: sort, order, joinedColumns: {} });
		}

		if (search) {
			addFullTextSearch({ whereConditions, model: patients, searchTerm: search });
		}

		const whereCondition = and(...whereConditions) as SQL;

		query.where(whereCondition);

		const result = await queryWithPagination({ query, model: patients, pageSize, cursor, whereCondition });

		return result;
	}
);

export const createPatient = async (input: CreatePatientInput) => {
	const [createdPatient] = await db
		.insert(patients)
		.values({
			organizationId: input.organizationId,
			firstName: input.firstName,
			lastName: input.lastName,
			email: input.email,
			phoneNumber: input.phoneNumber,
			dateOfBirth: input.dateOfBirth,
			gender: input.gender,
			allergies: input.allergies,
			currentMedications: input.currentMedications,
			pastMedicalHistory: input.pastMedicalHistory,
			familyMedicalHistory: input.familyMedicalHistory,
			additionalContext: input.additionalContext,
		})
		.returning()
		.catch((error) => {
			if (error.constraint === "patient_organization_email_idx") {
				throw new TRPCError({
					code: "CONFLICT",
					message: "There is another patient with this same email address.",
				});
			}
			throw error;
		});
	return withNormalizedClinicalState(createdPatient);
};

export const updatePatient = async ({ id, organizationId, ...input }: FindPatientInput & CreatePatientInput) => {
	const existingPatient = await db.query.patients.findFirst({
		where: { id, organizationId },
	});
	if (!existingPatient) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Patient not found",
		});
	}
	const [updatedPatient] = await db
		.update(patients)
		.set({
			firstName: input.firstName,
			lastName: input.lastName,
			email: input.email,
			phoneNumber: input.phoneNumber,
			dateOfBirth: input.dateOfBirth,
			gender: input.gender,
			allergies: input.allergies,
			currentMedications: input.currentMedications,
			pastMedicalHistory: input.pastMedicalHistory,
			familyMedicalHistory: input.familyMedicalHistory,
			additionalContext: input.additionalContext,
		})
		.where(and(eq(patients.organizationId, existingPatient.organizationId), eq(patients.id, existingPatient.id)))
		.returning()
		.catch((error) => {
			if (error.constraint === "patient_organization_email_idx") {
				throw new TRPCError({
					code: "CONFLICT",
					message: "There is another patient with this same email address.",
				});
			}
			throw error;
		});
	return withNormalizedClinicalState(updatedPatient);
};

export const updatePatientClinicalState = async ({
	diagnosis,
	id,
	organizationId,
	todos,
}: UpdatePatientClinicalStateInput) => {
	const existingPatient = await db.query.patients.findFirst({
		where: { id, organizationId },
	});

	if (!existingPatient) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Patient not found",
		});
	}

	const nextClinicalState = normalizePatientClinicalState({ diagnosis, todos });
	const [updatedPatient] = await db
		.update(patients)
		.set({
			diagnosis: nextClinicalState.diagnosis,
			todos: nextClinicalState.todos,
		})
		.where(and(eq(patients.organizationId, existingPatient.organizationId), eq(patients.id, existingPatient.id)))
		.returning();

	return withNormalizedClinicalState(updatedPatient);
};

export const deletePatient = async ({ organizationId, id }: FindPatientInput) => {
	const existingPatient = await db.query.patients.findFirst({
		where: { id, organizationId },
	});
	if (!existingPatient) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Patient not found",
		});
	}
	return db
		.delete(patients)
		.where(and(eq(patients.organizationId, existingPatient.organizationId), eq(patients.id, existingPatient.id)));
};

export const deleteManyPatients = async ({ ids, organizationId }: { ids: string[]; organizationId: string }) => {
	return db.delete(patients).where(and(eq(patients.organizationId, organizationId), inArray(patients.id, ids)));
};

export const exportPatients = async ({
	ids,
	search,
	organizationId,
}: {
	ids?: string[];
	search?: string;
	organizationId: string;
}) => {
	const whereConditions: SQL[] = [eq(patients.organizationId, organizationId)];

	if (ids && ids?.length > 0) {
		whereConditions.push(inArray(patients.id, ids));
	}

	if (search) {
		addFullTextSearch({ whereConditions, model: patients, searchTerm: search });
	}

	const whereCondition = and(...whereConditions) as SQL;

	const patientList = await db.select().from(patients).where(whereCondition).orderBy(asc(patients.id)).execute();

	if (patientList.length === 0) {
		return "";
	}

	const mapPatientsToExport = (patients: Patient[]) => {
		const headers = [
			"ID",
			"First Name",
			"Last Name",
			"Email",
			"Phone Number",
			"Date of Birth",
			"Gender",
			"Allergies",
			"Current Medications",
			"Personal Medical History",
			"Family Medical History",
			"Additional Context",
			"Created At",
			"Updated At",
		];
		const rows = patients.map((patient) => {
			return [
				patient.id,
				patient.firstName,
				patient.lastName,
				patient.email,
				patient.phoneNumber,
				patient.dateOfBirth,
				patient.gender,
				patient.allergies,
				patient.currentMedications,
				patient.pastMedicalHistory,
				patient.familyMedicalHistory,
				patient.additionalContext,
				patient.createdAt,
				patient.updatedAt,
			];
		});
		return [headers, ...rows].map((row) => row.join(",")).join("\n");
	};

	return mapPatientsToExport(patientList);
};
