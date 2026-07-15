"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@getolv/ui/components/button";
import { Label } from "@getolv/ui/components/label";
import { Separator } from "@getolv/ui/components/separator";

import type { LabRangeOverride } from "./use-lab-range-overrides-controller";

type LabRangeOverridesListProps = {
	isDeleting: boolean;
	onDelete: ({ labTestId }: { labTestId: string }) => void;
	onEdit: ({ override }: { override: LabRangeOverride }) => void;
	overrides: LabRangeOverride[];
};

export const LabRangeOverridesList = ({ isDeleting, onDelete, onEdit, overrides }: LabRangeOverridesListProps) => {
	const t = useTranslations("dashboard.patients.labs");

	if (overrides.length === 0) {
		return null;
	}

	return (
		<div className='space-y-2'>
			<Label>{t("existingOverrides")}</Label>
			<div className='space-y-2'>
				{overrides.map((override) => (
					<div key={override.id} className='flex items-center justify-between rounded-md border p-3'>
						<div>
							<p className='font-medium'>{override.labTest.name}</p>
							<p className='text-sm text-muted-foreground'>
								{override.ranges.length} {t("rangesDefined")}
								{override.unit && ` - ${override.unit}`}
							</p>
						</div>
						<div className='flex gap-2'>
							<Button variant='ghost' size='sm' onClick={() => onEdit({ override })}>
								{t("edit")}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onDelete({ labTestId: override.labTestId })}
								disabled={isDeleting}
							>
								<Trash2 className='size-4 text-destructive' />
							</Button>
						</div>
					</div>
				))}
			</div>
			<Separator className='my-4' />
		</div>
	);
};
