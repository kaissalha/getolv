"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, MailIcon, PhoneIcon, UserIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { getFullName, getInitials } from "@/utils/string";
import { Avatar, AvatarFallback } from "@starter/ui/components/avatar";
import { Button, buttonVariants } from "@starter/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@starter/ui/components/credenza";
import { Skeleton } from "@starter/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@starter/ui/components/tabs";
import { cn } from "@starter/ui/lib/utils";

import {
	MailPatientDetailsTab,
	MailPatientDiagnosisTab,
	MailPatientLabsTab,
	MailPatientSessionsTab,
} from "./mail-patient-sheet-tabs";
import { MAIL_PATIENT_ID_PARAM } from "./mail-url-state";

const MAIL_PATIENT_TAB_PARAM = "patientTab";
const DEFAULT_TAB = "details";

export const MailPatientSheet = () => {
	const trpc = useTRPC();
	const t = useTranslations("mail");
	const tPatients = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");
	const [patientId, setPatientId] = useQueryState(MAIL_PATIENT_ID_PARAM, parseAsString);
	const [tab, setTab] = useQueryState(MAIL_PATIENT_TAB_PARAM, parseAsString.withDefault(DEFAULT_TAB));
	const isOpen = Boolean(patientId);

	const patientQuery = useQuery(
		trpc.patients.get.queryOptions({ id: patientId ?? "" }, { enabled: isOpen, staleTime: 60_000 })
	);
	const patient = patientQuery.data;

	const handleClose = () => {
		setPatientId(null);
		setTab(null);
	};

	const fullName = patient ? getFullName({ firstName: patient.firstName, lastName: patient.lastName }) : "";
	const initials = getInitials({ name: fullName });

	return (
		<Credenza type='drawer' side='right' open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<CredenzaPortal>
				<CredenzaContent className={cn("flex min-h-0 w-full max-w-xl flex-col gap-0 overflow-hidden p-0")}>
					<CredenzaHeader className='flex shrink-0 flex-row items-center justify-end gap-1 px-3 py-2'>
						<CredenzaTitle className='sr-only'>
							{patient ? fullName || tPatients("create.card.noName") : t("patientPanel.title")}
						</CredenzaTitle>
						{patient && (
							<Button variant='ghost' size='sm' className='gap-1.5' asChild>
								<Link href={`/dashboard/patients/${patient.id}`}>
									<span>{t("patientPanel.openProfile")}</span>
									<ArrowUpRightIcon className='size-3.5' />
								</Link>
							</Button>
						)}
						<CredenzaClose
							className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 shrink-0")}
							title={commonT("close")}
						>
							<XIcon className='size-4' />
						</CredenzaClose>
					</CredenzaHeader>

					<CredenzaBody
						scrollable={false}
						className='min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-0 [-webkit-overflow-scrolling:touch]'
					>
						{patientQuery.isLoading ? (
							<MailPatientSheetSkeleton />
						) : !patient ? (
							<div className='flex flex-col items-center justify-center gap-2 px-6 py-12 text-center'>
								<div className='flex size-12 items-center justify-center rounded-full bg-muted/50'>
									<UserIcon className='size-5 text-muted-foreground' />
								</div>
								<p className='text-sm font-medium'>{t("patientPanel.notFound")}</p>
							</div>
						) : (
							<div className='flex flex-col'>
								<div className='flex items-center gap-3 px-5 pb-4'>
									<Avatar className='size-12 shrink-0 text-base shadow-sm'>
										<AvatarFallback
											className={cn(fullName ? "bg-primary text-primary-foreground" : "bg-muted")}
										>
											{initials || <UserIcon className='size-4 text-muted-foreground' />}
										</AvatarFallback>
									</Avatar>
									<p className='line-clamp-2 min-w-0 flex-1 text-xl font-semibold tracking-tight'>
										{fullName || tPatients("create.card.noName")}
									</p>
								</div>

								{(patient.email || patient.phoneNumber) && (
									<div className='no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto px-5 pb-5'>
										{patient.email && (
											<Button size='sm' variant='secondary' asChild>
												<a href={`mailto:${patient.email}`}>
													<MailIcon className='size-3.5' />
													<span>{commonT("fields.email")}</span>
												</a>
											</Button>
										)}
										{patient.phoneNumber && (
											<Button size='sm' variant='secondary' asChild>
												<a href={`tel:${patient.phoneNumber}`}>
													<PhoneIcon className='size-3.5' />
													<span>{commonT("fields.phoneNumber")}</span>
												</a>
											</Button>
										)}
									</div>
								)}

								<Tabs value={tab} onValueChange={setTab} className='flex flex-col'>
									<TabsList className='shrink-0 px-5'>
										<TabsTrigger value='details'>{t("patientPanel.tabs.details")}</TabsTrigger>
										<TabsTrigger value='diagnosis'>{t("patientPanel.tabs.diagnosis")}</TabsTrigger>
										<TabsTrigger value='sessions'>{t("patientPanel.tabs.sessions")}</TabsTrigger>
										<TabsTrigger value='labs'>{t("patientPanel.tabs.labs")}</TabsTrigger>
									</TabsList>
									<MailPatientDetailsTab patient={patient} />
									<MailPatientDiagnosisTab patient={patient} />
									<MailPatientSessionsTab patientId={patient.id} />
									<MailPatientLabsTab patientId={patient.id} />
								</Tabs>
							</div>
						)}
					</CredenzaBody>
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};

const MailPatientSheetSkeleton = () => (
	<div className='flex flex-col'>
		<div className='flex items-center gap-3 px-5 pb-4'>
			<Skeleton className='size-12 rounded-full' />
			<Skeleton className='h-6 w-48' />
		</div>
		<div className='flex items-center gap-2 px-5 pb-5'>
			<Skeleton className='h-8 w-24 rounded-md' />
			<Skeleton className='h-8 w-24 rounded-md' />
		</div>
		<div className='flex flex-col gap-3 px-5 pt-3'>
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className='flex items-start gap-3'>
					<Skeleton className='size-8 shrink-0 rounded-full' />
					<div className='flex flex-1 flex-col gap-2 pt-1'>
						<Skeleton className='h-3 w-20' />
						<Skeleton className='h-4 w-full' />
					</div>
				</div>
			))}
		</div>
	</div>
);
