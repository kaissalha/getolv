import { cache } from "react";

import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db, exercises, patientWorkoutPlanDays, patientWorkoutPlanExercises, patientWorkoutPlans } from "@starter/db";

type GetWorkoutPlanInput = {
	id: string;
	organizationId: string;
};

type ListWorkoutPlansInput = {
	patientId: string;
	organizationId: string;
};

type ListSessionWorkoutPlansInput = {
	patientId: string;
	patientSessionId: string;
	organizationId: string;
};

type SearchExercisesInput = {
	search?: string;
	limit?: number;
};

type CreateWorkoutPlanExerciseInput = {
	exerciseId?: string | null;
	exerciseName: string;
	orderIndex: number;
	sets?: number | null;
	reps?: string | null;
	restSeconds?: number | null;
	notes?: string | null;
};

type CreateWorkoutPlanDayInput = {
	dayNumber: number;
	name: string;
	focus?: string | null;
	warmUp?: string | null;
	coolDown?: string | null;
	exercises: CreateWorkoutPlanExerciseInput[];
};

type CreateWorkoutPlanInput = {
	patientId: string;
	patientSessionId?: string | null;
	organizationId: string;
	title: string;
	summary?: string | null;
	durationWeeks?: number | null;
	daysPerWeek?: number | null;
	days: CreateWorkoutPlanDayInput[];
};

const exerciseCatalogRelations = {
	bodyParts: {
		with: {
			bodyPart: true,
		},
	},
	equipments: {
		with: {
			equipment: true,
		},
	},
	muscles: {
		with: {
			muscle: true,
		},
	},
} as const;

type ExerciseCatalogRow = {
	id: string;
	exerciseId: string;
	name: string;
	gifUrl: string | null;
	instructions: string[];
	createdAt: string;
	updatedAt: string;
	bodyParts: { bodyPart: { name: string } | null }[];
	equipments: { equipment: { name: string } | null }[];
	muscles: { role: "target" | "secondary"; muscle: { name: string } | null }[];
};

const getExerciseCatalogRows = async ({ ids, limit }: { ids?: string[]; limit?: number }) => {
	if (ids?.length === 0) {
		return [];
	}

	const catalog = (await db.query.exercises.findMany({
		with: exerciseCatalogRelations,
	})) as unknown as ExerciseCatalogRow[];

	if (ids) {
		const idSet = new Set(ids);
		const filteredCatalog = catalog.filter((exercise) => idSet.has(exercise.id));
		return limit ? filteredCatalog.slice(0, limit) : filteredCatalog;
	}

	return limit ? catalog.slice(0, limit) : catalog;
};

const sortNames = ({ names }: { names: string[] }) => [...names].sort((a, b) => a.localeCompare(b));

const mapExerciseCatalogRow = ({ exercise }: { exercise: ExerciseCatalogRow }) => ({
	id: exercise.id,
	exerciseId: exercise.exerciseId,
	name: exercise.name,
	gifUrl: exercise.gifUrl,
	instructions: exercise.instructions,
	createdAt: exercise.createdAt,
	updatedAt: exercise.updatedAt,
	bodyParts: sortNames({
		names: exercise.bodyParts.flatMap(({ bodyPart }) => (bodyPart ? [bodyPart.name] : [])),
	}),
	equipments: sortNames({
		names: exercise.equipments.flatMap(({ equipment }) => (equipment ? [equipment.name] : [])),
	}),
	targetMuscles: sortNames({
		names: exercise.muscles.flatMap(({ muscle, role }) => (muscle && role === "target" ? [muscle.name] : [])),
	}),
	secondaryMuscles: sortNames({
		names: exercise.muscles.flatMap(({ muscle, role }) => (muscle && role === "secondary" ? [muscle.name] : [])),
	}),
});

const rankLexicalExerciseIds = async ({ limit, search }: { limit: number; search: string }) => {
	const tsQuery = sql`websearch_to_tsquery('english'::regconfig, ${search})`;
	const rank = sql<number>`ts_rank_cd(${exercises.fts}, ${tsQuery})`;

	const matches = await db
		.select({
			id: exercises.id,
		})
		.from(exercises)
		.where(sql`${exercises.fts} @@ ${tsQuery}`)
		.orderBy(desc(rank), asc(exercises.name))
		.limit(limit);

	return matches.map(({ id }) => id);
};

