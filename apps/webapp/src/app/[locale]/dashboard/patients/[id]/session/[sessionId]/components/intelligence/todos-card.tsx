"use client";

import { CheckCircle2Icon, CircleIcon, ListTodoIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	formatCopyCard,
	formatCopyList,
	formatCopyText,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import { cn } from "@getolv/ui/lib/utils";

import { IntelligenceCard } from "./intelligence-card";
import type { TodoItem } from "./types";

type TodosCardProps = {
	completedTodoIds: string[];
	disabled?: boolean;
	todos: TodoItem[];
	loading?: boolean;
	onCompletedTodoIdsChange: (completedTodoIds: string[]) => void;
};

export const TodosCard = ({
	completedTodoIds,
	disabled = false,
	todos,
	loading,
	onCompletedTodoIdsChange,
}: TodosCardProps) => {
	const t = useTranslations("sessionIntelligence");
	const getCopyValue = () =>
		formatCopyCard({
			title: t("todos"),
			sections: [
				formatCopyList({
					items: todos.map((todo) => {
						const text = formatCopyText({ value: todo.text });

						if (!text) {
							return null;
						}

						const category = formatCopyText({ value: todo.category });
						const prefix = completedTodoIds.includes(todo.id) ? "[x]" : "[ ]";

						return category ? `${prefix} ${text} (${category})` : `${prefix} ${text}`;
					}),
					emptyText: t("noTodos"),
				}),
			],
		});

	return (
		<IntelligenceCard
			title={t("todos")}
			icon={<ListTodoIcon className='size-4' />}
			loading={loading}
			className='h-full min-h-0 w-full'
			getCopyValue={getCopyValue}
			badge={todos.length > 0 ? <span className='text-xs text-muted-foreground'>{todos.length}</span> : null}
		>
			{todos.length > 0 ? (
				<TodosList
					completedTodoIds={completedTodoIds}
					disabled={disabled}
					todos={todos}
					onCompletedTodoIdsChange={onCompletedTodoIdsChange}
				/>
			) : (
				<p className='text-sm text-muted-foreground'>{t("noTodos")}</p>
			)}
		</IntelligenceCard>
	);
};

const TodosList = ({
	completedTodoIds,
	disabled,
	todos,
	onCompletedTodoIdsChange,
}: {
	completedTodoIds: string[];
	disabled: boolean;
	todos: TodoItem[];
	onCompletedTodoIdsChange: (completedTodoIds: string[]) => void;
}) => {
	const t = useTranslations("sessionIntelligence");

	const toggle = (id: string) => {
		const completed = new Set(completedTodoIds);

		if (completed.has(id)) {
			completed.delete(id);
		} else {
			completed.add(id);
		}

		onCompletedTodoIdsChange(Array.from(completed));
	};

	return (
		<ul className='flex flex-col gap-0.5'>
			{todos.map((todo) => {
				const done = completedTodoIds.includes(todo.id);
				return (
					<li key={todo.id}>
						<button
							type='button'
							onClick={() => toggle(todo.id)}
							aria-pressed={done}
							disabled={disabled}
							aria-label={t("toggleTodoItemAria", { text: todo.text })}
							className={cn(
								"flex w-full min-w-0 items-start gap-2 rounded-sm py-1.5 ps-1 pe-1 text-start text-sm transition-colors",
								"hover:bg-accent/50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							)}
						>
							<span className='pointer-events-none mt-0.5 shrink-0' aria-hidden>
								{done ? (
									<CheckCircle2Icon className='size-3.5 text-muted-foreground' />
								) : (
									<CircleIcon className='size-3.5 text-muted-foreground' />
								)}
							</span>
							<span
								className={cn(
									"min-w-0 flex-1 leading-snug",
									done && "text-muted-foreground line-through"
								)}
							>
								{todo.text}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
};
