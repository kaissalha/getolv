"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc";
import type { RouterOutput } from "@getolv/server";

export type RangeInput = {
	max: string;
	min: string;
	status: "optimal" | "suboptimal" | "critical";
};

export type RangeChangeInput =
	| { field: "max" | "min"; index: number; value: string }
	| { field: "status"; index: number; value: RangeInput["status"] };

export type LabRangeOverride = RouterOutput["labs"]["getPatientLabRangeOverrides"][number];
export type LabTestCatalogItem = RouterOutput["labs"]["getLabTestsCatalog"][number];

type UseLabRangeOverridesControllerProps = {
	initialLabTestId?: string | null;
	onOpenChange: (open: boolean) => void;
	open: boolean;
};

const emptyRange: RangeInput = { max: "", min: "", status: "optimal" };

const getRangesInput = ({ ranges }: { ranges: LabRangeOverride["ranges"] | LabTestCatalogItem["ranges"] }) =>
	ranges.map((range) => ({
		max: range.max.toString(),
		min: range.min.toString(),
		status: range.status,
	}));

export const useLabRangeOverridesController = ({
	initialLabTestId,
	onOpenChange,
	open,
}: UseLabRangeOverridesControllerProps) => {
	const { id: patientId } = useParams<{ id: string }>();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [selectedLabTestId, setSelectedLabTestId] = useState<string | null>(initialLabTestId ?? null);
	const [ranges, setRanges] = useState<RangeInput[]>([emptyRange]);
	const [unit, setUnit] = useState("");
	const { data: catalog = [] } = useQuery(trpc.labs.getLabTestsCatalog.queryOptions());
	const { data: overrides = [] } = useQuery(trpc.labs.getPatientLabRangeOverrides.queryOptions({ patientId }));
	const selectedCatalogTest = catalog.find((test) => test.id === selectedLabTestId);

	const resetForm = () => {
		setSelectedLabTestId(null);
		setRanges([emptyRange]);
		setUnit("");
	};

	const invalidateLabQueries = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: trpc.labs.getPatientLabRangeOverrides.queryKey({ patientId }),
			}),
			queryClient.invalidateQueries({
				queryKey: trpc.labs.getPatientLabResults.queryKey({ patientId }),
			}),
		]);
	};

	useEffect(() => {
		if (!(open && initialLabTestId && catalog.length > 0)) {
			return;
		}

		const existingOverride = overrides.find((override) => override.labTestId === initialLabTestId);

		if (existingOverride) {
			setSelectedLabTestId(existingOverride.labTestId);
			setUnit(existingOverride.unit || "");
			setRanges(getRangesInput({ ranges: existingOverride.ranges }));
			return;
		}

		const catalogTest = catalog.find((test) => test.id === initialLabTestId);

		if (catalogTest) {
			setSelectedLabTestId(initialLabTestId);
			setUnit(catalogTest.unit);
			setRanges(getRangesInput({ ranges: catalogTest.ranges }));
		}
	}, [catalog, initialLabTestId, open, overrides]);

	const upsertMutation = useMutation(
		trpc.labs.upsertPatientLabRangeOverride.mutationOptions({
			onSuccess: async () => {
				await invalidateLabQueries();
				resetForm();
				onOpenChange(false);
			},
		})
	);

	const deleteMutation = useMutation(
		trpc.labs.deletePatientLabRangeOverride.mutationOptions({
			onSuccess: invalidateLabQueries,
		})
	);

	const handleAddRange = () => {
		setRanges((currentRanges) => [...currentRanges, { max: "", min: "", status: "suboptimal" }]);
	};

	const handleRemoveRange = ({ index }: { index: number }) => {
		setRanges((currentRanges) => currentRanges.filter((_, currentIndex) => currentIndex !== index));
	};

	const handleRangeChange = ({ field, index, value }: RangeChangeInput) => {
		setRanges((currentRanges) =>
			currentRanges.map((range, currentIndex) => {
				if (currentIndex !== index) {
					return range;
				}

				if (field === "status") {
					return {
						...range,
						status: value,
					};
				}

				return {
					...range,
					[field]: value,
				};
			})
		);
	};

	const handleSave = () => {
		if (!selectedLabTestId) {
			return;
		}

		const validRanges = ranges
			.filter((range) => range.min !== "" && range.max !== "")
			.map((range) => ({
				max: Number.parseFloat(range.max),
				min: Number.parseFloat(range.min),
				status: range.status,
			}));

		if (validRanges.length === 0) {
			return;
		}

		upsertMutation.mutate({
			labTestId: selectedLabTestId,
			patientId,
			ranges: validRanges,
			unit,
		});
	};

	const handleDeleteOverride = ({ labTestId }: { labTestId: string }) => {
		deleteMutation.mutate({ labTestId, patientId });
	};

	const handleSelectLabTest = ({ labTestId }: { labTestId: string }) => {
		setSelectedLabTestId(labTestId);
		const catalogTest = catalog.find((test) => test.id === labTestId);

		if (catalogTest) {
			setUnit(catalogTest.unit);
			setRanges(getRangesInput({ ranges: catalogTest.ranges }));
		}
	};

	const handleEditOverride = ({ override }: { override: LabRangeOverride }) => {
		setSelectedLabTestId(override.labTestId);
		setUnit(override.unit || "");
		setRanges(getRangesInput({ ranges: override.ranges }));
	};

	const handleClose = () => {
		onOpenChange(false);
		resetForm();
	};

	return {
		catalog,
		handleAddRange,
		handleClose,
		handleDeleteOverride,
		handleEditOverride,
		handleRangeChange,
		handleRemoveRange,
		handleSave,
		handleSelectLabTest,
		isDeleting: deleteMutation.isPending,
		isSaving: upsertMutation.isPending,
		overrides,
		ranges,
		selectedCatalogTest,
		selectedLabTestId,
		setUnit,
		unit,
	};
};