const orderExercisesByIds = ({
	exercisesById,
	ids,
}: {
	exercisesById: Map<string, ReturnType<typeof mapExerciseCatalogRow>>;
	ids: string[];
}) =>
	ids.flatMap((id) => {
		const exercise = exercisesById.get(id);
		return exercise ? [exercise] : [];
	});

export const getWorkoutPlan = cache(async ({ id, organizationId }: GetWorkoutPlanInput) => {
	const plan = await db.query.patientWorkoutPlans.findFirst({
		where: { id, organizationId },
		with: {
			days: {
				with: {
					exercises: {
						with: {
							exercise: {
								with: exerciseCatalogRelations,
							},
						},
					},
				},
			},
		},
	});

	if (!plan) return null;

	const sortedDays = [...plan.days]
		.sort((a, b) => a.dayNumber - b.dayNumber)
		.map((day) => ({
			...day,
			exercises: [...day.exercises]
				.sort((a, b) => a.orderIndex - b.orderIndex)
				.map((exercise) => ({
					...exercise,
					exercise: exercise.exercise ? mapExerciseCatalogRow({ exercise: exercise.exercise }) : null,
				})),
		}));

	return { ...plan, days: sortedDays };
});

export const listPatientWorkoutPlans = cache(async ({ patientId, organizationId }: ListWorkoutPlansInput) => {
	const plans = await db.query.patientWorkoutPlans.findMany({
		where: { patientId, organizationId },
		with: {
			days: {
				with: {
					exercises: true,
				},
			},
		},
	});

	return [...plans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

export const listSessionWorkoutPlans = cache(
	async ({ patientId, patientSessionId, organizationId }: ListSessionWorkoutPlansInput) => {
		const plans = await db.query.patientWorkoutPlans.findMany({
			where: { patientId, patientSessionId, organizationId },
			with: {
				days: {
					with: {
						exercises: true,
					},
				},
			},
		});

		return [...plans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
);

export const searchExercises = cache(async ({ search, limit = 20 }: SearchExercisesInput) => {
	const trimmedSearch = search?.trim();

	if (!trimmedSearch) {
		const catalog = await getExerciseCatalogRows({});
		return [...catalog]
			.map((exercise) => mapExerciseCatalogRow({ exercise }))
			.sort((a, b) => a.name.localeCompare(b.name))
			.slice(0, limit);
	}

	const [lexicalIds] = await Promise.all([
		rankLexicalExerciseIds({
			limit,
			search: trimmedSearch,
		}),
	]);
	const rankedIds = Array.from(new Set([...lexicalIds])).slice(0, limit);

	const catalog = await getExerciseCatalogRows({ ids: rankedIds });
	const exercisesById = new Map(catalog.map((exercise) => [exercise.id, mapExerciseCatalogRow({ exercise })]));

	return orderExercisesByIds({
		exercisesById,
		ids: rankedIds,
	});
});

export const getExerciseCatalog = cache(async () => {
	const catalog = await getExerciseCatalogRows({});
	return [...catalog]
		.map((exercise) => mapExerciseCatalogRow({ exercise }))
		.sort((a, b) => a.name.localeCompare(b.name));
});

export const createWorkoutPlan = async (input: CreateWorkoutPlanInput) => {
	return db.transaction(async (tx) => {
		const [plan] = await tx
			.insert(patientWorkoutPlans)
			.values({
				patientId: input.patientId,
				patientSessionId: input.patientSessionId,
				organizationId: input.organizationId,
				title: input.title,
				summary: input.summary,
				durationWeeks: input.durationWeeks,
				daysPerWeek: input.daysPerWeek,
			})
			.returning();

		const createdDays = [];

		for (const day of input.days) {
			const [createdDay] = await tx
				.insert(patientWorkoutPlanDays)
				.values({
					workoutPlanId: plan.id,
					dayNumber: day.dayNumber,
					name: day.name,
					focus: day.focus,
					warmUp: day.warmUp,
					coolDown: day.coolDown,
				})
				.returning();

			const createdExercises =
				day.exercises.length > 0
					? await tx
							.insert(patientWorkoutPlanExercises)
							.values(
								day.exercises.map((ex) => ({
									workoutPlanDayId: createdDay.id,
									exerciseId: ex.exerciseId,
									exerciseName: ex.exerciseName,
									orderIndex: ex.orderIndex,
									sets: ex.sets,
									reps: ex.reps,
									restSeconds: ex.restSeconds,
									notes: ex.notes,
								}))
							)
							.returning()
					: [];

			createdDays.push({ ...createdDay, exercises: createdExercises });
		}

		return { ...plan, days: createdDays };
	});
};

type ReplaceWorkoutPlanContentInput = {
	id: string;
	organizationId: string;
	title: string;
	summary?: string | null;
	durationWeeks?: number | null;
	daysPerWeek?: number | null;
	days: CreateWorkoutPlanDayInput[];
};

export const replaceWorkoutPlanContent = async (input: ReplaceWorkoutPlanContentInput) => {
	return db.transaction(async (tx) => {
		const [existing] = await tx
			.select({ id: patientWorkoutPlans.id })
			.from(patientWorkoutPlans)
			.where(
				and(eq(patientWorkoutPlans.id, input.id), eq(patientWorkoutPlans.organizationId, input.organizationId))
			)
			.limit(1);

		if (!existing) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
		}

		await tx.delete(patientWorkoutPlanDays).where(eq(patientWorkoutPlanDays.workoutPlanId, input.id));

		await tx
			.update(patientWorkoutPlans)
			.set({
				title: input.title,
				summary: input.summary,
				durationWeeks: input.durationWeeks,
				daysPerWeek: input.daysPerWeek,
			})
			.where(
				and(eq(patientWorkoutPlans.id, input.id), eq(patientWorkoutPlans.organizationId, input.organizationId))
			);

		const createdDays = [];

		for (const day of input.days) {
			const [createdDay] = await tx
				.insert(patientWorkoutPlanDays)
				.values({
					workoutPlanId: input.id,
					dayNumber: day.dayNumber,
					name: day.name,
					focus: day.focus,
					warmUp: day.warmUp,
					coolDown: day.coolDown,
				})
				.returning();

			const createdExercises =
				day.exercises.length > 0
					? await tx
							.insert(patientWorkoutPlanExercises)
							.values(
								day.exercises.map((ex) => ({
									workoutPlanDayId: createdDay.id,
									exerciseId: ex.exerciseId,
									exerciseName: ex.exerciseName,
									orderIndex: ex.orderIndex,
									sets: ex.sets,
									reps: ex.reps,
									restSeconds: ex.restSeconds,
									notes: ex.notes,
								}))
							)
							.returning()
					: [];

			createdDays.push({ ...createdDay, exercises: createdExercises });
		}

		const [planRow] = await tx
			.select()
			.from(patientWorkoutPlans)
			.where(
				and(eq(patientWorkoutPlans.id, input.id), eq(patientWorkoutPlans.organizationId, input.organizationId))
			);

		if (!planRow) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
		}

		return { ...planRow, days: createdDays };
	});
};

export const deleteWorkoutPlan = async ({ id, organizationId }: GetWorkoutPlanInput) => {
	const existing = await db.query.patientWorkoutPlans.findFirst({
		where: { id, organizationId },
	});

	if (!existing) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
	}

	await db
		.delete(patientWorkoutPlans)
		.where(and(eq(patientWorkoutPlans.id, id), eq(patientWorkoutPlans.organizationId, organizationId)));

	return { success: true };
};

export const updateWorkoutPlanSummary = async ({
	workoutPlanId,
	summary,
	organizationId,
}: {
	workoutPlanId: string;
	summary: string;
	organizationId: string;
}) => {
	const [plan] = await db
		.update(patientWorkoutPlans)
		.set({ summary })
		.where(and(eq(patientWorkoutPlans.id, workoutPlanId), eq(patientWorkoutPlans.organizationId, organizationId)))
		.returning();

	if (!plan) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
	}

	return plan;
};

export const addExerciseToDay = async ({
	workoutPlanDayId,
	exerciseId,
	exerciseName,
	sets,
	reps,
	restSeconds,
	notes,
	organizationId,
}: {
	workoutPlanDayId: string;
	exerciseId?: string | null;
	exerciseName: string;
	sets?: number | null;
	reps?: string | null;
	restSeconds?: number | null;
	notes?: string | null;
	organizationId: string;
}) => {
	const day = await db.query.patientWorkoutPlanDays.findFirst({
		where: { id: workoutPlanDayId },
		with: {
			workoutPlan: true,
			exercises: true,
		},
	});

	if (!day || !day.workoutPlan || day.workoutPlan.organizationId !== organizationId) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan day not found" });
	}

	const maxOrderIndex = day.exercises.reduce((max, ex) => Math.max(max, ex.orderIndex), -1);

	const [exercise] = await db
		.insert(patientWorkoutPlanExercises)
		.values({
			workoutPlanDayId,
			exerciseId: exerciseId ?? null,
			exerciseName,
			orderIndex: maxOrderIndex + 1,
			sets: sets ?? null,
			reps: reps ?? null,
			restSeconds: restSeconds ?? null,
			notes: notes ?? null,
		})
		.returning();

	return exercise;
};

