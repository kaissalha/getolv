"use client";

import { useQuery } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { useTRPC } from "@/lib/trpc";
import { getFullName } from "@/utils/string";
import { cn } from "@starter/ui/lib/utils";

import { MAIL_PATIENT_ID_PARAM } from "./mail-url-state";

type MailThreadPatientBadgeProps = {
	senderEmail: string | undefined;
};

export const MailThreadPatientBadge = ({ senderEmail }: MailThreadPatientBadgeProps) => {
	const trpc = useTRPC();
	const t = useTranslations("mail");
	const [, setPatientId] = useQueryState(MAIL_PATIENT_ID_PARAM, parseAsString);

	const patientQuery = useQuery(
		trpc.patients.getByEmail.queryOptions(
			{ email: senderEmail ?? "" },
			{ enabled: Boolean(senderEmail), staleTime: 60_000 }
		)
	);

	const patient = patientQuery.data;
	if (!patient) {
		return null;
	}

	const fullName = getFullName({ firstName: patient.firstName, lastName: patient.lastName }) || patient.email;

	return (
		<button
			type='button'
			onClick={() => setPatientId(patient.id)}
			className={cn(
				"group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary",
				"transition-[background-color,border-color] duration-150 ease-out hover:border-primary/40 hover:bg-primary/10"
			)}
			aria-label={t("patientPanel.viewPatient", { name: fullName })}
			title={t("patientPanel.viewPatient", { name: fullName })}
		>
			<UserIcon className='size-3' />
			<span className='max-w-40 truncate'>{fullName}</span>
		</button>
	);
};
