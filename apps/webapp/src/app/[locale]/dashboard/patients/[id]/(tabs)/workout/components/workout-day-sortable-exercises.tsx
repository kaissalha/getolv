"use client";

import Image from "next/image";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, Dumbbell, GripVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { Button } from "@starter/ui/components/button";
import { cn } from "@starter/ui/lib/utils";

import { formatBodyPart } from "./format-body-part";

export type PlanExerciseRow = {
	id: string;
	exerciseName: string;
	notes: string | null;
	sets: number | null;
	reps: string | null;
	restSeconds: number | null;
	exercise: {
		gifUrl: string | null;
		bodyParts: string[];
	} | null;
};

type SortableRowProps = {
	exercise: PlanExerciseRow;
	onSwap: (id: string) => void;
	onRemove: (id: string) => void;
};

const SortableExerciseRow = ({ exercise, onSwap, onRemove }: SortableRowProps) => {
	const t = useTranslations("dashboard.patients.workout");
	const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
		id: exercise.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const rawPart = exercise.exercise?.bodyParts?.[0];
	const categoryLabel = rawPart ? formatBodyPart({ raw: rawPart }) : t("bodyPartGeneral");

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"flex items-center justify-between gap-4 border-t px-4 py-3 transition-colors first:border-t-0 hover:bg-muted/30",
				isDragging && "bg-muted/40"
			)}
		>
			<div className='flex min-w-0 flex-1 items-center gap-2'>
				<button
					type='button'
					className='flex size-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing'
					aria-label={t("dragHandleLabel")}
					{...attributes}
					{...listeners}
				>
					<GripVertical className='size-4' />
				</button>
				{exercise.exercise?.gifUrl ? (
					<div className='relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted/50'>
						<Image
							src={exercise.exercise.gifUrl}
							alt={exercise.exerciseName}
							fill
							sizes='48px'
							unoptimized
							className='object-cover mix-blend-multiply dark:mix-blend-normal'
						/>
					</div>
				) : (
					<div className='flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground/40'>
						<Dumbbell className='size-5' strokeWidth={1.5} />
					</div>
				)}
				<div className='flex min-w-0 flex-col gap-0.5'>
					<div className='flex flex-wrap items-center gap-2'>
						<span className='truncate text-sm font-medium'>{exercise.exerciseName}</span>
						<span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							{categoryLabel}
						</span>
					</div>
					{exercise.notes && (
						<span className='line-clamp-1 text-xs text-muted-foreground'>{exercise.notes}</span>
					)}
				</div>
			</div>

			<div className='flex shrink-0 items-center gap-2'>
				<div className='flex flex-col items-end gap-1 tabular-nums'>
					{exercise.sets && exercise.reps && (
						<span className='text-sm font-medium'>
							{exercise.sets} × {exercise.reps}
						</span>
					)}
					{exercise.restSeconds !== null &&
						exercise.restSeconds !== undefined &&
						exercise.restSeconds > 0 && (
							<span className='text-xs text-muted-foreground'>
								{t("restSecondsLabel", { seconds: exercise.restSeconds })}
							</span>
						)}
				</div>

				<div className='flex shrink-0 items-center gap-0.5'>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => onSwap(exercise.id)}
						title={t("swapExercise")}
						aria-label={t("swapExercise")}
					>
						<ArrowLeftRight className='h-3.5 w-3.5 text-muted-foreground' />
					</Button>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => onRemove(exercise.id)}
						title={t("removeExercise")}
						aria-label={t("removeExercise")}
					>
						<Trash2 className='h-3.5 w-3.5 text-muted-foreground' />
					</Button>
				</div>
			</div>
		</div>
	);
};

type WorkoutDaySortableExercisesProps = {
	dayId: string;
	exercises: PlanExerciseRow[];
	selectedPlanId: string;
	patientId: string;
	onSwap: (exerciseId: string) => void;
	onRemove: (exerciseId: string) => void;
};

export const WorkoutDaySortableExercises = ({
	dayId,
	exercises,
	selectedPlanId,
	patientId,
	onSwap,
	onRemove,
}: WorkoutDaySortableExercisesProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const workoutPlanQueryKey = trpc.workouts.getWorkoutPlan.queryKey({ id: selectedPlanId });

	const reorderMutation = useMutation(
		trpc.workouts.reorderExercisesInDay.mutationOptions({
			onMutate: async ({ workoutPlanDayId: planDayId, orderedExerciseIds: nextIds }) => {
				await queryClient.cancelQueries({ queryKey: workoutPlanQueryKey });

				const previousPlan = queryClient.getQueryData(workoutPlanQueryKey);

				queryClient.setQueryData(workoutPlanQueryKey, (old) => {
					if (!old) return old;

					return {
						...old,
						days: old.days.map((day) => {
							if (day.id !== planDayId) return day;

							const byId = new Map(day.exercises.map((e) => [e.id, e]));
							const exercises = nextIds.flatMap((id, index) => {
								const ex = byId.get(id);
								return ex ? [{ ...ex, orderIndex: index }] : [];
							});

							return { ...day, exercises };
						}),
					};
				});

				return { previousPlan };
			},
			onError: (_err, _input, context) => {
				if (context?.previousPlan !== undefined) {
					queryClient.setQueryData(workoutPlanQueryKey, context.previousPlan);
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: workoutPlanQueryKey });
				queryClient.invalidateQueries({
					queryKey: trpc.workouts.listPatientWorkoutPlans.queryKey({ patientId }),
				});
			},
		})
	);

	const ids = exercises.map((e) => e.id);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = ids.indexOf(String(active.id));
		const newIndex = ids.indexOf(String(over.id));
		if (oldIndex === -1 || newIndex === -1) return;

		const nextOrder = arrayMove(ids, oldIndex, newIndex);
		reorderMutation.mutate({
			workoutPlanDayId: dayId,
			orderedExerciseIds: nextOrder,
		});
	};

	if (exercises.length === 0) {
		return null;
	}

	return (
		<DndContext
			id={`workout-day-${dayId}`}
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext disabled={reorderMutation.isPending} items={ids} strategy={verticalListSortingStrategy}>
				<div className='flex flex-col'>
					{exercises.map((exercise) => (
						<SortableExerciseRow
							key={exercise.id}
							exercise={exercise}
							onSwap={onSwap}
							onRemove={onRemove}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};
