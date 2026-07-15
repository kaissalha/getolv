"use client";

import { useParams } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HistoryIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { MailThreadDetail } from "@/components/mail/mail-thread-detail";
import { MAIL_THREAD_ID_PARAM } from "@/components/mail/mail-url-state";
import { NoteEditor } from "@/components/notes/note-editor";
import { NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import { useRouter } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@getolv/server";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@getolv/ui/components/empty";
import { Skeleton } from "@getolv/ui/components/skeleton";
import { Timeline, TimelineContent, TimelineItem, TimelineMarker } from "@getolv/ui/components/timeline";

import { MedicalProfileCardSkeleton } from "./medical-profile-card";
import { getActivityHref, OverviewActivityItem } from "./overview-activity-item";
import { OverviewSidebar } from "./overview-sidebar";
import { OverviewTreatmentPlanPreview } from "./overview-treatment-plan-preview";
import { PatientDetailsCardSkeleton } from "./patient-details-card";
import { PatientSummaryCard, PatientSummaryCardSkeleton } from "./patient-summary-card";
import { useOverviewTreatmentPlanPreview } from "./use-overview-treatment-plan-preview";

export const OverviewTimelineSkeleton = () => (
	<Timeline>
		{Array.from({ length: 4 }).map((_, index) => (
			<TimelineItem key={index}>
				<TimelineMarker completed={index !== 0} />
				<TimelineContent>
					<div className='flex min-w-0 items-start gap-2'>
						<Skeleton className='h-6 min-w-0 flex-1 rounded-md' />
						<Skeleton className='mt-0.5 h-4 w-4 shrink-0 rounded-sm' />
					</div>
					<Skeleton className='h-4 w-20 rounded-md' />
					<div className='flex min-w-0 w-full flex-col gap-2'>
						<Skeleton className='h-4 w-full rounded-md' />
						<Skeleton className='h-4 w-full rounded-md' />
						<Skeleton className='h-4 w-11/12 max-w-full rounded-md' />
					</div>
				</TimelineContent>
			</TimelineItem>
		))}
	</Timeline>
);

export const OverviewSidebarSkeleton = () => (
	<div className='flex min-w-0 flex-col gap-4'>
		<PatientDetailsCardSkeleton />
		<MedicalProfileCardSkeleton />
	</div>
);

export const OverviewSkeleton = () => (
	<div className='flex w-full flex-col gap-6 px-4 pb-16 pt-4'>
		<div className='grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)] lg:items-start'>
			<div className='flex min-w-0 flex-col gap-6'>
				<PatientSummaryCardSkeleton />
				<OverviewTimelineSkeleton />
			</div>
			<OverviewSidebarSkeleton />
		</div>
	</div>
);

export const Overview = () => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const t = useTranslations("dashboard.patients.overview");
	const [noteId, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);
	const [threadId, setThreadId] = useQueryState(MAIL_THREAD_ID_PARAM, parseAsString);

	const { data: activityFeed, isLoading } = useQuery(trpc.patients.getActivityFeed.queryOptions({ patientId }));
	const { data: patient } = useQuery(trpc.patients.get.queryOptions({ id: patientId }));
	const {
		handleCloseTreatmentPlanPreview,
		handleDownloadTreatmentPlan,
		handlePreviewTreatmentPlan,
		isPreviewOpen,
		pdfUrl,
		previewingSessionId,
	} = useOverviewTreatmentPlanPreview({
		patientId,
	});
	const { data: notesData } = useQuery({
		...trpc.notes.list.queryOptions({
			pageSize: 100,
			resourceId: patientId,
			resourceType: "patient",
		}),
		enabled: Boolean(noteId) || activityFeed?.some((activity) => activity.type === "note"),
	});
	const { data: connections } = useQuery({
		...trpc.mail.listConnections.queryOptions(),
		enabled: Boolean(threadId) || activityFeed?.some((activity) => activity.type === "email"),
	});
	const activeConnection = connections?.find((connection) => connection.status === "connected");
	const patientName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : "";
	const invalidateActivityFeed = () => {
		void queryClient.invalidateQueries({
			queryKey: trpc.patients.getActivityFeed.queryKey({ patientId }),
		});
	};

	const handleOpenActivity = (activity: RouterOutput["patients"]["getActivityFeed"][number]) => {
		switch (activity.type) {
			case "email":
				setNoteId(null);
				setThreadId(activity.threadId);
				return;
			case "note":
				setThreadId(null);
				setNoteId(activity.id);
				return;
			default:
				router.push(getActivityHref({ activity, patientId }));
		}
	};

	const timelineContent = isLoading ? (
		<OverviewTimelineSkeleton />
	) : !activityFeed?.length ? (
		<div className='flex min-w-0 justify-center pt-4'>
			<Empty className='max-w-sm border-none'>
				<EmptyHeader>
					<EmptyMedia variant='icon'>
						<HistoryIcon />
					</EmptyMedia>
					<EmptyTitle>{t("emptyTitle")}</EmptyTitle>
					<EmptyDescription>{t("emptyDescription")}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	) : (
		<Timeline>
			{activityFeed.map((activity, index) => (
				<OverviewActivityItem
					key={`${activity.type}-${activity.id}`}
					activity={activity}
					index={index}
					onOpen={handleOpenActivity}
					onPreviewTreatmentPlan={handlePreviewTreatmentPlan}
					previewingSessionId={previewingSessionId}
				/>
			))}
		</Timeline>
	);

	return (
		<>
			<div className='flex w-full flex-col gap-6 px-4 pb-16 pt-4'>
				<div className='grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)] lg:items-start'>
					<div className='flex min-w-0 flex-col gap-6'>
						{patient ? <PatientSummaryCard patient={patient} /> : <PatientSummaryCardSkeleton />}
						{timelineContent}
					</div>
					<div className='min-w-0'>
						{patient ? (
							<OverviewSidebar key={`${patient.id}:${patient.updatedAt}`} patient={patient} />
						) : (
							<OverviewSidebarSkeleton />
						)}
					</div>
				</div>
			</div>
			<NoteEditor notes={notesData?.data ?? []} onSuccess={invalidateActivityFeed} patientId={patientId} />
			{activeConnection ? (
				<MailThreadDetail connectionId={activeConnection.id} onChange={invalidateActivityFeed} />
			) : null}
			<OverviewTreatmentPlanPreview
				isOpen={isPreviewOpen}
				onClose={handleCloseTreatmentPlanPreview}
				onDownload={handleDownloadTreatmentPlan}
				patientName={patientName}
				pdfUrl={pdfUrl}
			/>
		</>
	);
};
