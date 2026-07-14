"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";

import { useTranslations } from "next-intl";

import { ChatComposer } from "@/components/chat/chat-composer";

type IntelligencePromptBarProps = {
	onSubmit: (prompt: string) => void;
	disabled?: boolean;
};

export const IntelligencePromptBar = ({ onSubmit, disabled = false }: IntelligencePromptBarProps) => {
	const t = useTranslations("sessionIntelligence");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState("");

	const handleSubmit = useCallback(() => {
		if (!value.trim() || disabled) return;
		onSubmit(value);
		setValue("");
	}, [value, disabled, onSubmit]);

	const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
	}, []);

	return (
		<div className='pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center'>
			<div className='pointer-events-auto mx-auto w-full max-w-[calc(100vw-1rem)] shrink-0 px-2 pb-4 md:max-w-3xl md:px-0'>
				<ChatComposer
					input={value}
					isDisabled={disabled}
					onInputChange={handleInputChange}
					onSubmit={handleSubmit}
					placeholder={t("promptPlaceholder")}
					textareaRef={textareaRef}
				/>
			</div>
		</div>
	);
};
