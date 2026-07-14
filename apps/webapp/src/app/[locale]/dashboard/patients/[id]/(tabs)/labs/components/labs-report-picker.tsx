"use client";

import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@starter/ui/components/dropdown-menu";
import { cn } from "@starter/ui/lib/utils";

export type LabReportListItem = {
	createdAt: string;
	id: string;
	patientSession: { title: string | null } | null;
	reportDate: string | null;
};

export const getLabReportLabel = ({ fallbackLabel, report }: { fallbackLabel: string; report: LabReportListItem }) => {
	if (report.patientSession) {
		return report.patientSession.title || fallbackLabel;
	}

	return format(new Date(report.reportDate ?? report.createdAt), "MMM d, yyyy");
};

type LabsReportPickerProps = {
	currentReportLabel: string;
	labReports: LabReportListItem[];
	latestSelected: boolean;
	reportId: string | null;
	setReportId: (value: string | null) => void;
};

export const LabsReportPicker = ({
	currentReportLabel,
	labReports,
	latestSelected,
	reportId,
	setReportId,
}: LabsReportPickerProps) => {
	const t = useTranslations("dashboard.patients.labs");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					className='group flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out hover:bg-muted/70 data-[state=open]:bg-muted/70'
				>
					<span className='max-w-45 truncate'>{currentReportLabel}</span>
					<ChevronDown className='h-4 w-4 text-muted-foreground transition-transform duration-150 ease-out group-data-[state=open]:rotate-180' />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='max-h-64 w-56 overflow-y-auto'>
				<DropdownMenuItem
					onSelect={() => setReportId(null)}
					className={cn(
						"w-full",
						latestSelected && "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
					)}
				>
					{t("latestResults")}
				</DropdownMenuItem>
				{labReports.length > 0 && <DropdownMenuSeparator />}
				{labReports.map((report) => (
					<DropdownMenuItem
						key={report.id}
						onSelect={() => setReportId(report.id)}
						className={cn(
							"w-full",
							reportId === report.id &&
								"bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
						)}
					>
						<span className='truncate'>
							{getLabReportLabel({
								report,
								fallbackLabel: t("untitledSession"),
							})}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
