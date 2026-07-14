export type SuggestedQuestion = {
	id: string;
	question: string;
	category?: string | null;
};

export type TodoItem = {
	id: string;
	text: string;
	category?: string | null;
};

export type DiagnosisEntry = {
	name: string;
	reasoning?: string | null;
	evidence?: string | null;
	missing?: string | null;
	verifyNext?: string | null;
};

export type PractitionerQaTurn = {
	question: string;
	answer: string;
};

export type SessionIntelligence = {
	visitReason: string | null;
	riskFlags: string[];
	liveNote: string;
	thingsToAsk: SuggestedQuestion[];
	todos: TodoItem[];
	workingDx: DiagnosisEntry[];
	differentialDx: DiagnosisEntry[];
	practitionerQaTurns: PractitionerQaTurn[];
};
