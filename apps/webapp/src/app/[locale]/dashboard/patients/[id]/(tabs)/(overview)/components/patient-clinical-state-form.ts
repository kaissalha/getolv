"use client";

import type { RouterOutput } from "@starter/server";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

export type PatientClinicalStateFormValues = {
	diagnosis: {
		workingDx: Array<{
			name: string;
			reasoning: string;
			evidence: string;
			missing: string;
			verifyNext: string;
		}>;
		differentialDx: Array<{
			name: string;
			reasoning: string;
			evidence: string;
			missing: string;
			verifyNext: string;
		}>;
	};
	todos: Array<{
		id: string;
		text: string;
		category: string;
	}>;
};

const normalizeOptionalText = ({ value }: { value: string | null | undefined }) => {
	const trimmedValue = value?.trim();

	return trimmedValue ? trimmedValue : null;
};

const getDiagnosisEntryFormValues = ({ entry }: { entry: PatientDetails["diagnosis"]["workingDx"][number] }) => ({
	name: entry.name ?? "",
	reasoning: entry.reasoning ?? "",
	evidence: entry.evidence ?? "",
	missing: entry.missing ?? "",
	verifyNext: entry.verifyNext ?? "",
});

export const createEmptyClinicalDiagnosisEntry = () => ({
	name: "",
	reasoning: "",
	evidence: "",
	missing: "",
	verifyNext: "",
});

export const createEmptyClinicalTodo = () => ({
	id: crypto.randomUUID(),
	text: "",
	category: "",
});

export const getPatientClinicalStateFormValues = ({
	patient,
}: {
	patient: Pick<PatientDetails, "diagnosis" | "todos">;
}): PatientClinicalStateFormValues => ({
	diagnosis: {
		workingDx: patient.diagnosis.workingDx.map((entry) => getDiagnosisEntryFormValues({ entry })),
		differentialDx: patient.diagnosis.differentialDx.map((entry) => getDiagnosisEntryFormValues({ entry })),
	},
	todos: patient.todos.map((todo) => ({
		id: todo.id,
		text: todo.text,
		category: todo.category ?? "",
	})),
});

const normalizeDiagnosisEntry = ({
	entry,
}: {
	entry: PatientClinicalStateFormValues["diagnosis"]["workingDx"][number];
}) => {
	const name = entry.name.trim();

	if (!name) {
		return null;
	}

	return {
		name,
		reasoning: normalizeOptionalText({ value: entry.reasoning }),
		evidence: normalizeOptionalText({ value: entry.evidence }),
		missing: normalizeOptionalText({ value: entry.missing }),
		verifyNext: normalizeOptionalText({ value: entry.verifyNext }),
	};
};

const normalizeDiagnosisEntries = ({
	entries,
}: {
	entries: PatientClinicalStateFormValues["diagnosis"]["workingDx"];
}) =>
	entries
		.map((entry) => normalizeDiagnosisEntry({ entry }))
		.filter((entry): entry is NonNullable<ReturnType<typeof normalizeDiagnosisEntry>> => Boolean(entry));

export const getPatientClinicalStateMutationInput = ({ values }: { values: PatientClinicalStateFormValues }) => ({
	diagnosis: {
		workingDx: normalizeDiagnosisEntries({ entries: values.diagnosis.workingDx }),
		differentialDx: normalizeDiagnosisEntries({ entries: values.diagnosis.differentialDx }),
	},
	todos: values.todos
		.map((todo) => {
			const text = todo.text.trim();

			if (!text) {
				return null;
			}

			return {
				id: todo.id,
				text,
				category: normalizeOptionalText({ value: todo.category }),
			};
		})
		.filter((todo): todo is NonNullable<(typeof values.todos)[number]> & { category: string | null } =>
			Boolean(todo)
		),
});
