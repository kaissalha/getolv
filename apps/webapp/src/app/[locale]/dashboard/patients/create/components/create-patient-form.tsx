"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Button } from "@getolv/ui/components/button";
import { Field, FieldControl, FieldError, FieldLabel } from "@getolv/ui/components/field";
import { Form } from "@getolv/ui/components/form";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@getolv/ui/components/select";
import { Textarea } from "@getolv/ui/components/textarea";
import { cn } from "@getolv/ui/lib/utils";

import { ADDITIONAL_CONTEXT_MAX, type PatientFormValues } from "../../patient-form-schema";

type CreatePatientFormProps = {
	form: UseFormReturn<PatientFormValues>;
	isSubmitting: boolean;
	onCancel: () => void;
	onSubmit: (data: PatientFormValues) => Promise<void>;
	setStep: (value: number | ((currentStep: number) => number)) => void;
	step: number;
};

type StepConfig = {
	id: number;
	label: string;
	subtitle: string;
};

const BACK_LABEL = "Back";
const CONTINUE_LABEL = "Continue";

const STEP_FIELD_NAMES: Record<number, (keyof PatientFormValues)[]> = {
	1: ["firstName", "lastName", "email", "phoneNumber", "dateOfBirth", "gender"],
	2: ["allergies", "currentMedications", "pastMedicalHistory", "familyMedicalHistory"],
	3: [],
};

