import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { WorkoutPlanPdf, renderToBuffer } from "@getolv/pdf";

import { editWorkoutPlanCore, generateWorkoutPlanCore } from "../../ai/tools/generate-workout-plan";
import { buildExerciseImageDataUriMap } from "../../lib/pdf-exercise-images";
import { getPatientSessions } from "../../services/patient-sessions";
import { getPatient } from "../../services/patients";
import {
	addExerciseToDay,
	createWorkoutPlan,
	deleteWorkoutPlan,
	getWorkoutPlan,
	listPatientWorkoutPlans,
	listSessionWorkoutPlans,
	removeExerciseFromDay,
	replaceWorkoutPlanContent,
	reorderExercisesInDay,
	searchExercises,
	updateExerciseInPlan,
	updateWorkoutPlanSummary,
} from "../../services/workouts";
import type { getolvRouterFactoryOptions } from "../shared";

const buildPatientContext = ({
	patient,
	sessions,
	additionalContext,
}: {
	patient: { firstName: string; lastName: string; email: string; summary?: string | null };
	sessions: { title: string | null; summary: string | null; createdAt: string }[];
	additionalContext?: string;
}) => {
	const lines: string[] = [`## Patient`, `Name: ${patient.firstName} ${patient.lastName}`, `Email: ${patient.email}`];

	if (patient.summary) {
		lines.push(`Summary: ${patient.summary}`);
	}

	if (sessions.length > 0) {
		lines.push("", "## Past Sessions");
		for (const session of sessions) {
			const title = session.title ?? "Untitled Session";
			const date = new Date(session.createdAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			lines.push(`\n### ${title} (${date})`);
			if (session.summary) {
				lines.push(session.summary);
			}
		}
	}

	if (additionalContext) {
		lines.push("", "## Additional Context", additionalContext);
	}

	return lines.join("\n");
};

const serializeCurrentPlanForEdit = (plan: NonNullable<Awaited<ReturnType<typeof getWorkoutPlan>>>) =>
	JSON.stringify(
		{
			title: plan.title,
			summary: plan.summary,
			durationWeeks: plan.durationWeeks,
			daysPerWeek: plan.daysPerWeek,
			days: plan.days.map((d) => ({
				dayNumber: d.dayNumber,
				name: d.name,
				focus: d.focus,
				warmUp: d.warmUp,
				coolDown: d.coolDown,
				exercises: d.exercises.map((ex) => ({
					exerciseName: ex.exerciseName,
					sets: ex.sets,
					reps: ex.reps,
					restSeconds: ex.restSeconds,
					notes: ex.notes,
				})),
			})),
		},
		null,
		2
	);

export const createWorkoutsRouter = ({ createTRPCRouter, organizationProcedure }: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		getWorkoutPlan: organizationProcedure
			.input(z.object({ id: z.string() }))
			.query(async ({ input, ctx }) =>
				getWorkoutPlan({ id: input.id, organizationId: ctx.activeOrganizationId })
			),

		listPatientWorkoutPlans: organizationProcedure
			.input(z.object({ patientId: z.string() }))
			.query(async ({ input, ctx }) =>
				listPatientWorkoutPlans({ patientId: input.patientId, organizationId: ctx.activeOrganizationId })
			),

		listSessionWorkoutPlans: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					patientSessionId: z.string(),
				})
			)
			.query(async ({ input, ctx }) =>
				listSessionWorkoutPlans({
					patientId: input.patientId,
					patientSessionId: input.patientSessionId,
					organizationId: ctx.activeOrganizationId,
				})
			),

		searchExercises: organizationProcedure
			.input(
				z.object({
					search: z.string().optional(),
					limit: z.number().min(1).max(100).optional(),
				})
			)
			.query(async ({ input }) => searchExercises(input)),

		createWorkoutPlan: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					patientSessionId: z.string().nullable().optional(),
					title: z.string().min(1),
					summary: z.string().nullable().optional(),
					durationWeeks: z.number().nullable().optional(),
					daysPerWeek: z.number().nullable().optional(),
					days: z.array(
						z.object({
							dayNumber: z.number(),
							name: z.string(),
							focus: z.string().nullable().optional(),
							warmUp: z.string().nullable().optional(),
							coolDown: z.string().nullable().optional(),
							exercises: z.array(
								z.object({
									exerciseId: z.string().nullable().optional(),
									exerciseName: z.string(),
									orderIndex: z.number(),
									sets: z.number().nullable().optional(),
									reps: z.string().nullable().optional(),
									restSeconds: z.number().nullable().optional(),
									notes: z.string().nullable().optional(),
								})
							),
						})
					),
				})
			)
			.mutation(async ({ input, ctx }) =>
				createWorkoutPlan({ ...input, organizationId: ctx.activeOrganizationId })
			),

		deleteWorkoutPlan: organizationProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ input, ctx }) =>
				deleteWorkoutPlan({ id: input.id, organizationId: ctx.activeOrganizationId })
			),

		updateWorkoutPlanSummary: organizationProcedure
			.input(
				z.object({
					workoutPlanId: z.string(),
					summary: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				updateWorkoutPlanSummary({ ...input, organizationId: ctx.activeOrganizationId })
			),

		addExerciseToDay: organizationProcedure
			.input(
				z.object({
					workoutPlanDayId: z.string(),
					exerciseId: z.string().nullable().optional(),
					exerciseName: z.string().min(1),
					sets: z.number().nullable().optional(),
					reps: z.string().nullable().optional(),
					restSeconds: z.number().nullable().optional(),
					notes: z.string().nullable().optional(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				addExerciseToDay({ ...input, organizationId: ctx.activeOrganizationId })
			),

		removeExerciseFromDay: organizationProcedure
			.input(z.object({ exerciseId: z.string() }))
			.mutation(async ({ input, ctx }) =>
				removeExerciseFromDay({ exerciseId: input.exerciseId, organizationId: ctx.activeOrganizationId })
			),

		updateExerciseInPlan: organizationProcedure
			.input(
				z.object({
					exerciseId: z.string(),
					newExerciseId: z.string().nullable().optional(),
					exerciseName: z.string().optional(),
					sets: z.number().nullable().optional(),
					reps: z.string().nullable().optional(),
					restSeconds: z.number().nullable().optional(),
					notes: z.string().nullable().optional(),
				})
			)
			.mutation(async ({ input, ctx }) =>
				updateExerciseInPlan({ ...input, organizationId: ctx.activeOrganizationId })
			),

		reorderExercisesInDay: organizationProcedure
			.input(
				z.object({
					workoutPlanDayId: z.string(),
					orderedExerciseIds: z.array(z.string()).min(1),
				})
			)
			.mutation(async ({ input, ctx }) =>
				reorderExercisesInDay({ ...input, organizationId: ctx.activeOrganizationId })
			),

		generateWorkoutPlan: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					context: z.string().optional(),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const [patient, sessions] = await Promise.all([
					getPatient({ id: input.patientId, organizationId: ctx.activeOrganizationId }),
					getPatientSessions(input.patientId, ctx.activeOrganizationId),
				]);

				if (!patient) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
				}

				const patientContext = buildPatientContext({
					patient,
					sessions: sessions.map((s) => ({
						title: s.title ?? null,
						summary: s.summary ?? null,
						createdAt: s.createdAt,
					})),
					additionalContext: input.context,
				});

				const generated = await generateWorkoutPlanCore({ patientContext });

				if (!generated) {
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate workout plan" });
				}

				return createWorkoutPlan({
					patientId: input.patientId,
					patientSessionId: null,
					organizationId: ctx.activeOrganizationId,
					title: generated.title,
					summary: generated.summary,
					durationWeeks: generated.durationWeeks,
					daysPerWeek: generated.daysPerWeek,
					days: generated.days,
				});
			}),

		editWorkoutPlanWithAi: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					workoutPlanId: z.string(),
					instructions: z.string().min(1),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const [plan, patient, sessions] = await Promise.all([
					getWorkoutPlan({
						id: input.workoutPlanId,
						organizationId: ctx.activeOrganizationId,
					}),
					getPatient({ id: input.patientId, organizationId: ctx.activeOrganizationId }),
					getPatientSessions(input.patientId, ctx.activeOrganizationId),
				]);

				if (!plan || plan.patientId !== input.patientId) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
				}

				if (!patient) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
				}

				const patientContext = buildPatientContext({
					patient,
					sessions: sessions.map((s) => ({
						title: s.title ?? null,
						summary: s.summary ?? null,
						createdAt: s.createdAt,
					})),
				});

				const currentPlanJson = serializeCurrentPlanForEdit(plan);

				const revised = await editWorkoutPlanCore({
					patientContext,
					currentPlanJson,
					instructions: input.instructions,
				});

				if (!revised) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to revise workout plan",
					});
				}

				return replaceWorkoutPlanContent({
					id: input.workoutPlanId,
					organizationId: ctx.activeOrganizationId,
					title: revised.title,
					summary: revised.summary,
					durationWeeks: revised.durationWeeks,
					daysPerWeek: revised.daysPerWeek,
					days: revised.days,
				});
			}),

		generateWorkoutPlanPdf: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					workoutPlanId: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const patient = await getPatient({ id: input.patientId, organizationId: ctx.activeOrganizationId });

				if (!patient) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
				}

				const plan = await getWorkoutPlan({
					id: input.workoutPlanId,
					organizationId: ctx.activeOrganizationId,
				});

				if (!plan) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
				}

				const sessionDate = new Date(plan.createdAt).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});

				const sourceGifUrls = plan.days.flatMap((day) =>
					day.exercises.map((ex) => ex.exercise?.gifUrl ?? null)
				);
				const imageDataUriByUrl = await buildExerciseImageDataUriMap(sourceGifUrls);

				const pdfDays = plan.days.map((day) => ({
					dayNumber: day.dayNumber,
					name: day.name,
					focus: day.focus,
					warmUp: day.warmUp,
					coolDown: day.coolDown,
					exercises: day.exercises.map((ex) => {
						const src = ex.exercise?.gifUrl ?? null;
						const dataUri = src ? (imageDataUriByUrl.get(src) ?? null) : null;
						return {
							exerciseName: ex.exerciseName,
							sets: ex.sets,
							reps: ex.reps,
							restSeconds: ex.restSeconds,
							notes: ex.notes,
							gifUrl: dataUri,
						};
					}),
				}));

				const pdfBuffer = await renderToBuffer(
					<WorkoutPlanPdf
						patient={{
							firstName: patient.firstName,
							lastName: patient.lastName,
							email: patient.email,
						}}
						practitioner={{
							name: ctx.user.name,
							email: ctx.user.email,
						}}
						title={plan.title}
						summary={plan.summary}
						durationWeeks={plan.durationWeeks}
						daysPerWeek={plan.daysPerWeek}
						days={pdfDays}
						sessionDate={sessionDate}
					/>
				);

				return {
					base64: Buffer.from(pdfBuffer).toString("base64"),
					filename: `workout-plan-${patient.firstName}-${patient.lastName}.pdf`,
				};
			}),
	});
