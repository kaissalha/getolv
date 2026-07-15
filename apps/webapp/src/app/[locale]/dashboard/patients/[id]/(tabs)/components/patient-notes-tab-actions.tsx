"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@getolv/ui/components/button";

type PatientNotesTabActionsProps = {
	onNewNote: () => void;
};

export const PatientNotesTabActions = ({ onNewNote }: PatientNotesTabActionsProps) => {
	const t = useTranslations("notes");

	return (
		<div className='flex w-full flex-wrap items-center justify-end gap-2 sm:flex-nowrap md:gap-3'>
			<Button type='button' onClick={onNewNote} size='sm' className='shrink-0'>
				<PlusIcon />
				{t("newNote")}
			</Button>
		</div>
	);
};
