"use client";

import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import {
	BeakerIcon,
	CalendarIcon,
	CalendarPlusIcon,
	DnaIcon,
	FileTextIcon,
	HeartPulseIcon,
	PillIcon,
	ShieldAlertIcon,
	UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@getolv/server";
import { Skeleton } from "@getolv/ui/components/skeleton";
import { TabsContent } from "@getolv/ui/components/tabs";
import { cn } from "@getolv/ui/lib/utils";

type Patient = NonNullable<RouterOutput["patients"]["get"]>;

const formatDate = ({ value }: { value: string }) =>
	new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));

const SectionLabel = ({ children }: { children: ReactNode }) => (
	<span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>{children}</span>
);

const DetailRow = ({
	icon,
	label,
	toneClassName,
	value,
}: {
	icon: ReactNode;
	label: string;
	toneClassName?: string;
	value: ReactNode;
}) => (
	<div className='flex items-start gap-3 text-sm'>
		<div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50", toneClassName)}>
			{icon}
		</div>
		<div className='flex min-w-0 flex-1 flex-col gap-0.5 pt-1'>
			<span className='text-xs font-medium text-muted-foreground'>{label}</span>
			<div className='whitespace-pre-wrap text-sm font-medium leading-relaxed text-foreground/90'>{value}</div>
		</div>
	</div>
);

const EmptyHint = ({ children }: { children: ReactNode }) => (
	<p className='text-sm leading-relaxed text-muted-foreground'>{children}</p>
);

const formatDateAdded = ({ value }: { value: string }) =>
	new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));

export const MailPatientDetailsTab = ({ patient }: { patient: Patient }) => {
	const tOverview = useTranslations("dashboard.patients.overview");
	const tPatients = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");

	const genderLabel = (() => {
		switch (patient.gender) {
			case "female":
			case "male":
			case "other":
			case "preferNotToSay":
				return tPatients(`gender.${patient.gender}`);
			default:
				return patient.gender ?? null;
		}
	})();

	const profileItems = [
		genderLabel
			? {
					icon: <UserIcon className='size-3.5 text-muted-foreground' />,
					label: commonT("fields.gender"),
					value: genderLabel,
				}
			: null,
		patient.dateOfBirth
			? {
					icon: <CalendarIcon className='size-3.5 text-muted-foreground' />,
					label: commonT("fields.dateOfBirth"),
					value: patient.dateOfBirth,
				}
			: null,
		{
			icon: <CalendarPlusIcon className='size-3.5 text-muted-foreground' />,
			label: commonT("fields.dateAdded"),
			value: formatDateAdded({ value: patient.createdAt }),
		},
	].flatMap((item) => (item ? [item] : []));

	const medicalItems = [
		patient.allergies
			? {
					icon: <ShieldAlertIcon className='size-3.5 text-destructive' />,
					label: commonT("fields.allergies"),
					toneClassName: "bg-destructive/10",
					value: patient.allergies,
				}
			: null,
		patient.currentMedications
			? {
					icon: <PillIcon className='size-3.5 text-info-foreground' />,
					label: commonT("fields.currentMedications"),
					toneClassName: "bg-info/10",
					value: patient.currentMedications,
				}
			: null,
		patient.pastMedicalHistory
			? {
					icon: <HeartPulseIcon className='size-3.5 text-warning-foreground' />,
					label: commonT("fields.pastMedicalHistory"),
					toneClassName: "bg-warning/10",
					value: patient.pastMedicalHistory,
				}
			: null,
		patient.familyMedicalHistory
			? {
					icon: <DnaIcon className='size-3.5 text-success-foreground' />,
					label: commonT("fields.familyMedicalHistory"),
					toneClassName: "bg-success/10",
					value: patient.familyMedicalHistory,
				}
			: null,
	].flatMap((item) => (item ? [item] : []));

	return (
		<TabsContent value='details' className='flex flex-col gap-6 px-5 py-5'>
			<div className='flex flex-col gap-2'>
				<SectionLabel>{tOverview("patientSummaryTitle")}</SectionLabel>
				{patient.summary ? (
					<p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground/90'>{patient.summary}</p>
				) : (
					<EmptyHint>{tOverview("patientSummaryPlaceholder")}</EmptyHint>
				)}
			</div>

			<div className='flex flex-col gap-3'>
				{profileItems.map((item) => (
					<DetailRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
				))}
			</div>

			{patient.additionalContext && (
				<div className='flex flex-col gap-2'>
					<SectionLabel>{commonT("fields.additionalContext")}</SectionLabel>
					<div className='flex items-start gap-3'>
						<div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50'>
							<FileTextIcon className='size-3.5 text-muted-foreground' />
						</div>
						<p className='whitespace-pre-wrap pt-1 text-sm font-medium leading-relaxed text-foreground/90'>
							{patient.additionalContext}
						</p>
					</div>
				</div>
			)}

			<div className='flex flex-col gap-3'>
				<SectionLabel>{tOverview("medicalProfileTitle")}</SectionLabel>
				{medicalItems.length > 0 ? (
					<div className='flex flex-col gap-3'>
						{medicalItems.map((item) => (
							<DetailRow
								key={item.label}
								icon={item.icon}
								label={item.label}
								toneClassName={item.toneClassName}
								value={item.value}
							/>
						))}
					</div>
				) : (
					<EmptyHint>{tOverview("medicalProfileEmpty")}</EmptyHint>
				)}
			</div>
		</TabsContent>
	);
};

const diagnosisBadgeToneClass = {
	differential: "bg-info/12 text-info-foreground ring-1 ring-info/25",
	working: "bg-destructive/12 text-destructive ring-1 ring-destructive/25",
} as const;

