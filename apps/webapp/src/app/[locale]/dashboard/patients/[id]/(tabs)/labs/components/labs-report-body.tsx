"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@getolv/ui/components/empty";

import { LabsOverviewSkeleton } from "./labs-overview-skeleton";
import { type LabReportListItem, getLabReportLabel } from "./labs-report-picker";
import { LabsReportSummary } from "./labs-report-summary";
import { LabsResultsGrid } from "./labs-results-grid";

type LabsReportBodyProps = {
	editedSummary: string;
	handleEditRanges: (labTestId: string) => void;
	isEditingSummary: boolean;
	labReports: LabReportListItem[];
	latestSelected: boolean;
	reportId: string | null;
	selectedReportId: string;
	setEditedSummary: (value: string) => void;
	setReportId: (value: string | null) => void;
	startEditingSummary: (summary: string) => void;
	stopEditingSummary: () => void;
	updateSummaryMutation: {
		isPending: boolean;
		mutate: (input: { labReportId: string; summary: string }) => void;
	};
};

export const LabsReportBody = ({
	editedSummary,
	handleEditRanges,
	isEditingSummary,
	labReports,
	latestSelected,
	reportId,
	selectedReportId,
	setEditedSummary,
	setReportId,
	startEditingSummary,
	stopEditingSummary,
	updateSummaryMutation,
}: LabsReportBodyProps) => {
	const trpc = useTRPC();
	const t = useTranslations("dashboard.patients.labs");

	const { data: reportWithResults, isLoading } = useQuery(
		trpc.labs.getLabReportWithResults.queryOptions({ labReportId: selectedReportId })
	);

	if (isLoading) {
		return <LabsOverviewSkeleton />;
	}

	if (!reportWithResults) {
		return null;
	}

	const labResults = reportWithResults.results ?? [];

	if (!labResults.length) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant='icon'>
						<FileText />
					</EmptyMedia>
					<EmptyTitle>{t("emptyTitle")}</EmptyTitle>
					<EmptyDescription>{t("emptyDescription")}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const totalCritical = labResults.filter((labResult) => labResult.status === "critical").length;
	const totalSuboptimal = labResults.filter((labResult) => labResult.status === "suboptimal").length;
	const totalOptimal = labResults.filter((labResult) => labResult.status === "optimal").length;
	const selectedReport = labReports.find((labReport) => labReport.id === selectedReportId);
	const currentReportLabel = latestSelected
		? t("latestResults")
		: selectedReport
			? getLabReportLabel({ report: selectedReport, fallbackLabel: t("untitledSession") })
			: "";

	return (
		<div className='min-w-0 flex flex-col gap-6 px-4 pb-52 pt-4'>
			<LabsReportSummary
				canEditSummary={Boolean(reportWithResults.report?.id)}
				currentReportLabel={currentReportLabel}
				editedSummary={editedSummary}
				isEditingSummary={isEditingSummary}
				labReports={labReports}
				latestSelected={latestSelected}
				onCancelEditingSummary={stopEditingSummary}
				onSaveSummary={() => {
					if (!reportWithResults.report?.id) {
						return;
					}

					updateSummaryMutation.mutate({
						labReportId: reportWithResults.report.id,
						summary: editedSummary,
					});
				}}
				onStartEditingSummary={() => startEditingSummary(reportWithResults.report?.summary ?? "")}
				reportId={reportId}
				reportSummary={reportWithResults.report?.summary}
				setEditedSummary={setEditedSummary}
				setReportId={setReportId}
				totalCritical={totalCritical}
				totalOptimal={totalOptimal}
				totalSuboptimal={totalSuboptimal}
				updateSummaryPending={updateSummaryMutation.isPending}
			/>

			<LabsResultsGrid labResults={labResults} onEditRanges={handleEditRanges} />
		</div>
	);
};
