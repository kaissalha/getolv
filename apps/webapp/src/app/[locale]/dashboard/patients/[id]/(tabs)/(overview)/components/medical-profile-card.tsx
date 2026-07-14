"use client";

import { DnaIcon, HeartPulseIcon, PillIcon, ShieldAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
	formatCopyCard,
	formatCopyField,
	joinCopyLines,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import type { RouterOutput } from "@starter/server";
import { Button } from "@starter/ui/components/button";
import { Field, FieldError, FieldLabel } from "@starter/ui/components/field";
import { Textarea } from "@starter/ui/components/textarea";

import type { PatientFormValues } from "../../../../patient-form-schema";
import { DetailRow, OverviewSidebarCard, OverviewSidebarCardSkeleton } from "./overview-sidebar-card";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

type MedicalProfileCardProps = {
	formId: string;
	isAnotherCardEditing: boolean;
	isEditing: boolean;
	isSaving: boolean;
	onCancelEditing: () => void;
	onStartEditing: () => void;
	patient: PatientDetails;
};

export const MedicalProfileCardSkeleton = () => <OverviewSidebarCardSkeleton rows={4} />;

export const MedicalProfileCard = ({
	formId,
	isAnotherCardEditing,
	isEditing,
	isSaving,
	onCancelEditing,
	onStartEditing,
	patient,
}: MedicalProfileCardProps) => {
	const form = useFormContext<PatientFormValues>();
	const tOverview = useTranslations("dashboard.patients.overview");
	const tPatients = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");

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
			{tOverview("editMedicalProfile")}
		</Button>
	);
	const getCopyValue = () => {
		const values = form.getValues();
		const medicalProfile = joinCopyLines({
			sections: [
				formatCopyField({
					label: commonT("fields.allergies"),
					value: isEditing ? values.allergies : patient.allergies,
				}),
				formatCopyField({
					label: commonT("fields.currentMedications"),
					value: isEditing ? values.currentMedications : patient.currentMedications,
				}),
				formatCopyField({
					label: commonT("fields.pastMedicalHistory"),
					value: isEditing ? values.pastMedicalHistory : patient.pastMedicalHistory,
				}),
				formatCopyField({
					label: commonT("fields.familyMedicalHistory"),
					value: isEditing ? values.familyMedicalHistory : patient.familyMedicalHistory,
				}),
			],
		});

		return formatCopyCard({
			title: tOverview("medicalProfileTitle"),
			sections: [medicalProfile || tOverview("medicalProfileEmpty")],
		});
	};

	return (
		<OverviewSidebarCard
			actions={actions}
			getCopyValue={getCopyValue}
			icon={<HeartPulseIcon className='size-4' />}
			title={tOverview("medicalProfileTitle")}
		>
			{isEditing ? (
				<div className='flex flex-col gap-4'>
					<Field name='allergies'>
						<FieldLabel>{commonT("fields.allergies")}</FieldLabel>
						<Textarea
							{...form.register("allergies")}
							aria-label={commonT("fields.allergies")}
							className='min-h-24'
							placeholder={tPatients("placeholders.addAllergies")}
						/>
						{form.formState.errors.allergies ? (
							<FieldError>{form.formState.errors.allergies.message}</FieldError>
						) : null}
					</Field>
					<Field name='currentMedications'>
						<FieldLabel>{commonT("fields.currentMedications")}</FieldLabel>
						<Textarea
							{...form.register("currentMedications")}
							aria-label={commonT("fields.currentMedications")}
							className='min-h-24'
							placeholder={tPatients("placeholders.addCurrentMedications")}
						/>
						{form.formState.errors.currentMedications ? (
							<FieldError>{form.formState.errors.currentMedications.message}</FieldError>
						) : null}
					</Field>
					<Field name='pastMedicalHistory'>
						<FieldLabel>{commonT("fields.pastMedicalHistory")}</FieldLabel>
						<Textarea
							{...form.register("pastMedicalHistory")}
							aria-label={commonT("fields.pastMedicalHistory")}
							className='min-h-28'
							placeholder={tPatients("placeholders.addPastMedicalHistory")}
						/>
						{form.formState.errors.pastMedicalHistory ? (
							<FieldError>{form.formState.errors.pastMedicalHistory.message}</FieldError>
						) : null}
					</Field>
					<Field name='familyMedicalHistory'>
						<FieldLabel>{commonT("fields.familyMedicalHistory")}</FieldLabel>
						<Textarea
							{...form.register("familyMedicalHistory")}
							aria-label={commonT("fields.familyMedicalHistory")}
							className='min-h-28'
							placeholder={tPatients("placeholders.addFamilyMedicalHistory")}
						/>
						{form.formState.errors.familyMedicalHistory ? (
							<FieldError>{form.formState.errors.familyMedicalHistory.message}</FieldError>
						) : null}
					</Field>
				</div>
			) : medicalItems.length > 0 ? (
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
				<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("medicalProfileEmpty")}</p>
			)}
		</OverviewSidebarCard>
	);
};