export const CreatePatientForm = ({
	form,
	isSubmitting,
	onCancel,
	onSubmit,
	setStep,
	step,
}: CreatePatientFormProps) => {
	const t = useTranslations("dashboard.patients");
	const commonT = useTranslations("common");
	const additionalContextValue = useWatch({ control: form.control, name: "additionalContext" });

	const steps: StepConfig[] = [
		{
			id: 1,
			label: t("create.sections.personalInfo"),
			subtitle: t("create.subtitle"),
		},
		{
			id: 2,
			label: t("create.sections.medicalInfo"),
			subtitle: t("create.medicalSubtitle"),
		},
		{
			id: 3,
			label: t("create.sections.additionalInfo"),
			subtitle: t("create.additionalSubtitle"),
		},
	];

	const nextStep = async () => {
		const isValid = await form.trigger(STEP_FIELD_NAMES[step] ?? []);
		if (isValid) {
			setStep((currentStep) => Math.min(steps.length, currentStep + 1));
		}
	};

	const previousStep = () => {
		setStep((currentStep) => Math.max(1, currentStep - 1));
	};

	return (
		<div className='flex w-full flex-col items-center justify-center p-6 sm:p-10 lg:w-1/2 xl:w-[55%] 2xl:px-20'>
			<div className='w-full max-w-lg'>
				<div className='mb-10 flex flex-col gap-3'>
					<div className='flex w-48 gap-2'>
						{steps.map((currentStep) => (
							<div
								key={currentStep.id}
								className={cn(
									"h-1.5 flex-1 rounded-full transition-colors duration-300",
									step >= currentStep.id ? "bg-primary" : "bg-muted"
								)}
							/>
						))}
					</div>
					<div className='flex flex-col gap-1'>
						<h2 className='text-3xl font-semibold tracking-tight'>{steps[step - 1]?.label}</h2>
						<p className='text-base text-muted-foreground'>{steps[step - 1]?.subtitle}</p>
					</div>
				</div>

				<Form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8'>
					<div className={cn("flex flex-col gap-5", step !== 1 && "hidden")}>
						<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
							<Field name='firstName'>
								<FieldLabel>{commonT("fields.firstName")}</FieldLabel>
								<FieldControl
									{...form.register("firstName")}
									type='text'
									autoComplete='given-name'
									placeholder={t("placeholders.addFirstName")}
									aria-label={commonT("fields.firstName")}
								/>
								{form.formState.errors.firstName && (
									<FieldError>{form.formState.errors.firstName.message}</FieldError>
								)}
							</Field>

							<Field name='lastName'>
								<FieldLabel>{commonT("fields.lastName")}</FieldLabel>
								<FieldControl
									{...form.register("lastName")}
									type='text'
									autoComplete='family-name'
									placeholder={t("placeholders.addLastName")}
									aria-label={commonT("fields.lastName")}
								/>
								{form.formState.errors.lastName && (
									<FieldError>{form.formState.errors.lastName.message}</FieldError>
								)}
							</Field>
						</div>

						<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
							<Field name='dateOfBirth'>
								<FieldLabel>{commonT("fields.dateOfBirth")}</FieldLabel>
								<FieldControl
									{...form.register("dateOfBirth")}
									type='date'
									placeholder={t("placeholders.addDateOfBirth")}
									aria-label={commonT("fields.dateOfBirth")}
								/>
							</Field>

							<Field name='gender'>
								<FieldLabel>{commonT("fields.gender")}</FieldLabel>
								<Select
									value={form.watch("gender") || ""}
									onValueChange={(gender) => form.setValue("gender", gender ?? "")}
								>
									<SelectTrigger aria-label={commonT("fields.gender")}>
										<SelectValue placeholder={t("placeholders.selectGender")} />
									</SelectTrigger>
									<SelectPopup>
										<SelectItem value='male'>{t("gender.male")}</SelectItem>
										<SelectItem value='female'>{t("gender.female")}</SelectItem>
										<SelectItem value='other'>{t("gender.other")}</SelectItem>
										<SelectItem value='preferNotToSay'>{t("gender.preferNotToSay")}</SelectItem>
									</SelectPopup>
								</Select>
							</Field>
						</div>

						<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
							<Field name='email'>
								<FieldLabel>{commonT("fields.email")}</FieldLabel>
								<FieldControl
									{...form.register("email")}
									type='email'
									autoComplete='email'
									placeholder={t("placeholders.addEmail")}
									aria-label={commonT("fields.email")}
								/>
								{form.formState.errors.email && (
									<FieldError>{form.formState.errors.email.message}</FieldError>
								)}
							</Field>

							<Field name='phoneNumber'>
								<FieldLabel>{commonT("fields.phoneNumber")}</FieldLabel>
								<FieldControl
									{...form.register("phoneNumber")}
									type='tel'
									autoComplete='tel'
									placeholder={t("placeholders.addPhoneNumber")}
									aria-label={commonT("fields.phoneNumber")}
								/>
							</Field>
						</div>
					</div>

					<div className={cn("flex flex-col gap-5", step !== 2 && "hidden")}>
						<Field name='allergies'>
							<FieldLabel>{commonT("fields.allergies")}</FieldLabel>
							<Textarea
								{...form.register("allergies")}
								placeholder={t("placeholders.addAllergies")}
								aria-label={commonT("fields.allergies")}
							/>
						</Field>

						<Field name='currentMedications'>
							<FieldLabel>{commonT("fields.currentMedications")}</FieldLabel>
							<Textarea
								{...form.register("currentMedications")}
								placeholder={t("placeholders.addCurrentMedications")}
								aria-label={commonT("fields.currentMedications")}
							/>
						</Field>

						<Field name='pastMedicalHistory'>
							<FieldLabel>{commonT("fields.pastMedicalHistory")}</FieldLabel>
							<Textarea
								{...form.register("pastMedicalHistory")}
								placeholder={t("placeholders.addPastMedicalHistory")}
								aria-label={commonT("fields.pastMedicalHistory")}
							/>
						</Field>

						<Field name='familyMedicalHistory'>
							<FieldLabel>{commonT("fields.familyMedicalHistory")}</FieldLabel>
							<Textarea
								{...form.register("familyMedicalHistory")}
								placeholder={t("placeholders.addFamilyMedicalHistory")}
								aria-label={commonT("fields.familyMedicalHistory")}
							/>
						</Field>
					</div>

					<div className={cn("flex flex-col gap-5", step !== 3 && "hidden")}>
						<Field name='additionalContext'>
							<FieldLabel>{commonT("fields.additionalContext")}</FieldLabel>
							<Textarea
								{...form.register("additionalContext")}
								placeholder={t("placeholders.addAdditionalContext")}
								aria-label={commonT("fields.additionalContext")}
								maxLength={ADDITIONAL_CONTEXT_MAX}
								className='min-h-37.5'
							/>
							<div className='flex items-center justify-between'>
								<span className='text-xs text-muted-foreground'>{t("create.contextHint")}</span>
								<span className='text-xs tabular-nums text-muted-foreground'>
									{t("create.contextCount", {
										count: additionalContextValue?.length ?? 0,
									})}
								</span>
							</div>
						</Field>
					</div>

					<div className='flex items-center justify-between pt-4'>
						{step > 1 ? (
							<Button type='button' variant='ghost' onClick={previousStep}>
								<ArrowLeftIcon className='mr-2 size-4' />
								{BACK_LABEL}
							</Button>
						) : (
							<Button type='button' variant='ghost' onClick={onCancel}>
								{commonT("actions.cancel")}
							</Button>
						)}

						{step < steps.length ? (
							<Button type='button' onClick={nextStep}>
								{CONTINUE_LABEL}
								<ArrowRightIcon className='ml-2 size-4' />
							</Button>
						) : (
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? commonT("actions.creating") : t("actions.createPatient")}
							</Button>
						)}
					</div>
				</Form>
			</div>
		</div>
	);
};
