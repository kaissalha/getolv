"use client";

import { CalendarIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import {
	formatCopyCard,
	formatCopyField,
	joinCopyLines,
	joinCopySections,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import { getFullName, getInitials } from "@/utils/string";
import type { RouterOutput } from "@starter/server";
import { Avatar, AvatarFallback } from "@starter/ui/components/avatar";
import { Badge } from "@starter/ui/components/badge";
import { Button } from "@starter/ui/components/button";
import { Field, FieldControl, FieldError, FieldLabel } from "@starter/ui/components/field";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@starter/ui/components/select";
import { Separator } from "@starter/ui/components/separator";
import { Textarea } from "@starter/ui/components/textarea";
import { cn } from "@starter/ui/lib/utils";

import type { PatientFormValues } from "../../../../patient-form-schema";
import { DetailRow, OverviewSidebarCard, OverviewSidebarCardSkeleton, SectionLabel } from "./overview-sidebar-card";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type PatientDetailsCardProps = {
	formId: string;
	isAnotherCardEditing: boolean;
	isEditing: boolean;
	isSaving: boolean;
	onCancelEditing: () => void;
	onStartEditing: () => void;
	patient: PatientDetails;
};

const formatDateAdded = ({ value }: { value: string }) =>
	new Intl.DateTimeFormat(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));

export const PatientDetailsCardSkeleton = () => <OverviewSidebarCardSkeleton rows={2} />;

export const PatientDetailsCard = ({
	formId,
	isAnotherCardEditing,
	isEditing,
	isSaving,
	onCancelEditing,
	onStartEditing,
	patient,
}: PatientDetailsCardProps) => {
	const form = useFormContext<PatientFormValues>();
	const tOverview = useTranslations("dashboard.patients.overview");
	const tPatients = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");
	const firstName = useWatch({ control: form.control, name: "firstName" });
	const lastName = useWatch({ control: form.control, name: "lastName" });
	const gender = useWatch({ control: form.control, name: "gender" });
	const dateOfBirth = useWatch({ control: form.control, name: "dateOfBirth" });

	const displayGender = isEditing ? gender : patient.gender;
	const displayDateOfBirth = isEditing ? dateOfBirth : patient.dateOfBirth;
	const fullName = getFullName({
		firstName: isEditing ? (firstName ?? "") : patient.firstName,
		lastName: isEditing ? (lastName ?? "") : patient.lastName,
	});
	const initials = getInitials({ name: fullName });
	const getGenderLabel = ({ value }: { value: string | null | undefined }) => {
		switch (value) {
			case "female":
			case "male":
			case "other":
			case "preferNotToSay":
				return tPatients(`gender.${value}`);
			default:
				return value ?? null;
		}
	};
	const genderLabel = getGenderLabel({ value: displayGender });

	const hasContactInfo = patient.email || patient.phoneNumber;
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
			{tOverview("editDetails")}
		</Button>
	);
	const getCopyValue = () => {
		const values = form.getValues();
		const nextFullName = getFullName({
			firstName: isEditing ? (values.firstName ?? "") : patient.firstName,
			lastName: isEditing ? (values.lastName ?? "") : patient.lastName,
		});
		const nextGenderLabel = getGenderLabel({
			value: isEditing ? values.gender : patient.gender,
		});
		const nextEmail = isEditing ? values.email : patient.email;
		const nextPhoneNumber = isEditing ? values.phoneNumber : patient.phoneNumber;
		const nextAdditionalContext = isEditing ? values.additionalContext : patient.additionalContext;
		const contactSection = joinCopyLines({
			sections: [
				formatCopyField({ label: commonT("fields.email"), value: nextEmail }),
				formatCopyField({ label: commonT("fields.phoneNumber"), value: nextPhoneNumber }),
			],
		});

		return formatCopyCard({
			title: tOverview("patientDetailsTitle"),
			sections: [
				joinCopyLines({
					sections: [
						formatCopyField({
							label: commonT("fields.name"),
							value: nextFullName || tPatients("create.card.noName"),
						}),
						formatCopyField({ label: commonT("fields.gender"), value: nextGenderLabel }),
						formatCopyField({
							label: commonT("fields.dateOfBirth"),
							value: isEditing ? values.dateOfBirth : patient.dateOfBirth,
						}),
						formatCopyField({
							label: commonT("fields.dateAdded"),
							value: formatDateAdded({ value: patient.createdAt }),
						}),
					],
				}),
				contactSection
					? joinCopySections({
							sections: [tPatients("create.card.contact"), contactSection],
						})
					: null,
				formatCopyField({
					label: commonT("fields.additionalContext"),
					value: nextAdditionalContext,
				}) ?? tOverview("detailsEmpty"),
			],
		});
	};

	return (
		<OverviewSidebarCard
			actions={actions}
			getCopyValue={getCopyValue}
			icon={<UserIcon className='size-4' />}
			title={tOverview("patientDetailsTitle")}
		>
			<div className='flex flex-col gap-4'>
				<div className='flex items-start gap-3'>
					<Avatar className='size-12 shrink-0 text-base shadow-sm'>
						<AvatarFallback className={cn(fullName ? "bg-primary text-primary-foreground" : "bg-muted")}>
							{initials || <UserIcon className='size-4 text-muted-foreground' />}
						</AvatarFallback>
					</Avatar>
					<div className='flex min-w-0 flex-1 flex-col gap-1'>
						<p className='truncate text-lg font-semibold tracking-tight'>
							{fullName || tPatients("create.card.noName")}
						</p>
						<div className='flex flex-wrap items-center gap-2'>
							{genderLabel ? (
								<Badge size='sm' variant='secondary' className='font-medium'>
									{genderLabel}
								</Badge>
							) : null}
							{displayDateOfBirth ? (
								<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
									<CalendarIcon className='size-3.5' />
									<span>{displayDateOfBirth}</span>
								</div>
							) : null}
						</div>
						<p className='text-xs text-muted-foreground'>
							{commonT("fields.dateAdded")}: {formatDateAdded({ value: patient.createdAt })}
						</p>
					</div>
				</div>

				{!isEditing && hasContactInfo ? (
					<>
						<Separator className='opacity-50' />
						<div className='flex flex-col gap-3'>
							<SectionLabel>{tPatients("create.card.contact")}</SectionLabel>
							<div className='flex flex-col gap-3'>
								{patient.email ? (
									<DetailRow
										icon={<MailIcon className='size-3.5 text-muted-foreground' />}
										label={commonT("fields.email")}
										value={patient.email}
									/>
								) : null}
								{patient.phoneNumber ? (
									<DetailRow
										icon={<PhoneIcon className='size-3.5 text-muted-foreground' />}
										label={commonT("fields.phoneNumber")}
										value={patient.phoneNumber}
									/>
								) : null}
							</div>
						</div>
					</>
				) : null}

				<Separator className='opacity-50' />

				{isEditing ? (
					<div className='flex flex-col gap-4'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<Field name='firstName'>
								<FieldLabel>{commonT("fields.firstName")}</FieldLabel>
								<FieldControl
									{...form.register("firstName")}
									autoComplete='given-name'
									aria-label={commonT("fields.firstName")}
								/>
								{form.formState.errors.firstName ? (
									<FieldError>{form.formState.errors.firstName.message}</FieldError>
								) : null}
							</Field>
							<Field name='lastName'>
								<FieldLabel>{commonT("fields.lastName")}</FieldLabel>
								<FieldControl
									{...form.register("lastName")}
									autoComplete='family-name'
									aria-label={commonT("fields.lastName")}
								/>
								{form.formState.errors.lastName ? (
									<FieldError>{form.formState.errors.lastName.message}</FieldError>
								) : null}
							</Field>
						</div>

						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<Field name='email'>
								<FieldLabel>{commonT("fields.email")}</FieldLabel>
								<FieldControl
									{...form.register("email")}
									autoComplete='email'
									type='email'
									aria-label={commonT("fields.email")}
								/>
								{form.formState.errors.email ? (
									<FieldError>{form.formState.errors.email.message}</FieldError>
								) : null}
							</Field>
							<Field name='phoneNumber'>
								<FieldLabel>{commonT("fields.phoneNumber")}</FieldLabel>
								<FieldControl
									{...form.register("phoneNumber")}
									autoComplete='tel'
									type='tel'
									aria-label={commonT("fields.phoneNumber")}
								/>
							</Field>
						</div>

						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<Field name='dateOfBirth'>
								<FieldLabel>{commonT("fields.dateOfBirth")}</FieldLabel>
								<FieldControl
									{...form.register("dateOfBirth")}
									type='date'
									aria-label={commonT("fields.dateOfBirth")}
								/>
							</Field>
							<Field name='gender'>
								<FieldLabel>{commonT("fields.gender")}</FieldLabel>
								<Select
									value={gender ?? ""}
									onValueChange={(nextGender) =>
										form.setValue("gender", nextGender ?? "", {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
								>
									<SelectTrigger aria-label={commonT("fields.gender")}>
										<SelectValue placeholder={tPatients("placeholders.selectGender")} />
									</SelectTrigger>
									<SelectPopup>
										<SelectItem value='male'>{tPatients("gender.male")}</SelectItem>
										<SelectItem value='female'>{tPatients("gender.female")}</SelectItem>
										<SelectItem value='other'>{tPatients("gender.other")}</SelectItem>
										<SelectItem value='preferNotToSay'>
											{tPatients("gender.preferNotToSay")}
										</SelectItem>
									</SelectPopup>
								</Select>
							</Field>
						</div>

						<Field name='additionalContext'>
							<FieldLabel>{commonT("fields.additionalContext")}</FieldLabel>
							<Textarea
								{...form.register("additionalContext")}
								aria-label={commonT("fields.additionalContext")}
								className='min-h-28'
								placeholder={tPatients("placeholders.addAdditionalContext")}
							/>
							{form.formState.errors.additionalContext ? (
								<FieldError>{form.formState.errors.additionalContext.message}</FieldError>
							) : null}
						</Field>
					</div>
				) : patient.additionalContext ? (
					<div className='flex flex-col gap-2'>
						<SectionLabel>{commonT("fields.additionalContext")}</SectionLabel>
						<p className='whitespace-pre-wrap text-sm font-medium leading-relaxed text-foreground/90'>
							{patient.additionalContext}
						</p>
					</div>
				) : (
					<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("detailsEmpty")}</p>
				)}
			</div>
		</OverviewSidebarCard>
	);
};