export const removeExerciseFromDay = async ({
	exerciseId,
	organizationId,
}: {
	exerciseId: string;
	organizationId: string;
}) => {
	const exercise = await db.query.patientWorkoutPlanExercises.findFirst({
		where: { id: exerciseId },
		with: {
			workoutPlanDay: {
				with: {
					workoutPlan: true,
				},
			},
		},
	});

	if (
		!exercise ||
		!exercise.workoutPlanDay ||
		!exercise.workoutPlanDay.workoutPlan ||
		exercise.workoutPlanDay.workoutPlan.organizationId !== organizationId
	) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Exercise not found" });
	}

	await db.delete(patientWorkoutPlanExercises).where(eq(patientWorkoutPlanExercises.id, exerciseId));

	return { success: true };
};

export const updateExerciseInPlan = async ({
	exerciseId: planExerciseId,
	organizationId,
	newExerciseId,
	exerciseName,
	sets,
	reps,
	restSeconds,
	notes,
}: {
	exerciseId: string;
	organizationId: string;
	newExerciseId?: string | null;
	exerciseName?: string;
	sets?: number | null;
	reps?: string | null;
	restSeconds?: number | null;
	notes?: string | null;
}) => {
	const existing = await db.query.patientWorkoutPlanExercises.findFirst({
		where: { id: planExerciseId },
		with: {
			workoutPlanDay: {
				with: {
					workoutPlan: true,
				},
			},
		},
	});

	if (
		!existing ||
		!existing.workoutPlanDay ||
		!existing.workoutPlanDay.workoutPlan ||
		existing.workoutPlanDay.workoutPlan.organizationId !== organizationId
	) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Exercise not found" });
	}

	const updates: Record<string, unknown> = {};
	if (newExerciseId !== undefined) updates.exerciseId = newExerciseId;
	if (exerciseName !== undefined) updates.exerciseName = exerciseName;
	if (sets !== undefined) updates.sets = sets;
	if (reps !== undefined) updates.reps = reps;
	if (restSeconds !== undefined) updates.restSeconds = restSeconds;
	if (notes !== undefined) updates.notes = notes;

	const [updated] = await db
		.update(patientWorkoutPlanExercises)
		.set(updates)
		.where(eq(patientWorkoutPlanExercises.id, planExerciseId))
		.returning();

	return updated;
};