const DiagnosisRow = ({
	entry,
	label,
	tone,
}: {
	entry: Patient["diagnosis"]["workingDx"][number];
	label: string;
	tone: keyof typeof diagnosisBadgeToneClass;
}) => (
	<div className='flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3'>
		<div className='flex min-w-0 flex-wrap items-baseline gap-2'>
			<p className='min-w-0 text-sm font-medium text-foreground'>{entry.name}</p>
			<span
				className={cn(
					"shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase leading-none",
					diagnosisBadgeToneClass[tone]
				)}
			>
				{label}
			</span>
		</div>
		{entry.reasoning && <p className='text-sm leading-snug text-muted-foreground'>{entry.reasoning}</p>}
		{entry.evidence && (
			<p className='text-xs leading-relaxed text-muted-foreground/80'>
				<strong className='font-medium text-foreground/80'>{label}:</strong> {entry.evidence}
			</p>
		)}
		{entry.missing && <p className='text-xs leading-relaxed text-muted-foreground/80'>{entry.missing}</p>}
		{entry.verifyNext && <p className='text-xs leading-relaxed text-muted-foreground/80'>{entry.verifyNext}</p>}
	</div>
);

export const MailPatientDiagnosisTab = ({ patient }: { patient: Patient }) => {
	const tOverview = useTranslations("dashboard.patients.overview");
	const hasDiagnosis = patient.diagnosis.workingDx.length > 0 || patient.diagnosis.differentialDx.length > 0;

	return (
		<TabsContent value='diagnosis' className='flex flex-col gap-4 px-5 py-5'>
			{hasDiagnosis ? (
				<div className='flex flex-col gap-3'>
					{patient.diagnosis.workingDx.map((entry) => (
						<DiagnosisRow
							key={`working-${entry.name}`}
							entry={entry}
							label={tOverview("workingDiagnosisBadge")}
							tone='working'
						/>
					))}
					{patient.diagnosis.differentialDx.map((entry) => (
						<DiagnosisRow
							key={`differential-${entry.name}`}
							entry={entry}
							label={tOverview("differentialDiagnosisBadge")}
							tone='differential'
						/>
					))}
				</div>
			) : (
				<EmptyHint>{tOverview("diagnosisEmpty")}</EmptyHint>
			)}
		</TabsContent>
	);
};

const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
	<div className='flex flex-col gap-3'>
		{Array.from({ length: rows }).map((_, index) => (
			<div key={index} className='flex flex-col gap-2 rounded-md border border-border/60 bg-card p-3'>
				<Skeleton className='h-4 w-32' />
				<Skeleton className='h-3 w-24' />
				<Skeleton className='h-3 w-full' />
			</div>
		))}
	</div>
);

export const MailPatientSessionsTab = ({ patientId }: { patientId: string }) => {
	const trpc = useTRPC();
	const t = useTranslations("mail.patientPanel");
	const tOverview = useTranslations("dashboard.patients.overview");
	const sessionsQuery = useQuery(
		trpc.patientSessions.getPatientSessions.queryOptions({ patientId }, { staleTime: 60_000 })
	);

	return (
		<TabsContent value='sessions' className='flex flex-col gap-3 px-5 py-5'>
			{sessionsQuery.isLoading ? (
				<ListSkeleton />
			) : sessionsQuery.data && sessionsQuery.data.length > 0 ? (
				sessionsQuery.data.map((session) => (
					<Link
						key={session.id}
						href={`/dashboard/patients/${patientId}/session/${session.id}`}
						className='group flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3 transition-colors duration-150 ease-out hover:border-border hover:bg-accent/40'
					>
						<div className='flex min-w-0 items-baseline justify-between gap-3'>
							<p className='min-w-0 flex-1 truncate text-sm font-medium text-foreground'>
								{session.title || tOverview("untitledSession")}
							</p>
							<span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
								{formatDate({ value: session.createdAt })}
							</span>
						</div>
						{session.summary && (
							<p className='line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
								{session.summary}
							</p>
						)}
					</Link>
				))
			) : (
				<EmptyHint>{t("noSessions")}</EmptyHint>
			)}
		</TabsContent>
	);
};

export const MailPatientLabsTab = ({ patientId }: { patientId: string }) => {
	const trpc = useTRPC();
	const t = useTranslations("mail.patientPanel");
	const tOverview = useTranslations("dashboard.patients.overview");
	const labsQuery = useQuery(trpc.labs.getPatientLabReports.queryOptions({ patientId }, { staleTime: 60_000 }));

	return (
		<TabsContent value='labs' className='flex flex-col gap-3 px-5 py-5'>
			{labsQuery.isLoading ? (
				<ListSkeleton />
			) : labsQuery.data && labsQuery.data.length > 0 ? (
				labsQuery.data.map((report) => (
					<Link
						key={report.id}
						href={`/dashboard/patients/${patientId}/labs?report=${encodeURIComponent(report.id)}`}
						className='group flex flex-col gap-1.5 rounded-md border border-border/60 bg-card p-3 transition-colors duration-150 ease-out hover:border-border hover:bg-accent/40'
					>
						<div className='flex min-w-0 items-baseline justify-between gap-3'>
							<div className='flex min-w-0 flex-1 items-center gap-2'>
								<BeakerIcon className='size-3.5 shrink-0 text-muted-foreground' />
								<p className='min-w-0 truncate text-sm font-medium text-foreground'>
									{report.patientSession?.title || tOverview("labReportTitle")}
								</p>
							</div>
							<span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
								{formatDate({ value: report.reportDate ?? report.createdAt })}
							</span>
						</div>
						{report.summary && (
							<p className='line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
								{report.summary}
							</p>
						)}
					</Link>
				))
			) : (
				<EmptyHint>{t("noLabs")}</EmptyHint>
			)}
		</TabsContent>
	);
};
