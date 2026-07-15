"use client";

import {
	CalendarIcon,
	DnaIcon,
	HeartPulseIcon,
	MailIcon,
	PhoneIcon,
	PillIcon,
	ShieldAlertIcon,
	UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@getolv/ui/components/avatar";
import { Badge } from "@getolv/ui/components/badge";
import { Separator } from "@getolv/ui/components/separator";
import { cn } from "@getolv/ui/lib/utils";

import type { PatientFormValues } from "../../patient-form-schema";

type PatientPreviewCardProps = {
	values: PatientFormValues;
};

export const PatientPreviewCard = ({ values }: PatientPreviewCardProps) => {
	const t = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");

	const fullName = [values.firstName, values.lastName].filter(Boolean).join(" ");
	const initials = fullName
		? fullName
				.split(" ")
				.map((part) => part[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "";

	const hasContactInfo = values.email || values.phoneNumber;
	const medicalItems = [
		values.allergies
			? {
					icon: <ShieldAlertIcon className='size-3.5 text-destructive' />,
					label: commonT("fields.allergies"),
					toneClassName: "bg-destructive/10",
					value: values.allergies,
				}
			: null,
		values.currentMedications
			? {
					icon: <PillIcon className='size-3.5 text-info-foreground' />,
					label: commonT("fields.currentMedications"),
					toneClassName: "bg-info/10",
					value: values.currentMedications,
				}
			: null,
		values.pastMedicalHistory
			? {
					icon: <HeartPulseIcon className='size-3.5 text-warning-foreground' />,
					label: commonT("fields.pastMedicalHistory"),
					toneClassName: "bg-warning/10",
					value: values.pastMedicalHistory,
				}
			: null,
		values.familyMedicalHistory
			? {
					icon: <DnaIcon className='size-3.5 text-success-foreground' />,
					label: commonT("fields.familyMedicalHistory"),
					toneClassName: "bg-success/10",
					value: values.familyMedicalHistory,
				}
			: null,
	].flatMap((item) => (item ? [item] : []));

	return (
		<div className='flex w-full flex-col gap-6 rounded-2xl border border-border/50 bg-background/95 p-6 shadow-xl shadow-black/5 backdrop-blur-sm transition-[box-shadow] duration-200 ease-out hover:shadow-2xl hover:shadow-black/10'>
			<div className='flex items-center gap-4'>
				<Avatar className='size-14 text-lg shadow-sm'>
					<AvatarFallback className={cn(fullName ? "bg-primary text-primary-foreground" : "bg-muted")}>
						{initials || <UserIcon className='size-5 text-muted-foreground' />}
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col gap-1'>
					<span
						className={cn(
							"text-lg font-semibold tracking-tight transition-opacity duration-200",
							!fullName && "text-muted-foreground/50"
						)}
					>
						{fullName || t("create.card.noName")}
					</span>
					<div className='flex items-center gap-2'>
						{values.gender ? (
							<Badge size='sm' variant='secondary' className='font-medium'>
								{t(`gender.${values.gender as "male" | "female" | "other" | "preferNotToSay"}`)}
							</Badge>
						) : null}
						{values.dateOfBirth ? (
							<div className='flex items-center gap-1.5 text-sm font-medium text-muted-foreground'>
								<CalendarIcon className='size-3.5' />
								<span>{values.dateOfBirth}</span>
							</div>
						) : null}
					</div>
				</div>
			</div>

			{hasContactInfo ? (
				<>
					<Separator className='opacity-50' />
					<div className='flex flex-col gap-2'>
						<span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
							{t("create.card.contact")}
						</span>
						<div className='flex flex-col gap-2.5'>
							{values.email ? (
								<div className='flex items-center gap-3 text-sm'>
									<div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/50'>
										<MailIcon className='size-3.5 text-muted-foreground' />
									</div>
									<span className='truncate font-medium'>{values.email}</span>
								</div>
							) : null}
							{values.phoneNumber ? (
								<div className='flex items-center gap-3 text-sm'>
									<div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/50'>
										<PhoneIcon className='size-3.5 text-muted-foreground' />
									</div>
									<span className='font-medium'>{values.phoneNumber}</span>
								</div>
							) : null}
						</div>
					</div>
				</>
			) : null}

			{medicalItems.length > 0 ? (
				<>
					<Separator className='opacity-50' />
					<div className='flex flex-col gap-3'>
						<span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
							{t("create.card.medical")}
						</span>
						<div className='flex flex-col gap-3.5'>
							{medicalItems.map((item) => (
								<div key={item.label} className='flex items-start gap-3 text-sm'>
									<div
										className={cn(
											"flex size-7 shrink-0 items-center justify-center rounded-full",
											item.toneClassName
										)}
									>
										{item.icon}
									</div>
									<div className='flex flex-col gap-0.5 pt-0.5'>
										<span className='text-xs font-medium text-muted-foreground'>{item.label}</span>
										<span className='whitespace-pre-wrap font-medium leading-relaxed'>
											{item.value}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			) : null}

			{values.additionalContext ? (
				<>
					<Separator className='opacity-50' />
					<div className='flex flex-col gap-2'>
						<span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
							{commonT("fields.additionalContext")}
						</span>
						<p className='whitespace-pre-wrap text-sm font-medium leading-relaxed'>
							{values.additionalContext}
						</p>
					</div>
				</>
			) : null}
		</div>
	);
};
