import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.ts";

export const relations = defineRelations(schema, (r) => ({
	// Better Auth
	users: {
		accounts: r.many.accounts(),
		sessions: r.many.sessions(),
		members: r.many.members(),
		invitations: r.many.invitations(),
		twoFactors: r.many.twoFactors(),
		dailySummaries: r.many.dailySummaries(),
	},

	accounts: {
		user: r.one.users({
			from: r.accounts.userId,
			to: r.users.id,
		}),
	},

	sessions: {
		user: r.one.users({
			from: r.sessions.userId,
			to: r.users.id,
		}),
		activeOrganization: r.one.organizations({
			from: r.sessions.activeOrganizationId,
			to: r.organizations.id,
			optional: true,
		}),
	},

	organizations: {
		members: r.many.members(),
		invitations: r.many.invitations(),
		sessions: r.many.sessions(),
		uploadedMedia: r.many.uploadedMedia(),
		ragDocuments: r.many.ragDocuments(),
		treatmentPlans: r.many.patientTreatmentPlans(),
		dailySummaries: r.many.dailySummaries(),
	},

	members: {
		user: r.one.users({
			from: r.members.userId,
			to: r.users.id,
		}),
		organization: r.one.organizations({
			from: r.members.organizationId,
			to: r.organizations.id,
		}),
	},

	invitations: {
		organization: r.one.organizations({
			from: r.invitations.organizationId,
			to: r.organizations.id,
		}),
		inviter: r.one.users({
			from: r.invitations.inviterId,
			to: r.users.id,
		}),
	},

	twoFactors: {
		user: r.one.users({
			from: r.twoFactors.userId,
			to: r.users.id,
		}),
	},

	uploadedMedia: {
		organization: r.one.organizations({
			from: r.uploadedMedia.organizationId,
			to: r.organizations.id,
		}),
	},

	// AI Chat relations
	aiChats: {
		organization: r.one.organizations({
			from: r.aiChats.organizationId,
			to: r.organizations.id,
		}),
		messages: r.many.aiChatMessages(),
		streams: r.many.aiChatStreams(),
	},

	// AI Chat Messages relations
	aiChatMessages: {
		chat: r.one.aiChats({
			from: r.aiChatMessages.chatId,
			to: r.aiChats.id,
		}),
	},

	// AI Chat Streams relations
	aiChatStreams: {
		chat: r.one.aiChats({
			from: r.aiChatStreams.chatId,
			to: r.aiChats.id,
		}),
	},

	dailySummaries: {
		organization: r.one.organizations({
			from: r.dailySummaries.organizationId,
			to: r.organizations.id,
		}),
		user: r.one.users({
			from: r.dailySummaries.userId,
			to: r.users.id,
		}),
	},

	ragDocuments: {
		organization: r.one.organizations({
			from: r.ragDocuments.organizationId,
			to: r.organizations.id,
		}),
		chunks: r.many.ragDocumentChunks(),
	},

	ragDocumentChunks: {
		document: r.one.ragDocuments({
			from: r.ragDocumentChunks.documentId,
			to: r.ragDocuments.id,
		}),
		organization: r.one.organizations({
			from: r.ragDocumentChunks.organizationId,
			to: r.organizations.id,
		}),
	},

	// OAuth Connections relations
	oauthConnections: {
		user: r.one.users({
			from: r.oauthConnections.userId,
			to: r.users.id,
		}),
		organization: r.one.organizations({
			from: r.oauthConnections.organizationId,
			to: r.organizations.id,
		}),
	},

	// Patients relations
	patients: {
		organization: r.one.organizations({
			from: r.patients.organizationId,
			to: r.organizations.id,
		}),
		labResults: r.many.patientLabResults(),
		labReports: r.many.patientLabReports(),
		sessions: r.many.patientSessions(),
		treatmentPlans: r.many.patientTreatmentPlans(),
		workoutPlans: r.many.patientWorkoutPlans(),
	},

	// Patient Lab Results relations
	patientLabResults: {
		patientSession: r.one.patientSessions({
			from: r.patientLabResults.patientSessionId,
			to: r.patientSessions.id,
		}),
		patient: r.one.patients({
			from: r.patientLabResults.patientId,
			to: r.patients.id,
		}),
		labReport: r.one.patientLabReports({
			from: r.patientLabResults.labReportId,
			to: r.patientLabReports.id,
		}),
		labTest: r.one.labTests({
			from: r.patientLabResults.labTestId,
			to: r.labTests.id,
		}),
	},

	// Patient Lab Reports relations
	patientLabReports: {
		patient: r.one.patients({
			from: r.patientLabReports.patientId,
			to: r.patients.id,
		}),
		patientSession: r.one.patientSessions({
			from: r.patientLabReports.patientSessionId,
			to: r.patientSessions.id,
		}),
		organization: r.one.organizations({
			from: r.patientLabReports.organizationId,
			to: r.organizations.id,
		}),
		labResults: r.many.patientLabResults(),
	},

	// Patient Sessions relations
	patientSessions: {
		organization: r.one.organizations({
			from: r.patientSessions.organizationId,
			to: r.organizations.id,
		}),
		patient: r.one.patients({
			from: r.patientSessions.patientId,
			to: r.patients.id,
		}),
		treatmentPlans: r.many.patientTreatmentPlans(),
		transcriptTurns: r.many.sessionTranscriptTurns(),
		workoutPlans: r.many.patientWorkoutPlans(),
	},

	// Patient Treatment Plans relations
	patientTreatmentPlans: {
		patient: r.one.patients({
			from: r.patientTreatmentPlans.patientId,
			to: r.patients.id,
		}),
		patientSession: r.one.patientSessions({
			from: r.patientTreatmentPlans.patientSessionId,
			to: r.patientSessions.id,
		}),
		organization: r.one.organizations({
			from: r.patientTreatmentPlans.organizationId,
			to: r.organizations.id,
		}),
	},

	// Session Transcript Turns relations
	sessionTranscriptTurns: {
		session: r.one.patientSessions({
			from: r.sessionTranscriptTurns.sessionId,
			to: r.patientSessions.id,
		}),
		organization: r.one.organizations({
			from: r.sessionTranscriptTurns.organizationId,
			to: r.organizations.id,
		}),
	},

	// Patient Workout Plans relations
	patientWorkoutPlans: {
		patient: r.one.patients({
			from: r.patientWorkoutPlans.patientId,
			to: r.patients.id,
		}),
		patientSession: r.one.patientSessions({
			from: r.patientWorkoutPlans.patientSessionId,
			to: r.patientSessions.id,
		}),
		organization: r.one.organizations({
			from: r.patientWorkoutPlans.organizationId,
			to: r.organizations.id,
		}),
		days: r.many.patientWorkoutPlanDays(),
	},

	// Patient Workout Plan Days relations
	patientWorkoutPlanDays: {
		workoutPlan: r.one.patientWorkoutPlans({
			from: r.patientWorkoutPlanDays.workoutPlanId,
			to: r.patientWorkoutPlans.id,
		}),
		exercises: r.many.patientWorkoutPlanExercises(),
	},

	// Patient Workout Plan Exercises relations
	patientWorkoutPlanExercises: {
		workoutPlanDay: r.one.patientWorkoutPlanDays({
			from: r.patientWorkoutPlanExercises.workoutPlanDayId,
			to: r.patientWorkoutPlanDays.id,
		}),
		exercise: r.one.exercises({
			from: r.patientWorkoutPlanExercises.exerciseId,
			to: r.exercises.id,
		}),
	},

	// Exercises relations
	exercises: {
		workoutPlanExercises: r.many.patientWorkoutPlanExercises(),
		bodyParts: r.many.exerciseBodyParts(),
		equipments: r.many.exerciseEquipments(),
		muscles: r.many.exerciseMuscles(),
	},

	bodyParts: {
		exercises: r.many.exerciseBodyParts(),
		muscles: r.many.muscleBodyParts(),
	},

	equipments: {
		exercises: r.many.exerciseEquipments(),
	},

	muscles: {
		exercises: r.many.exerciseMuscles(),
		bodyParts: r.many.muscleBodyParts(),
	},

	exerciseBodyParts: {
		exercise: r.one.exercises({
			from: r.exerciseBodyParts.exerciseId,
			to: r.exercises.id,
		}),
		bodyPart: r.one.bodyParts({
			from: r.exerciseBodyParts.bodyPartId,
			to: r.bodyParts.id,
		}),
	},

	exerciseEquipments: {
		exercise: r.one.exercises({
			from: r.exerciseEquipments.exerciseId,
			to: r.exercises.id,
		}),
		equipment: r.one.equipments({
			from: r.exerciseEquipments.equipmentId,
			to: r.equipments.id,
		}),
	},

	exerciseMuscles: {
		exercise: r.one.exercises({
			from: r.exerciseMuscles.exerciseId,
			to: r.exercises.id,
		}),
		muscle: r.one.muscles({
			from: r.exerciseMuscles.muscleId,
			to: r.muscles.id,
		}),
	},

	muscleBodyParts: {
		muscle: r.one.muscles({
			from: r.muscleBodyParts.muscleId,
			to: r.muscles.id,
		}),
		bodyPart: r.one.bodyParts({
			from: r.muscleBodyParts.bodyPartId,
			to: r.bodyParts.id,
		}),
	},

	// Notes relations
	notes: {
		organization: r.one.organizations({
			from: r.notes.organizationId,
			to: r.organizations.id,
		}),
		mentions: r.many.noteMentions(),
	},

	// Note Mentions relations
	noteMentions: {
		note: r.one.notes({
			from: r.noteMentions.noteId,
			to: r.notes.id,
		}),
	},

	// Lab Tests relations
	labTests: {
		referenceRanges: r.many.labTestReferenceRanges(),
		rangeOverrides: r.many.labTestRangeOverrides(),
		labResults: r.many.patientLabResults(),
	},

	// Lab Test Reference Ranges relations
	labTestReferenceRanges: {
		labTest: r.one.labTests({
			from: r.labTestReferenceRanges.labTestId,
			to: r.labTests.id,
		}),
	},

	// Lab Test Range Overrides relations
	labTestRangeOverrides: {
		labTest: r.one.labTests({
			from: r.labTestRangeOverrides.labTestId,
			to: r.labTests.id,
		}),
		patient: r.one.patients({
			from: r.labTestRangeOverrides.patientId,
			to: r.patients.id,
		}),
	},
}));
