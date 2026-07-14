"use client";

import { type KeyboardEvent as ReactKeyboardEvent, useCallback, useReducer } from "react";

export type ComposeRecipient = {
	email: string;
	name?: string;
};

export type ComposeState = {
	inReplyTo?: string;
	references?: string;
	subject: string;
	threadId?: string;
	to: ComposeRecipient[];
};

type RecipientField = "cc" | "to";

type ComposeDraftState = {
	body: string;
	ccInput: string;
	ccRecipients: ComposeRecipient[];
	recipients: ComposeRecipient[];
	showCc: boolean;
	subject: string;
	toInput: string;
};

type ComposeDraftAction =
	| { type: "append-recipient"; field: RecipientField; email: string }
	| { type: "pop-recipient"; field: RecipientField }
	| { type: "remove-recipient"; field: RecipientField; index: number }
	| { type: "set-body"; value: string }
	| { type: "set-cc-input"; value: string }
	| { type: "set-show-cc"; value: boolean }
	| { type: "set-subject"; value: string }
	| { type: "set-to-input"; value: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createInitialState = ({ composeData }: { composeData: ComposeState }): ComposeDraftState => ({
	body: "",
	ccInput: "",
	ccRecipients: [],
	recipients: composeData.to,
	showCc: false,
	subject: composeData.subject,
	toInput: "",
});

const appendRecipient = ({
	email,
	field,
	state,
}: {
	email: string;
	field: RecipientField;
	state: ComposeDraftState;
}): ComposeDraftState => {
	if (field === "to") {
		return {
			...state,
			recipients: [...state.recipients, { email }],
			toInput: "",
		};
	}

	return {
		...state,
		ccInput: "",
		ccRecipients: [...state.ccRecipients, { email }],
		showCc: true,
	};
};

const removeRecipient = ({
	field,
	index,
	state,
}: {
	field: RecipientField;
	index: number;
	state: ComposeDraftState;
}): ComposeDraftState => {
	if (field === "to") {
		return {
			...state,
			recipients: state.recipients.filter((_, currentIndex) => currentIndex !== index),
		};
	}

	return {
		...state,
		ccRecipients: state.ccRecipients.filter((_, currentIndex) => currentIndex !== index),
	};
};

const popRecipient = ({ field, state }: { field: RecipientField; state: ComposeDraftState }): ComposeDraftState => {
	if (field === "to") {
		return {
			...state,
			recipients: state.recipients.slice(0, -1),
		};
	}

	return {
		...state,
		ccRecipients: state.ccRecipients.slice(0, -1),
	};
};

const composeDraftReducer = (state: ComposeDraftState, action: ComposeDraftAction) => {
	switch (action.type) {
		case "append-recipient":
			return appendRecipient({
				email: action.email,
				field: action.field,
				state,
			});
		case "pop-recipient":
			return popRecipient({
				field: action.field,
				state,
			});
		case "remove-recipient":
			return removeRecipient({
				field: action.field,
				index: action.index,
				state,
			});
		case "set-body":
			return {
				...state,
				body: action.value,
			};
		case "set-cc-input":
			return {
				...state,
				ccInput: action.value,
			};
		case "set-show-cc":
			return {
				...state,
				showCc: action.value,
			};
		case "set-subject":
			return {
				...state,
				subject: action.value,
			};
		case "set-to-input":
			return {
				...state,
				toInput: action.value,
			};
		default:
			return state;
	}
};

export const useComposeDraft = ({ composeData }: { composeData: ComposeState }) => {
	const [state, dispatch] = useReducer(composeDraftReducer, { composeData }, createInitialState);

	const commitRecipientInput = useCallback(
		({ field }: { field: RecipientField }) => {
			const input = field === "to" ? state.toInput : state.ccInput;
			const trimmedInput = input.trim();

			if (!trimmedInput || !emailPattern.test(trimmedInput)) {
				return false;
			}

			dispatch({
				type: "append-recipient",
				field,
				email: trimmedInput,
			});
			return true;
		},
		[state.ccInput, state.toInput]
	);

	const handleRecipientKeyDown = useCallback(
		({ event, field }: { event: ReactKeyboardEvent<HTMLInputElement>; field: RecipientField }) => {
			const input = field === "to" ? state.toInput : state.ccInput;
			const recipients = field === "to" ? state.recipients : state.ccRecipients;

			if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
				event.preventDefault();
				commitRecipientInput({ field });
			}

			if (event.key === "Backspace" && !input && recipients.length > 0) {
				dispatch({ type: "pop-recipient", field });
			}
		},
		[commitRecipientInput, state.ccInput, state.ccRecipients, state.recipients, state.toInput]
	);

	const handleComposeKeyDown = useCallback(({ event, onSend }: { event: ReactKeyboardEvent; onSend: () => void }) => {
		if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
			event.preventDefault();
			onSend();
		}
	}, []);

	const setBody = useCallback((value: string) => {
		dispatch({ type: "set-body", value });
	}, []);

	const setCcInput = useCallback((value: string) => {
		dispatch({ type: "set-cc-input", value });
	}, []);

	const setSubject = useCallback((value: string) => {
		dispatch({ type: "set-subject", value });
	}, []);

	const setToInput = useCallback((value: string) => {
		dispatch({ type: "set-to-input", value });
	}, []);

	const removeDraftRecipient = useCallback(({ field, index }: { field: RecipientField; index: number }) => {
		dispatch({ type: "remove-recipient", field, index });
	}, []);

	const showCcField = useCallback(() => {
		dispatch({ type: "set-show-cc", value: true });
	}, []);

	const toRecipientsForSend = [...state.recipients];

	if (state.toInput.trim()) {
		toRecipientsForSend.push({ email: state.toInput.trim() });
	}

	return {
		body: state.body,
		canSend: state.recipients.length > 0 || Boolean(state.toInput.trim()),
		ccInput: state.ccInput,
		ccRecipients: state.ccRecipients,
		commitRecipientInput,
		handleComposeKeyDown,
		handleRecipientKeyDown,
		recipients: state.recipients,
		removeDraftRecipient,
		setBody,
		setCcInput,
		setSubject,
		setToInput,
		showCc: state.showCc,
		showCcField,
		subject: state.subject,
		toInput: state.toInput,
		toRecipientsForSend,
	};
};
