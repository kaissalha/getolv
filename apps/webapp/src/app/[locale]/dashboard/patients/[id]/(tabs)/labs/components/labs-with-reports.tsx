"use client";

import { LabRangeOverrides } from "./lab-range-overrides";
import { LabsReportBody } from "./labs-report-body";
import { type LabReportListItem } from "./labs-report-picker";
import { useLabsReportController } from "./use-labs-report-controller";

type LabsWithReportsProps = {
	labReports: LabReportListItem[];
};

export const LabsWithReports = ({ labReports }: LabsWithReportsProps) => {
	const {
		editedSummary,
		editingLabTestId,
		handleEditRanges,
		handleRangeOverridesOpenChange,
		isEditingSummary,
		latestSelected,
		rangeOverridesOpen,
		reportId,
		selectedReportId,
		setEditedSummary,
		setReportId,
		startEditingSummary,
		stopEditingSummary,
		updateSummaryMutation,
	} = useLabsReportController({ labReports });

	if (!selectedReportId) {
		return null;
	}

	return (
		<>
			<LabsReportBody
				editedSummary={editedSummary}
				handleEditRanges={handleEditRanges}
				isEditingSummary={isEditingSummary}
				labReports={labReports}
				latestSelected={latestSelected}
				reportId={reportId}
				selectedReportId={selectedReportId}
				setEditedSummary={setEditedSummary}
				setReportId={setReportId}
				startEditingSummary={startEditingSummary}
				stopEditingSummary={stopEditingSummary}
				updateSummaryMutation={updateSummaryMutation}
			/>

			<LabRangeOverrides
				open={rangeOverridesOpen}
				onOpenChange={handleRangeOverridesOpenChange}
				initialLabTestId={editingLabTestId}
			/>
		</>
	);
};
