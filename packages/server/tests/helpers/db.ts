// Note: patientLabResults, labTestRangeOverrides, labTestReferenceRanges, labTests
// don't have organizationId - they cascade from parent tables or are global
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import {
	aiChatMessages,
	aiChatStreams,
	aiChats,
	db,
	labTestRangeOverrides,
	labTestReferenceRanges,
	labTests,
	noteMentions,
	notes,
	oauthConnections,
	organizations,
	patientLabReports,
	patientLabResults,
	patientSessions,
	patients,
} from "@starter/db";

export const resetDatabase = async () => {
	await db.delete(aiChatMessages);
	await db.delete(aiChatStreams);
	await db.delete(patientLabResults);
	await db.delete(patientLabReports);
	await db.delete(patientSessions);
	await db.delete(noteMentions);
	await db.delete(notes);
	await db.delete(oauthConnections);
	await db.delete(labTestRangeOverrides);
	await db.delete(labTestReferenceRanges);
	await db.delete(labTests);
	await db.delete(patients);
	await db.delete(aiChats);
	await db.delete(organizations);
};

export const cleanupOrganization = async (organizationId: string) => {
	// Delete tables with organizationId - cascading will handle children
	// patientLabResults cascades from patientLabReports
	// noteMentions cascades from notes
	// aiChatMessages, aiChatStreams cascade from aiChats
	// labTestRangeOverrides cascades from patients
	await db.delete(patientLabReports).where(eq(patientLabReports.organizationId, organizationId));
	await db.delete(patientSessions).where(eq(patientSessions.organizationId, organizationId));
	await db.delete(notes).where(eq(notes.organizationId, organizationId));
	await db.delete(oauthConnections).where(eq(oauthConnections.organizationId, organizationId));
	await db.delete(patients).where(eq(patients.organizationId, organizationId));
	await db.delete(aiChats).where(eq(aiChats.organizationId, organizationId));
	await db.delete(organizations).where(eq(organizations.id, organizationId));
};

export const createTestOrganization = async ({ name }: { name?: string } = {}) => {
	const id = `org-${uuidv4()}`;
	const [organization] = await db
		.insert(organizations)
		.values({
			id,
			name: name ?? "Test Organization",
		})
		.returning();

	return organization;
};

export const createTestPatient = async ({
	organizationId,
	overrides,
}: {
	organizationId: string;
	overrides?: Partial<{
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string | null;
	}>;
}) => {
	const [patient] = await db
		.insert(patients)
		.values({
			organizationId,
			firstName: overrides?.firstName ?? "Test",
			lastName: overrides?.lastName ?? "Patient",
			email: overrides?.email ?? `patient-${uuidv4()}@example.com`,
			phoneNumber: overrides?.phoneNumber ?? null,
		})
		.returning();

	return patient;
};

export const createTestChat = async ({ organizationId, title }: { organizationId: string; title?: string }) => {
	const [chat] = await db
		.insert(aiChats)
		.values({
			organizationId,
			title: title ?? "Test Chat",
		})
		.returning();

	return chat;
};