export const reorderExercisesInDay = async ({
	workoutPlanDayId,
	orderedExerciseIds,
	organizationId,
}: {
	workoutPlanDayId: string;
	orderedExerciseIds: string[];
	organizationId: string;
}) => {
	const day = await db.query.patientWorkoutPlanDays.findFirst({
		where: { id: workoutPlanDayId },
		with: {
			workoutPlan: true,
			exercises: true,
		},
	});

	if (!day || !day.workoutPlan || day.workoutPlan.organizationId !== organizationId) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan day not found" });
	}

	const byId = new Map(day.exercises.map((e) => [e.id, e]));
	if (
		orderedExerciseIds.length !== day.exercises.length ||
		new Set(orderedExerciseIds).size !== orderedExerciseIds.length ||
		!orderedExerciseIds.every((id) => byId.has(id))
	) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid exercise order" });
	}

	await db.transaction(async (tx) => {
		for (let index = 0; index < orderedExerciseIds.length; index++) {
			const id = orderedExerciseIds[index];
			await tx
				.update(patientWorkoutPlanExercises)
				.set({ orderIndex: index })
				.where(
					and(
						eq(patientWorkoutPlanExercises.id, id),
						eq(patientWorkoutPlanExercises.workoutPlanDayId, workoutPlanDayId)
					)
				);
		}
	});

	return { success: true };
};
