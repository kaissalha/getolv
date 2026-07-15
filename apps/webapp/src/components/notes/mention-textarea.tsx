"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import getolvKit from "@tiptap/starter-kit";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { NoteMentionResourceType } from "@getolv/db";
import { cn } from "@getolv/ui/lib/utils";

import { htmlToMentionMarkup, mentionMarkupToHtml } from "./mention-utils";
import type { MentionOption } from "./types";

type MentionTextareaProps = {
	value: string;
	onChange: (value: string) => void;
	onMentionsChange: (mentions: MentionOption[]) => void;
	patients: Array<{ id: string; firstName: string; lastName: string }>;
	placeholder?: string;
	className?: string;
};

type MentionCandidate = {
	id: string;
	type: NoteMentionResourceType;
	label: string;
};

const MentionWithResourceType = Mention.extend({
	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: (element: HTMLElement) => element.getAttribute("data-id"),
				renderHTML: (attrs: { id?: string | null }) => (attrs.id ? { "data-id": attrs.id } : {}),
			},
			label: {
				default: null,
				parseHTML: (element: HTMLElement) => element.dataset.label,
				renderHTML: (attrs: { label?: string | null }) => (attrs.label ? { "data-label": attrs.label } : {}),
			},
			mentionSuggestionChar: {
				default: "@",
				parseHTML: (element: HTMLElement) => element.getAttribute("data-mention-suggestion-char"),
				renderHTML: (attrs: { mentionSuggestionChar?: string | null }) => ({
					"data-mention-suggestion-char": attrs.mentionSuggestionChar,
				}),
			},
			type: {
				default: "patient",
				parseHTML: (element: HTMLElement) => element.dataset.mentionType,
				renderHTML: (attrs: { type?: NoteMentionResourceType | null }) => ({ "data-mention-type": attrs.type }),
			},
		};
	},
});

// Suggestion dropdown component
const SuggestionDropdown = ({
	items,
	onSelect,
	getTypeLabel,
}: {
	items: MentionCandidate[];
	onSelect: (item: MentionCandidate) => void;
	getTypeLabel: (type: NoteMentionResourceType) => string;
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((i) => (i - 1 + items.length) % items.length);
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((i) => (i + 1) % items.length);
			} else if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault();
				if (items[selectedIndex]) onSelect(items[selectedIndex]);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [items, selectedIndex, onSelect]);

	if (items.length === 0) return null;

	return (
		<div className='z-50 max-h-60 min-w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg'>
			{items.map((item, index) => (
				<button
					key={`${item.type}-${item.id}`}
					type='button'
					onClick={() => onSelect(item)}
					onMouseEnter={() => setSelectedIndex(index)}
					className={cn(
						"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors",
						index === selectedIndex ? "bg-accent text-accent-foreground" : "text-foreground"
					)}
				>
					<UserIcon className='size-4 text-muted-foreground' />
					<span>{item.label}</span>
					<span className='ms-auto text-xs text-muted-foreground'>{getTypeLabel(item.type)}</span>
				</button>
			))}
		</div>
	);
};

