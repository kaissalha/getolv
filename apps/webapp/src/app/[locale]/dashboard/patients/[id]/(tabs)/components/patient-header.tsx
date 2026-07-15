"use client";

import { useCallback, useMemo, useState } from "react";

import { useParams, usePathname } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRightIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { Header } from "@/app/[locale]/dashboard/components/layout/header/header";
import { NEW_NOTE_ID, NOTE_ID_SEARCH_PARAM } from "@/components/notes/notes-url-state";
import {
	ActiveSessionConflictDetails,
	getPatientSessionHref,
} from "@/components/patient-sessions/active-session-conflict-details";
import { useRouter } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@getolv/ui/components/alert-dialog";
import { Button } from "@getolv/ui/components/button";
import { toast } from "@getolv/ui/components/sonner";

import { LabsHeaderActions } from "../labs/components/labs-header-actions";
import { WorkoutHeaderActions } from "../workout/components/workout-header-actions";
import { PatientNotesTabActions } from "./patient-notes-tab-actions";

export const PatientHeader = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const pathname = usePathname();
	const tCommon = useTranslations("common");
	const tPatients = useTranslations("dashboard.patients");
	const [, setNoteId] = useQueryState(NOTE_ID_SEARCH_PARAM, parseAsString);
	const [isActiveSessionAlertOpen, setIsActiveSessionAlertOpen] = useState(false);

	const currentTab = useMemo(() => {
		if (pathname.endsWith("/notes")) return "notes";
		if (pathname.endsWith("/labs")) return "labs";
		if (pathname.endsWith("/workout")) return "workout";
		return null;
	}, [pathname]);

	const { data: patient } = useQuery(
		trpc.patients.get.queryOptions({
			id,
		})
	);
	const { data: activeSession } = useQuery(trpc.patientSessions.getActiveSession.queryOptions());
	const sessionTitle = patient ? `Session with ${patient.firstName} ${patient.lastName}` : undefined;

	const createSessionMutation = useMutation(
		trpc.patientSessions.createPatientSession.mutationOptions({
			onError: (error) => {
				if (error.data?.code === "CONFLICT") {
					void queryClient.invalidateQueries({ queryKey: trpc.patientSessions.getActiveSession.queryKey() });
					setIsActiveSessionAlertOpen(true);
					return;
				}

				toast.error(tCommon("errors.somethingWentWrong"));
			},
			onSuccess: (data) => {
				setIsActiveSessionAlertOpen(false);
				void queryClient.invalidateQueries({ queryKey: trpc.patientSessions.getActiveSession.queryKey() });
				router.push(`/dashboard/patients/${id}/session/${data.patientSession.id}`);
			},
		})
	);

	const startNewSession = useCallback(
		({ endExisting = false }: { endExisting?: boolean } = {}) => {
			createSessionMutation.mutate({
				endExisting,
				patientId: id,
				title: sessionTitle,
			});
		},
		[createSessionMutation, id, sessionTitle]
	);

	const handleNewSession = useCallback(() => {
		if (activeSession) {
			setIsActiveSessionAlertOpen(true);
			return;
		}

		startNewSession();
	}, [activeSession, startNewSession]);

	const handleEndPreviousAndStartNewSession = useCallback(() => {
		startNewSession({ endExisting: true });
	}, [startNewSession]);

	const handleNewNote = useCallback(() => {
		setNoteId(NEW_NOTE_ID);
	}, [setNoteId]);

	const actions = useMemo(() => {
		switch (currentTab) {
			case "notes":
				return <PatientNotesTabActions onNewNote={handleNewNote} />;
			case "labs":
				return <LabsHeaderActions />;
			case "workout":
				return <WorkoutHeaderActions />;
			default:
				return (
					<Button onClick={handleNewSession} disabled={createSessionMutation.isPending} size='sm'>
						<PlusIcon />
						{createSessionMutation.isPending
							? tCommon("actions.creating")
							: tPatients("actions.newSession")}
					</Button>
				);
		}
	}, [createSessionMutation.isPending, currentTab, handleNewNote, handleNewSession, tCommon, tPatients]);

	const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";

	return (
		<>
			<Header item={{ label: patientName }} actions={actions} className='relative' />
			<AlertDialog open={isActiveSessionAlertOpen} onOpenChange={setIsActiveSessionAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{tPatients("actions.activeSessionTitle")}</AlertDialogTitle>
						<AlertDialogDescription>{tPatients("actions.activeSessionDescription")}</AlertDialogDescription>
						<ActiveSessionConflictDetails activeSession={activeSession ?? null} />
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={
								<Button variant='outline' disabled={createSessionMutation.isPending}>
									{tCommon("cancel")}
								</Button>
							}
						/>
						{activeSession && (
							<Button
								variant='outline'
								disabled={createSessionMutation.isPending}
								onClick={() => {
									setIsActiveSessionAlertOpen(false);
									router.push(
										getPatientSessionHref({
											patientId: activeSession.patientId,
											sessionId: activeSession.id,
										})
									);
								}}
							>
								<ArrowUpRightIcon className='size-4' />
								{tPatients("actions.goToActiveSession")}
							</Button>
						)}
						<Button
							onClick={handleEndPreviousAndStartNewSession}
							disabled={createSessionMutation.isPending}
						>
							{tPatients("actions.endPreviousSession")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
