"use client";

import { useState } from "react";

import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@starter/ui/components/credenza";
import { Input } from "@starter/ui/components/input";

import { formatBodyPart } from "./format-body-part";

type ExerciseSearchDialogProps = {
	onOpenChange: (open: boolean) => void;
	onSelect: (exercise: { id: string; name: string }) => void;
	open: boolean;
	title: string;
};

export const ExerciseSearchDialog = ({ onOpenChange, onSelect, open, title }: ExerciseSearchDialogProps) => {
	const trpc = useTRPC();
	const t = useTranslations("dashboard.patients.workout");
	const [search, setSearch] = useState("");

	const { data: results = [], isFetching } = useQuery(
		trpc.workouts.searchExercises.queryOptions({ search, limit: 30 }, { enabled: open })
	);

	return (
		<Credenza open={open} onOpenChange={onOpenChange}>
			<CredenzaPortal>
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>{title}</CredenzaTitle>
					</CredenzaHeader>
					<CredenzaBody className='flex flex-col gap-3 pb-6'>
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder={t("searchExercises")}
						/>
						<div className='flex max-h-80 flex-col overflow-y-auto rounded-lg border'>
							{results.length === 0 && !isFetching && (
								<p className='px-4 py-6 text-center text-sm text-muted-foreground'>
									{t("noExercisesFound")}
								</p>
							)}
							{results.map((exercise) => (
								<button
									key={exercise.id}
									type='button'
									onClick={() => {
										onSelect({ id: exercise.id, name: exercise.name });
										onOpenChange(false);
										setSearch("");
									}}
									className='flex items-center gap-3 border-b px-4 py-2.5 text-start transition-colors last:border-b-0 hover:bg-muted/50'
								>
									{exercise.gifUrl ? (
										<div className='relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted/50'>
											<Image
												src={exercise.gifUrl}
												alt={exercise.name}
												fill
												sizes='40px'
												unoptimized
												className='object-cover mix-blend-multiply dark:mix-blend-normal'
											/>
										</div>
									) : (
										<div className='flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground/40'>
											<Dumbbell className='size-4' strokeWidth={1.5} />
										</div>
									)}
									<div className='flex min-w-0 flex-col'>
										<span className='truncate text-sm font-medium'>{exercise.name}</span>
										{exercise.bodyParts.length > 0 && (
											<span className='text-xs text-muted-foreground'>
												{exercise.bodyParts
													.map((bodyPart) => formatBodyPart({ raw: bodyPart }))
													.join(", ")}
											</span>
										)}
									</div>
								</button>
							))}
						</div>
					</CredenzaBody>
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};