export const MentionTextarea = ({
	value,
	onChange,
	onMentionsChange,
	patients,
	placeholder,
	className,
}: MentionTextareaProps) => {
	const t = useTranslations("notes");
	const lastValueRef = useRef(value);
	const editorWrapperRef = useRef<HTMLDivElement>(null);

	const getTypeLabel = useCallback((type: NoteMentionResourceType) => t(`mentions.${type}`), [t]);

	// Build mention candidates from patients only
	const candidates = useMemo<MentionCandidate[]>(
		() => patients.map((p) => ({ id: p.id, type: "patient" as const, label: `${p.firstName} ${p.lastName}` })),
		[patients]
	);

	// TipTap suggestion configuration
	const suggestion: Omit<SuggestionOptions<MentionCandidate>, "editor"> = useMemo(
		() => ({
			items: ({ query }) => {
				if (!query) return candidates;
				const q = query.toLowerCase();
				return candidates.filter((c) => c.label.toLowerCase().includes(q));
			},
			render: () => {
				let root: ReactDOM.Root | null = null;
				let container: HTMLDivElement | null = null;

				const cleanup = () => {
					root?.unmount();
					container?.remove();
					root = null;
					container = null;
				};

				const updatePosition = (rect: DOMRect | null) => {
					const wrapper = editorWrapperRef.current;
					if (rect && container && wrapper) {
						const wrapperRect = wrapper.getBoundingClientRect();
						container.style.left = `${rect.left - wrapperRect.left}px`;
						container.style.top = `${rect.bottom - wrapperRect.top + 4}px`;
					}
				};

				return {
					onStart: (props: SuggestionProps<MentionCandidate>) => {
						const wrapper = editorWrapperRef.current;
						if (!wrapper) return;

						container = document.createElement("div");
						container.style.cssText = "position:absolute;z-index:50";
						wrapper.appendChild(container);
						updatePosition(props.clientRect?.() || null);

						root = ReactDOM.createRoot(container);
						root.render(
							<SuggestionDropdown
								key={props.items.map((item) => `${item.type}:${item.id}`).join("|")}
								items={props.items}
								onSelect={(item) => props.command({ id: item.id, type: item.type, label: item.label })}
								getTypeLabel={getTypeLabel}
							/>
						);
					},
					onUpdate: (props: SuggestionProps<MentionCandidate>) => {
						updatePosition(props.clientRect?.() || null);
						root?.render(
							<SuggestionDropdown
								key={props.items.map((item) => `${item.type}:${item.id}`).join("|")}
								items={props.items}
								onSelect={(item) => props.command({ id: item.id, type: item.type, label: item.label })}
								getTypeLabel={getTypeLabel}
							/>
						);
					},
					onKeyDown: ({ event }) => {
						if (event.key === "Escape") {
							cleanup();
							return true;
						}
						// Let SuggestionDropdown handle arrow/enter/tab
						return ["ArrowUp", "ArrowDown", "Enter", "Tab"].includes(event.key);
					},
					onExit: () => {
						cleanup();
					},
				};
			},
		}),
		[candidates, getTypeLabel]
	);

	// Custom mention extension with type and label attributes
	const MentionExtension = useMemo(
		() =>
			MentionWithResourceType.configure({
				HTMLAttributes: { class: "font-bold text-foreground" },
				suggestion,
				deleteTriggerWithBackspace: true,
				renderHTML: ({ node }) => [
					"span",
					{
						"data-type": "mention",
						"data-id": node.attrs.id,
						"data-mention-type": node.attrs.type || "patient",
						"data-label": node.attrs.label,
						class: "font-bold text-foreground",
					},
					node.attrs.label || node.attrs.id,
				],
			}),
		[suggestion]
	);

	const editor = useEditor({
		extensions: [
			getolvKit.configure({
				heading: false,
				bulletList: false,
				orderedList: false,
				blockquote: false,
				codeBlock: false,
				horizontalRule: false,
			}),
			Placeholder.configure({ placeholder: placeholder || t("placeholder.bodyWithMention") }),
			MentionExtension,
		],
		content: mentionMarkupToHtml(value),
		immediatelyRender: false,
		onCreate: ({ editor }) => {
			// Focus at end when editor is created
			requestAnimationFrame(() => editor.commands.focus("end"));
		},
		onUpdate: ({ editor }) => {
			const newValue = htmlToMentionMarkup(editor.getHTML());
			if (newValue === lastValueRef.current) return;

			lastValueRef.current = newValue;
			onChange(newValue);

			// Extract unique mentions from DOM
			const seen = new Set<string>();
			const mentions = Array.from(editor.view.dom.querySelectorAll('[data-type="mention"]'))
				.map((el) => {
					const id = el.getAttribute("data-id");
					const typeAttr = el.getAttribute("data-mention-type");
					const type: NoteMentionResourceType = typeAttr === "patient" ? typeAttr : "patient";
					const label = el.getAttribute("data-label") || el.textContent || "";
					return { id, type, label };
				})
				.filter((m): m is MentionOption => {
					if (!m.id) return false;
					const key = `${m.type}:${m.id}`;
					if (seen.has(key)) return false;
					seen.add(key);
					return true;
				});

			onMentionsChange(mentions);
		},
	});

	// Sync external value changes
	useEffect(() => {
		if (!editor || value === lastValueRef.current) return;
		lastValueRef.current = value;
		editor.commands.setContent(mentionMarkupToHtml(value));
	}, [editor, value]);

	return (
		<div ref={editorWrapperRef} className='relative min-h-32 w-full overflow-visible'>
			<EditorContent
				editor={editor}
				className={cn(
					"min-h-32 w-full",
					"[&_.tiptap]:min-h-24 [&_.tiptap]:text-base [&_.tiptap]:outline-none [&_.tiptap_p]:m-0 sm:[&_.tiptap]:text-sm",
					"[&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
					className
				)}
			/>
		</div>
	);
};
