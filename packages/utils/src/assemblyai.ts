export const assemblyAiMedicalDomain = "medical-v1";

export const assemblyAiPreRecordedSpeechModels = ["universal-3-pro", "universal-2"] as const;

export const assemblyAiStreamingSpeechModel = "u3-rt-pro";

export const assemblyAiConservativeMedicalTurnDetection = {
	maxTurnSilenceMs: 3600,
	minTurnSilenceMs: 800,
} as const;

export type AssemblyAiTranscriptTurnMetadata = {
	confidence?: number | null;
	endMs?: number | null;
	languageCode?: string | null;
	rawSpeakerLabel?: string | null;
	source: "pre_recorded" | "streaming";
	startMs?: number | null;
	streamTurnOrder?: number | null;
};

export type AssemblyAiStreamingTurnMetadata = {
	confidence?: number | null;
	endMs?: number | null;
	languageCode?: string | null;
	rawSpeakerLabel?: string | null;
	source: "streaming";
	startMs?: number | null;
	streamTurnOrder?: number | null;
};

type AssemblyAiPatientDiagnosisInput = {
	differentialDx?: Array<{
		name?: string | null;
	}> | null;
	workingDx?: Array<{
		name?: string | null;
	}> | null;
};

type AssemblyAiMedicalKeytermInput = {
	allergies?: string | null;
	currentDiagnoses?: string[] | null;
	currentMedications?: string | null;
	familyMedicalHistory?: string | null;
	pastMedicalHistory?: string | null;
};

type AssemblyAiMedicalPatientContextInput = {
	allergies?: string | null;
	currentMedications?: string | null;
	diagnosis?: AssemblyAiPatientDiagnosisInput | null;
	familyMedicalHistory?: string | null;
	pastMedicalHistory?: string | null;
};

const MEDICAL_BASE_KEYTERMS = [
	"assessment and plan",
	"atorvastatin",
	"auscultation",
	"chief complaint",
	"complete blood count",
	"diabetes mellitus type 2",
	"differential diagnosis",
	"electrocardiogram",
	"hemoglobin A1c",
	"history of present illness",
	"hypertension",
	"levothyroxine",
	"lisinopril",
	"metformin",
	"palpation",
	"physical examination",
	"range of motion",
	"reflexes",
	"review of systems",
] as const;

const MAX_MEDICAL_KEYTERMS = 64;
const MAX_KEYTERM_WORDS = 6;
const keytermSplitPattern = /[\n,;|]+/;

const normalizeMedicalKeyterm = (value: string) =>
	value
		.trim()
		.replace(/\s+/g, " ")
		.replace(/^[,;:]+|[,;:]+$/g, "");

const isValidMedicalKeyterm = (value: string) =>
	value.length > 0 && value.split(" ").length <= MAX_KEYTERM_WORDS && !/^[-–—]+$/.test(value);

const getDelimitedMedicalKeyterms = (value: string | null | undefined) =>
	(value ?? "").split(keytermSplitPattern).map(normalizeMedicalKeyterm).filter(isValidMedicalKeyterm);

export const buildAssemblyAiMedicalKeyterms = ({
	allergies,
	currentDiagnoses,
	currentMedications,
	familyMedicalHistory,
	pastMedicalHistory,
}: AssemblyAiMedicalKeytermInput) => {
	const uniqueKeyterms = new Map<string, string>();

	const addKeyterm = (value: string) => {
		const normalizedValue = normalizeMedicalKeyterm(value);

		if (!isValidMedicalKeyterm(normalizedValue)) {
			return;
		}

		const dedupeKey = normalizedValue.toLowerCase();

		if (!uniqueKeyterms.has(dedupeKey)) {
			uniqueKeyterms.set(dedupeKey, normalizedValue);
		}
	};

	for (const value of MEDICAL_BASE_KEYTERMS) {
		addKeyterm(value);
	}

	for (const value of getDelimitedMedicalKeyterms(currentMedications)) {
		addKeyterm(value);
	}

	for (const value of getDelimitedMedicalKeyterms(allergies)) {
		addKeyterm(value);
	}

	for (const value of getDelimitedMedicalKeyterms(pastMedicalHistory)) {
		addKeyterm(value);
	}

	for (const value of getDelimitedMedicalKeyterms(familyMedicalHistory)) {
		addKeyterm(value);
	}

	for (const value of currentDiagnoses ?? []) {
		addKeyterm(value);
	}

	return Array.from(uniqueKeyterms.values()).slice(0, MAX_MEDICAL_KEYTERMS);
};

export const buildAssemblyAiMedicalKeytermsFromPatient = ({
	allergies,
	currentMedications,
	diagnosis,
	familyMedicalHistory,
	pastMedicalHistory,
}: AssemblyAiMedicalPatientContextInput) => {
	const currentDiagnoses = [diagnosis?.workingDx ?? [], diagnosis?.differentialDx ?? []]
		.flat()
		.map((entry) => normalizeMedicalKeyterm(entry?.name ?? ""))
		.filter(isValidMedicalKeyterm);

	return buildAssemblyAiMedicalKeyterms({
		allergies,
		currentDiagnoses,
		currentMedications,
		familyMedicalHistory,
		pastMedicalHistory,
	});
};
