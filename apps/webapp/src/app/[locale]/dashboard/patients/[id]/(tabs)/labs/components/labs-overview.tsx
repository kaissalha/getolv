"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "@/lib/trpc";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@getolv/ui/components/empty";

import { LabsOverviewSkeleton } from "./labs-overview-skeleton";
import { LabsWithReports } from "./labs-with-reports";

export const LabsOverview = () => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const t = useTranslations("dashboard.patients.labs");
	const { data: labReports, isLoading } = useQuery(trpc.labs.getPatientLabReports.queryOptions({ patientId }));

	if (isLoading) {
		return <LabsOverviewSkeleton />;
	}

	if (!labReports?.length) {
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

	return <LabsWithReports labReports={labReports} />;
};
