"use client";

import { CheckCircle2Icon, CirclePlusIcon, ListTodoIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
	formatCopyCard,
	formatCopyList,
	formatCopyText,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import type { RouterOutput } from "@starter/server";
import { Button } from "@starter/ui/components/button";
import { Field, FieldControl, FieldLabel } from "@starter/ui/components/field";

import { OverviewSidebarCard, SectionLabel } from "./overview-sidebar-card";
import type { PatientClinicalStateFormValues } from "./patient-clinical-state-form";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type PatientTodosCardProps = {
	formId: string;
	isAnotherCardEditing: boolean;
	isEditing: boolean;
	isSaving: boolean;
	onAppendTodo: () => void;
	onCancelEditing: () => void;
	onCompleteTodo: ({ todoId }: { todoId: string }) => Promise<void>;
	onRemoveTodo: ({ todoId }: { todoId: string }) => Promise<void>;
	onRemoveTodoRow: ({ index }: { index: number }) => void;
	onStartEditing: () => void;
	patient: PatientDetails;
	todoFields: Array<{ fieldId: string }>;
};

export const PatientTodosCard = ({
	formId,
	isAnotherCardEditing,
	isEditing,
	isSaving,
	onAppendTodo,
	onCancelEditing,
	onCompleteTodo,
	onRemoveTodo,
	onRemoveTodoRow,
	onStartEditing,
	patient,
	todoFields,
}: PatientTodosCardProps) => {
	const form = useFormContext<PatientClinicalStateFormValues>();
	const tOverview = useTranslations("dashboard.patients.overview");
	const actions = isEditing ? (
		<div className='flex items-center gap-2'>
			<Button type='button' size='xs' variant='ghost' onClick={onCancelEditing} disabled={isSaving}>
				{tOverview("cancelEdit")}
			</Button>
			<Button type='submit' form={formId} size='xs' loading={isSaving}>
				{tOverview("saveChanges")}
			</Button>
		</div>
	) : (
		<Button type='button' size='xs' variant='outline' onClick={onStartEditing} disabled={isAnotherCardEditing}>
			{tOverview("editTodos")}
		</Button>
	);
	const getCopyValue = () => {
		const values = form.getValues();
		const todoItems = formatCopyList({
			items: (isEditing ? values.todos : patient.todos).map((todo) => {
				const text = formatCopyText({ value: todo.text });

				if (!text) {
					return null;
				}

				const category = formatCopyText({ value: todo.category });

				return category ? `${text} (${category})` : text;
			}),
			emptyText: tOverview("todosEmpty"),
		});

		return formatCopyCard({
			title: tOverview("todosTitle"),
			sections: [todoItems],
		});
	};

	return (
		<OverviewSidebarCard
			actions={actions}
			getCopyValue={getCopyValue}
			icon={<ListTodoIcon className='size-4' />}
			title={tOverview("todosTitle")}
		>
			{isEditing ? (
				<div className='flex flex-col gap-3'>
					<div className='flex items-center justify-between gap-3'>
						<SectionLabel>{tOverview("activeTodosLabel")}</SectionLabel>
						<Button type='button' size='xs' variant='outline' onClick={onAppendTodo}>
							<CirclePlusIcon className='size-3.5' />
							{tOverview("addTodo")}
						</Button>
					</div>
					{todoFields.length > 0 ? (
						<div className='flex flex-col gap-3'>
							{todoFields.map((field, index) => (
								<div
									key={field.fieldId}
									className='rounded-sm border border-border/80 bg-background/80 p-3'
								>
									<input type='hidden' {...form.register(`todos.${index}.id`)} />
									<div className='mb-3 flex items-center justify-between gap-3'>
										<SectionLabel>
											{tOverview("todoEntryLabel", { number: index + 1 })}
										</SectionLabel>
										<Button
											type='button'
											size='icon-sm'
											variant='ghost'
											onClick={() => onRemoveTodoRow({ index })}
											aria-label={tOverview("removeTodoItemAria", { text: `${index + 1}` })}
										>
											<Trash2Icon className='size-3.5' />
										</Button>
									</div>
									<div className='flex flex-col gap-3'>
										<Field name={`todos.${index}.text`}>
											<FieldLabel>{tOverview("todoTextLabel")}</FieldLabel>
											<FieldControl
												{...form.register(`todos.${index}.text`)}
												aria-label={tOverview("todoTextLabel")}
												placeholder={tOverview("todoTextPlaceholder")}
											/>
										</Field>
										<Field name={`todos.${index}.category`}>
											<FieldLabel>{tOverview("todoCategoryLabel")}</FieldLabel>
											<FieldControl
												{...form.register(`todos.${index}.category`)}
												aria-label={tOverview("todoCategoryLabel")}
												placeholder={tOverview("todoCategoryPlaceholder")}
											/>
										</Field>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("todosEmpty")}</p>
					)}
				</div>
			) : patient.todos.length > 0 ? (
				<ul className='flex flex-col gap-1'>
					{patient.todos.map((todo) => (
						<li key={todo.id} className='flex items-start gap-2 rounded-sm py-1.5'>
							<Button
								type='button'
								size='icon-sm'
								variant='ghost'
								className='mt-0.5 shrink-0'
								onClick={() => void onCompleteTodo({ todoId: todo.id })}
								disabled={isSaving || isAnotherCardEditing}
								aria-label={tOverview("completeTodoItemAria", { text: todo.text })}
							>
								<CheckCircle2Icon className='size-3.5 text-muted-foreground' />
							</Button>
							<div className='min-w-0 flex-1'>
								<p className='text-sm leading-snug text-foreground'>{todo.text}</p>
								{todo.category ? (
									<p className='mt-1 text-xs uppercase tracking-widest text-muted-foreground/70'>
										{todo.category}
									</p>
								) : null}
							</div>
							<Button
								type='button'
								size='icon-sm'
								variant='ghost'
								className='shrink-0'
								onClick={() => void onRemoveTodo({ todoId: todo.id })}
								disabled={isSaving || isAnotherCardEditing}
								aria-label={tOverview("removeTodoItemAria", { text: todo.text })}
							>
								<Trash2Icon className='size-3.5 text-muted-foreground' />
							</Button>
						</li>
					))}
				</ul>
			) : (
				<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("todosEmpty")}</p>
			)}
		</OverviewSidebarCard>
	);
};
