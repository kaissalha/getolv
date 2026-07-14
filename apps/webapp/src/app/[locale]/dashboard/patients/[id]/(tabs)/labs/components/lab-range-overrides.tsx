"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaPortal,
	CredenzaTitle,
} from "@starter/ui/components/credenza";

import { LabRangeOverridesForm } from "./lab-range-overrides-form";
import { LabRangeOverridesList } from "./lab-range-overrides-list";
import { useLabRangeOverridesController } from "./use-lab-range-overrides-controller";

type LabRangeOverridesProps = {
	initialLabTestId?: string | null;
	onOpenChange: (open: boolean) => void;
	open: boolean;
};

export const LabRangeOverrides = ({ open, onOpenChange, initialLabTestId }: LabRangeOverridesProps) => {
	const t = useTranslations("dashboard.patients.labs");
	const controller = useLabRangeOverridesController({
		initialLabTestId,
		onOpenChange,
		open,
	});

	return (
		<Credenza open={open} onOpenChange={onOpenChange}>
			<CredenzaPortal>
				<CredenzaContent className='max-w-2xl'>
					<CredenzaHeader>
						<CredenzaTitle>{t("customRangesTitle")}</CredenzaTitle>
						<CredenzaDescription>{t("customRangesDescription")}</CredenzaDescription>
					</CredenzaHeader>

					<CredenzaBody className='max-h-[60vh] space-y-6 overflow-y-auto'>
						{!initialLabTestId && (
							<LabRangeOverridesList
								isDeleting={controller.isDeleting}
								onDelete={controller.handleDeleteOverride}
								onEdit={controller.handleEditOverride}
								overrides={controller.overrides}
							/>
						)}
						<LabRangeOverridesForm
							catalog={controller.catalog}
							initialLabTestId={initialLabTestId}
							onAddRange={controller.handleAddRange}
							onRangeChange={controller.handleRangeChange}
							onRemoveRange={controller.handleRemoveRange}
							onSelectLabTest={controller.handleSelectLabTest}
							onUnitChange={controller.setUnit}
							ranges={controller.ranges}
							selectedLabTestId={controller.selectedLabTestId}
							selectedLabTestName={controller.selectedCatalogTest?.name}
							unit={controller.unit}
						/>
					</CredenzaBody>

					<CredenzaFooter>
						<Button variant='outline' onClick={controller.handleClose}>
							{t("cancel")}
						</Button>
						<Button
							onClick={controller.handleSave}
							disabled={!controller.selectedLabTestId || controller.isSaving}
							className='min-w-20'
						>
							{controller.isSaving ? <Loader2 className='size-4 animate-spin' /> : t("save")}
						</Button>
					</CredenzaFooter>
				</CredenzaContent>
			</CredenzaPortal>
		</Credenza>
	);
};
