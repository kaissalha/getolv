import type { NoteMentionResourceType } from "@starter/db";

/** Regex pattern for mention markers: [[type:id:label]] */
export const MENTION_PATTERN = /\[\[(patient):([^:]+):([^\]]+)\]\]/g;

/** Parse mentions from text */
export const parseMentions = (text: string) =>
	Array.from(text.matchAll(new RegExp(MENTION_PATTERN.source, "g"))).map((match) => ({
		type: match[1] as NoteMentionResourceType,
		id: match[2],
		label: match[3],
		fullMatch: match[0],
		index: match.index ?? 0,
	}));

/** Create a mention marker: [[type:id:label]] */
export const createMentionMarker = (type: NoteMentionResourceType, id: string, label: string) =>
	`[[${type}:${id}:${label}]]`;

/** Get display label for a patient mention */
export const getMentionLabel = (
	_resourceType: NoteMentionResourceType,
	resourceId: string,
	patients: Array<{ id: string; firstName: string; lastName: string }>,
	fallback: string
) => {
	const patient = patients.find((p) => p.id === resourceId);
	return patient ? `${patient.firstName} ${patient.lastName}` : fallback;
};

/** Convert [[type:id:label]] format to TipTap HTML */
export const mentionMarkupToHtml = (value: string) => {
	if (!value) return "<p></p>";

	return value
		.replace(MENTION_PATTERN, (_, type, id, label) => {
			return `<span data-type="mention" data-id="${id}" data-mention-type="${type}" data-label="${label}">${label}</span>`;
		})
		.split("\n")
		.map((line) => `<p>${line || "<br>"}</p>`)
		.join("");
};

/** Convert TipTap HTML back to [[type:id:label]] format */
export const htmlToMentionMarkup = (html: string) => {
	const div = document.createElement("div");
	div.innerHTML = html;

	let result = "";

	const processNode = (node: Node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			result += node.textContent || "";
			return;
		}

		if (!(node instanceof HTMLElement)) return;

		if (node.dataset.type === "mention") {
			const type = node.dataset.mentionType || "patient";
			const id = node.dataset.id || "";
			const label = node.dataset.label || node.textContent || "";
			result += `[[${type}:${id}:${label}]]`;
			return;
		}

		if (node.tagName === "P") {
			if (result.length > 0 && !result.endsWith("\n")) {
				result += "\n";
			}
		}

		node.childNodes.forEach(processNode);
	};

	div.childNodes.forEach(processNode);
	return result.trimStart();
};
