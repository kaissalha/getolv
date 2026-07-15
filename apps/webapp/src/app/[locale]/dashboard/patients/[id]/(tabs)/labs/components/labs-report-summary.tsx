"use client";

import { Check, Pencil, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@getolv/ui/components/badge";
import { Button } from "@getolv/ui/components/button";
import {
	Frame,
	FrameFooter,
	FrameHeader,
	FrameHeading,
	FrameIcon,
	FramePanel,
	FrameTitle,
} from "@getolv/ui/components/frame";
import { Textarea } from "@getolv/ui/components/textarea";

import { type LabReportListItem, LabsReportPicker } from "./labs-report-picker";

type LabsReportSummaryProps = {
	canEditSummary: boolean;
	currentReportLabel: string;
	editedSummary: string;
	isEditingSummary: boolean;
	labReports: LabReportListItem[];
	latestSelected: boolean;
	onCancelEditingSummary: () => void;
	onSaveSummary: () => void;
	onStartEditingSummary: () => void;
	reportId: string | null;
	reportSummary: string | null | undefined;
	setEditedSummary: (value: string) => void;
	setReportId: (value: string | null) => void;
	totalCritical: number;
	totalOptimal: number;
	totalSuboptimal: number;
	updateSummaryPending: boolean;
};

export const LabsReportSummary = ({
	canEditSummary,
	currentReportLabel,
	editedSummary,
	isEditingSummary,
	labReports,
	latestSelected,
	onCancelEditingSummary,
	onSaveSummary,
	onStartEditingSummary,
	reportId,
	reportSummary,
	setEditedSummary,
	setReportId,
	totalCritical,
	totalOptimal,
	totalSuboptimal,
	updateSummaryPending,
}: LabsReportSummaryProps) => {
	const t = useTranslations("dashboard.patients.labs");
	const tCommon = useTranslations("common");

	return (
		<Frame>
			<FrameHeader className='flex-row items-center justify-between gap-4'>
				<FrameHeading>
					<FrameIcon>
						<Sparkles className='h-4 w-4' />
					</FrameIcon>
					<FrameTitle>{t("summaryTitle")}</FrameTitle>
				</FrameHeading>

				<LabsReportPicker
					currentReportLabel={currentReportLabel}
					labReports={labReports}
					latestSelected={latestSelected}
					reportId={reportId}
					setReportId={setReportId}
				/>
			</FrameHeader>

			<FramePanel>
				{isEditingSummary ? (
					<div className='flex flex-col gap-3'>
						<Textarea
							value={editedSummary}
							onChange={(event) => setEditedSummary(event.target.value)}
							rows={5}
							className='resize-none text-sm'
							placeholder={t("summaryPlaceholder")}
						/>
						<div className='flex items-center justify-end gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={onCancelEditingSummary}
								disabled={updateSummaryPending}
							>
								<X className='me-1.5 h-4 w-4' />
								{tCommon("cancel")}
							</Button>
							<Button size='sm' onClick={onSaveSummary} disabled={updateSummaryPending}>
								<Check className='me-1.5 h-4 w-4' />
								{tCommon("save")}
							</Button>
						</div>
					</div>
				) : (
					<div className='group relative'>
						<p className='text-sm leading-relaxed'>{reportSummary || t("summaryPlaceholder")}</p>
						{canEditSummary && (
							<Button
								variant='ghost'
								size='icon-sm'
								className='absolute -top-1 inset-e-0 opacity-0 transition-opacity group-hover:opacity-100'
								onClick={onStartEditingSummary}
								title={t("edit")}
								aria-label={t("edit")}
							>
								<Pencil className='h-3.5 w-3.5' />
							</Button>
						)}
					</div>
				)}
			</FramePanel>

			<FrameFooter>
				<div className='flex flex-wrap items-center gap-3'>
					{totalCritical > 0 && (
						<Badge variant='critical' size='sm'>
							{t("critical", { count: totalCritical })}
						</Badge>
					)}
					{totalSuboptimal > 0 && (
						<Badge variant='suboptimal' size='sm'>
							{t("suboptimal", { count: totalSuboptimal })}
						</Badge>
					)}
					{totalOptimal > 0 && (
						<Badge variant='optimal' size='sm'>
							{t("optimal", { count: totalOptimal })}
						</Badge>
					)}
				</div>
			</FrameFooter>
		</Frame>
	);
};
