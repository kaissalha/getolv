"use client";

import { StethoscopeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
	formatCopyCard,
	formatDiagnosisEntryForCopy,
	joinCopySections,
} from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";
import type { RouterOutput } from "@getolv/server";
import { Button } from "@getolv/ui/components/button";

import { OverviewSidebarCard } from "./overview-sidebar-card";
import type { PatientClinicalStateFormValues } from "./patient-clinical-state-form";
import { DiagnosisFieldArraySection } from "./patient-diagnosis-form-section";
import { DiagnosisSummaryRow } from "./patient-diagnosis-summary-row";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;
type DiagnosisEntries = PatientDetails["diagnosis"]["workingDx"];

type PatientDiagnosisCardProps = {
	appendDifferentialDiagnosis: () => void;
	appendWorkingDiagnosis: () => void;
	differentialDiagnosisFields: Array<{ fieldId: string }>;
	formId: string;
	isAnotherCardEditing: boolean;
	isEditing: boolean;
	isSaving: boolean;
	onCancelEditing: () => void;
	onRemoveDifferentialDiagnosis: ({ index }: { index: number }) => void;
	onRemoveWorkingDiagnosis: ({ index }: { index: number }) => void;
	onStartEditing: () => void;
	patient: PatientDetails;
	workingDiagnosisFields: Array<{ fieldId: string }>;
};

export const PatientDiagnosisCard = ({
	appendDifferentialDiagnosis,
	appendWorkingDiagnosis,
	differentialDiagnosisFields,
	formId,
	isAnotherCardEditing,
	isEditing,
	isSaving,
	onCancelEditing,
	onRemoveDifferentialDiagnosis,
	onRemoveWorkingDiagnosis,
	onStartEditing,
	patient,
	workingDiagnosisFields,
}: PatientDiagnosisCardProps) => {
	const form = useFormContext<PatientClinicalStateFormValues>();
	const tOverview = useTranslations("dashboard.patients.overview");
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
			{tOverview("editDiagnosis")}
		</Button>
	);
	const getCopyValue = () => {
		const values = form.getValues();
		const labels = {
			evidence: tOverview("diagnosisEvidenceLabel"),
			missing: tOverview("diagnosisMissingLabel"),
			reasoning: tOverview("diagnosisReasoningLabel"),
			verifyNext: tOverview("diagnosisVerifyNextLabel"),
		};
		const formatEntries = (entries: DiagnosisEntries) =>
			entries.reduce<string[]>((items, entry) => {
				const formattedEntry = formatDiagnosisEntryForCopy({
					entry,
					labels,
				});

				if (formattedEntry) {
					items.push(formattedEntry);
				}

				return items;
			}, []);
		const workingEntries = formatEntries(isEditing ? values.diagnosis.workingDx : patient.diagnosis.workingDx);
		const differentialEntries = formatEntries(
			isEditing ? values.diagnosis.differentialDx : patient.diagnosis.differentialDx
		);

		return formatCopyCard({
			title: tOverview("diagnosisTitle"),
			sections: [
				workingEntries.length > 0
					? joinCopySections({
							sections: [tOverview("workingDiagnosisTitle"), workingEntries.join("\n")],
						})
					: null,
				differentialEntries.length > 0
					? joinCopySections({
							sections: [tOverview("differentialDiagnosisTitle"), differentialEntries.join("\n")],
						})
					: null,
				workingEntries.length === 0 && differentialEntries.length === 0 ? tOverview("diagnosisEmpty") : null,
			],
		});
	};

	return (
		<OverviewSidebarCard
			actions={actions}
			getCopyValue={getCopyValue}
			icon={<StethoscopeIcon className='size-4' />}
			title={tOverview("diagnosisTitle")}
		>
			{isEditing ? (
				<div className='flex flex-col gap-5'>
					<DiagnosisFieldArraySection
						appendLabel={tOverview("addWorkingDiagnosis")}
						fields={workingDiagnosisFields}
						namePrefix='diagnosis.workingDx'
						onAppend={appendWorkingDiagnosis}
						onRemove={onRemoveWorkingDiagnosis}
						sectionLabel={tOverview("workingDiagnosisTitle")}
					/>
					<DiagnosisFieldArraySection
						appendLabel={tOverview("addDifferentialDiagnosis")}
						fields={differentialDiagnosisFields}
						namePrefix='diagnosis.differentialDx'
						onAppend={appendDifferentialDiagnosis}
						onRemove={onRemoveDifferentialDiagnosis}
						sectionLabel={tOverview("differentialDiagnosisTitle")}
					/>
				</div>
			) : patient.diagnosis.workingDx.length > 0 || patient.diagnosis.differentialDx.length > 0 ? (
				<div className='flex flex-col gap-3'>
					{patient.diagnosis.workingDx.map((entry) => (
						<DiagnosisSummaryRow
							key={`working-${entry.name}`}
							entry={entry}
							label={tOverview("workingDiagnosisBadge")}
							tone='working'
						/>
					))}
					{patient.diagnosis.differentialDx.map((entry) => (
						<DiagnosisSummaryRow
							key={`differential-${entry.name}`}
							entry={entry}
							label={tOverview("differentialDiagnosisBadge")}
							tone='differential'
						/>
					))}
				</div>
			) : (
				<p className='text-sm leading-relaxed text-muted-foreground'>{tOverview("diagnosisEmpty")}</p>
			)}
		</OverviewSidebarCard>
	);
};
