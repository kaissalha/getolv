"use client";

import { CirclePlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { Button } from "@getolv/ui/components/button";
import { Field, FieldControl, FieldLabel } from "@getolv/ui/components/field";
import { Textarea } from "@getolv/ui/components/textarea";

import { SectionLabel } from "./overview-sidebar-card";
import type { PatientClinicalStateFormValues } from "./patient-clinical-state-form";

type DiagnosisNamePrefix = "diagnosis.workingDx" | "diagnosis.differentialDx";

type DiagnosisFieldArraySectionProps = {
	appendLabel: string;
	fields: Array<{ fieldId: string }>;
	namePrefix: DiagnosisNamePrefix;
	onAppend: () => void;
	onRemove: ({ index }: { index: number }) => void;
	sectionLabel: string;
};

type DiagnosisTextareaFieldProps = {
	fieldName: "reasoning" | "evidence" | "missing" | "verifyNext";
	index: number;
	label: string;
	namePrefix: DiagnosisNamePrefix;
	placeholder: string;
};

const DiagnosisTextareaField = ({ fieldName, index, label, namePrefix, placeholder }: DiagnosisTextareaFieldProps) => {
	const form = useFormContext<PatientClinicalStateFormValues>();

	return (
		<Field name={`${namePrefix}.${index}.${fieldName}`}>
			<FieldLabel>{label}</FieldLabel>
			<Textarea
				{...form.register(`${namePrefix}.${index}.${fieldName}`)}
				aria-label={label}
				className='min-h-20'
				placeholder={placeholder}
			/>
		</Field>
	);
};

export const DiagnosisFieldArraySection = ({
	appendLabel,
	fields,
	namePrefix,
	onAppend,
	onRemove,
	sectionLabel,
}: DiagnosisFieldArraySectionProps) => {
	const form = useFormContext<PatientClinicalStateFormValues>();
	const tOverview = useTranslations("dashboard.patients.overview");

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between gap-3'>
				<SectionLabel>{sectionLabel}</SectionLabel>
				<Button type='button' size='xs' variant='outline' onClick={onAppend}>
					<CirclePlusIcon className='size-3.5' />
					{appendLabel}
				</Button>
			</div>
			{fields.length > 0 ? (
				<div className='flex flex-col gap-4'>
					{fields.map((field, index) => (
						<div key={field.fieldId} className='rounded-sm border border-border/80 bg-background/80 p-3'>
							<div className='mb-3 flex items-center justify-between gap-3'>
								<SectionLabel>{tOverview("diagnosisEntryLabel", { number: index + 1 })}</SectionLabel>
								<Button
									type='button'
									size='icon-sm'
									variant='ghost'
									onClick={() => onRemove({ index })}
									aria-label={tOverview("removeDiagnosisEntryAria", { number: index + 1 })}
								>
									<Trash2Icon className='size-3.5' />
								</Button>
							</div>
							<div className='flex flex-col gap-3'>
								<Field name={`${namePrefix}.${index}.name`}>
									<FieldLabel>{tOverview("diagnosisNameLabel")}</FieldLabel>
									<FieldControl
										{...form.register(`${namePrefix}.${index}.name`)}
										aria-label={tOverview("diagnosisNameLabel")}
										placeholder={tOverview("diagnosisNamePlaceholder")}
									/>
								</Field>
								<DiagnosisTextareaField
									index={index}
									label={tOverview("diagnosisReasoningLabel")}
									namePrefix={namePrefix}
									fieldName='reasoning'
									placeholder={tOverview("diagnosisReasoningPlaceholder")}
								/>
								<DiagnosisTextareaField
									index={index}
									label={tOverview("diagnosisEvidenceLabel")}
									namePrefix={namePrefix}
									fieldName='evidence'
									placeholder={tOverview("diagnosisEvidencePlaceholder")}
								/>
								<DiagnosisTextareaField
									index={index}
									label={tOverview("diagnosisMissingLabel")}
									namePrefix={namePrefix}
									fieldName='missing'
									placeholder={tOverview("diagnosisMissingPlaceholder")}
								/>
								<DiagnosisTextareaField
									index={index}
									label={tOverview("diagnosisVerifyNextLabel")}
									namePrefix={namePrefix}
									fieldName='verifyNext'
									placeholder={tOverview("diagnosisVerifyNextPlaceholder")}
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("diagnosisSectionEmpty")}</p>
			)}
		</div>
	);
};
