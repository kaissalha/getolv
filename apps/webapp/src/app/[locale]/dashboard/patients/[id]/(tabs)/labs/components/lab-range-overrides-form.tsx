"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@getolv/ui/components/button";
import { Input } from "@getolv/ui/components/input";
import { Label } from "@getolv/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@getolv/ui/components/select";

import type { LabTestCatalogItem, RangeChangeInput, RangeInput } from "./use-lab-range-overrides-controller";

type LabRangeOverridesFormProps = {
	catalog: LabTestCatalogItem[];
	initialLabTestId?: string | null;
	onAddRange: () => void;
	onRangeChange: (input: RangeChangeInput) => void;
	onRemoveRange: ({ index }: { index: number }) => void;
	onSelectLabTest: ({ labTestId }: { labTestId: string }) => void;
	onUnitChange: (value: string) => void;
	ranges: RangeInput[];
	selectedLabTestId: string | null;
	selectedLabTestName?: string;
	unit: string;
};

export const LabRangeOverridesForm = ({
	catalog,
	initialLabTestId,
	onAddRange,
	onRangeChange,
	onRemoveRange,
	onSelectLabTest,
	onUnitChange,
	ranges,
	selectedLabTestId,
	selectedLabTestName,
	unit,
}: LabRangeOverridesFormProps) => {
	const t = useTranslations("dashboard.patients.labs");
	const statusLabels = {
		critical: t("statusCritical"),
		optimal: t("statusOptimal"),
		suboptimal: t("statusSuboptimal"),
	};
	const handleStatusChange = ({ index, value }: { index: number; value: string | null }) => {
		if (value === "optimal" || value === "suboptimal" || value === "critical") {
			onRangeChange({
				field: "status",
				index,
				value,
			});
		}
	};

	return (
		<div className='space-y-4'>
			{!initialLabTestId && (
				<div className='space-y-2'>
					<Label>{t("selectLabTest")}</Label>
					<Select
						value={selectedLabTestId || ""}
						onValueChange={(value) => value && onSelectLabTest({ labTestId: value })}
					>
						<SelectTrigger>
							<SelectValue>{selectedLabTestName ?? t("selectLabTestPlaceholder")}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{catalog.map((test) => (
								<SelectItem key={test.id} value={test.id}>
									{test.name} ({test.code})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			{selectedLabTestId && (
				<>
					{initialLabTestId && (
						<div className='rounded-md border bg-muted/50 p-3'>
							<p className='font-medium'>{selectedLabTestName}</p>
						</div>
					)}

					<div className='space-y-2'>
						<Label>{t("unit")}</Label>
						<Input
							value={unit}
							onChange={(event) => onUnitChange(event.target.value)}
							placeholder={t("unitPlaceholder")}
						/>
					</div>

					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<Label>{t("ranges")}</Label>
							<Button type='button' variant='ghost' size='sm' onClick={onAddRange}>
								<Plus className='me-1 size-4' />
								{t("addRange")}
							</Button>
						</div>
						<div className='space-y-3'>
							{ranges.map((range, index) => (
								<div
									key={`${range.min}-${range.max}-${range.status}-${index}`}
									className='flex items-center gap-2'
								>
									<Input
										type='number'
										value={range.min}
										onChange={(event) =>
											onRangeChange({ field: "min", index, value: event.target.value })
										}
										placeholder={t("min")}
										className='w-24'
									/>
									<span>-</span>
									<Input
										type='number'
										value={range.max}
										onChange={(event) =>
											onRangeChange({ field: "max", index, value: event.target.value })
										}
										placeholder={t("max")}
										className='w-24'
									/>
									<Select
										value={range.status}
										onValueChange={(value) => handleStatusChange({ index, value })}
									>
										<SelectTrigger className='w-32'>
											<SelectValue>{statusLabels[range.status]}</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='optimal'>{statusLabels.optimal}</SelectItem>
											<SelectItem value='suboptimal'>{statusLabels.suboptimal}</SelectItem>
											<SelectItem value='critical'>{statusLabels.critical}</SelectItem>
										</SelectContent>
									</Select>
									{ranges.length > 1 && (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => onRemoveRange({ index })}
										>
											<Trash2 className='size-4' />
										</Button>
									)}
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};
