"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { MAIL_PATIENT_ID_PARAM } from "@/components/mail/mail-url-state";
import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { getFullName } from "@/utils/string";
import { Button } from "@getolv/ui/components/button";

import { BaseWidget } from "./base-widget";

export const PatientsWidgetSkeleton = () => {
	const t = useTranslations("dashboard.widgets.patients");

	return (
		<BaseWidget title={t("title")} icon={<UsersIcon className='size-3.5' />}>
			<div className='flex flex-col gap-2'>
				<div className='h-8 w-16 animate-pulse rounded bg-muted' />
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
				<div className='h-4 w-5/6 animate-pulse rounded bg-muted' />
			</div>
		</BaseWidget>
	);
};

export const PatientsWidget = () => {
	const t = useTranslations("dashboard.widgets.patients");
	const trpc = useTRPC();
	const [, setPatientId] = useQueryState(MAIL_PATIENT_ID_PARAM, parseAsString);

	const { data, isLoading } = useQuery(trpc.patients.list.queryOptions({ pageSize: 3 }));

	const patients = data?.data ?? [];
	const total = data?.meta.totalData ?? 0;

	if (isLoading) return <PatientsWidgetSkeleton />;

	return (
		<BaseWidget
			title={t("title")}
			icon={<UsersIcon className='size-3.5' />}
			action={patients.length ? { label: t("viewAll"), href: "/dashboard/patients" } : undefined}
		>
			{!patients.length ? (
				<div className='flex flex-col items-start gap-2'>
					<p className='text-sm text-muted-foreground'>{t("empty")}</p>
					<Button type='button' variant='outline' size='sm' asChild>
						<Link href='/dashboard/patients/create'>
							<PlusIcon className='size-3.5' />
							{t("addFirst")}
						</Link>
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-1'>
					<p className='mb-1 text-2xl font-normal text-foreground'>{t("total", { count: total })}</p>
					{patients.map((patient) => {
						const name = getFullName({ firstName: patient.firstName, lastName: patient.lastName });
						return (
							<button
								key={patient.id}
								type='button'
								className='flex w-full cursor-pointer items-center justify-between rounded-md text-start text-sm transition-colors md:p-1 hover:bg-accent'
								onClick={() => {
									void setPatientId(patient.id);
								}}
							>
								<span className='truncate text-foreground'>{name}</span>
								<span className='shrink-0 text-xs text-muted-foreground'>{patient.email}</span>
							</button>
						);
					})}
				</div>
			)}
		</BaseWidget>
	);
};
