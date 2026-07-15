"use client";

import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Header } from "@/app/[locale]/dashboard/components/layout/header/header";
import { useRouter } from "@/i18n/navigation";
import { useTRPC } from "@/lib/trpc";
import { toast } from "@getolv/ui/components/sonner";

import {
	getEmptyPatientFormValues,
	getPatientMutationInput,
	patientFormSchema,
	type PatientFormValues,
} from "../patient-form-schema";
import { CreatePatientForm } from "./components/create-patient-form";
import { PatientPreview } from "./components/patient-preview";

export default function CreatePatientPage() {
	const router = useRouter();
	const t = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");
	const trpc = useTRPC();
	const [step, setStep] = useState(1);

	const form = useForm<PatientFormValues>({
		resolver: zodResolver(patientFormSchema({ commonT })),
		defaultValues: getEmptyPatientFormValues(),
		mode: "onChange",
	});

	const createPatientMutation = useMutation(
		trpc.patients.create.mutationOptions({
			onSuccess: () => {
				toast.success(t("actions.createPatient"));
				router.push("/dashboard/patients");
			},
			onError: (error) => {
				if (error.data?.code === "CONFLICT") {
					form.setError("email", { message: error.message });
					setStep(1);
					return;
				}

				toast.error(commonT("errors.somethingWentWrong"));
			},
		})
	);

	const handleSubmit = useCallback(
		async (data: PatientFormValues) => {
			await createPatientMutation.mutateAsync(getPatientMutationInput({ values: data }));
		},
		[createPatientMutation]
	);

	return (
		<div className='flex h-full min-h-[calc(100vh-(--spacing(14)))] flex-col'>
			<Header item={{ labelTx: "newPatient", icon: UserPlusIcon }} className='border-b' />

			<div className='flex flex-1 flex-col lg:flex-row'>
				<CreatePatientForm
					form={form}
					isSubmitting={createPatientMutation.isPending}
					onSubmit={handleSubmit}
					onCancel={() => router.push("/dashboard/patients")}
					setStep={setStep}
					step={step}
				/>

				<aside className='hidden border-s bg-olive-50/50 p-10 dark:bg-olive-950/20 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center xl:w-[45%]'>
					<div className='w-full max-w-md'>
						<PatientPreview control={form.control} />
					</div>
				</aside>
			</div>
		</div>
	);
}
