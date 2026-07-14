import { parseMentions } from "@/components/notes/mention-utils";

type CopyField = {
	label: string;
	value: string | null | undefined;
};

type DiagnosisCopyEntry = {
	evidence?: string | null;
	missing?: string | null;
	name: string;
	reasoning?: string | null;
	verifyNext?: string | null;
};

const getNonEmptyCopySections = ({ sections }: { sections: Array<string | null | undefined> }) =>
	sections.reduce<string[]>((items, section) => {
		const nextSection = formatCopyText({ value: section });

		if (nextSection) {
			items.push(nextSection);
		}

		return items;
	}, []);

export const formatCopyText = ({ value }: { value: string | null | undefined }) => {
	if (!value) {
		return "";
	}

	return value
		.replace(/\r\n?/g, "\n")
		.split("\n")
		.map((line) => line.replace(/[ \t]+$/g, ""))
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
};

export const indentCopyText = ({ value }: { value: string }) =>
	value
		.split("\n")
		.map((line) => `  ${line}`)
		.join("\n");

export const joinCopySections = ({ sections }: { sections: Array<string | null | undefined> }) =>
	getNonEmptyCopySections({ sections }).join("\n\n");

export const joinCopyLines = ({ sections }: { sections: Array<string | null | undefined> }) =>
	getNonEmptyCopySections({ sections }).join("\n");

export const formatCopyCard = ({ title, sections }: { title: string; sections: Array<string | null | undefined> }) =>
	joinCopySections({
		sections: [title, ...sections],
	});

export const formatCopyField = ({ label, value }: CopyField) => {
	const nextValue = formatCopyText({ value });

	if (!nextValue) {
		return null;
	}

	if (nextValue.includes("\n")) {
		return `${label}:\n${indentCopyText({ value: nextValue })}`;
	}

	return `${label}: ${nextValue}`;
};

export const formatCopyList = ({
	items,
	emptyText,
}: {
	items: Array<string | null | undefined>;
	emptyText: string;
}) => {
	const nextItems = getNonEmptyCopySections({ sections: items });

	if (nextItems.length === 0) {
		return emptyText;
	}

	return nextItems
		.map((item) => {
			const [firstLine = "", ...rest] = item.split("\n");

			if (rest.length === 0) {
				return `- ${firstLine}`;
			}

			return `- ${firstLine}\n${indentCopyText({ value: rest.join("\n") })}`;
		})
		.join("\n");
};

export const formatDiagnosisEntryForCopy = ({
	entry,
	labels,
}: {
	entry: DiagnosisCopyEntry;
	labels: {
		evidence: string;
		missing: string;
		reasoning: string;
		verifyNext: string;
	};
}) => {
	const name = formatCopyText({ value: entry.name });

	if (!name) {
		return null;
	}

	const details = joinCopyLines({
		sections: [
			formatCopyField({ label: labels.reasoning, value: entry.reasoning }),
			formatCopyField({ label: labels.evidence, value: entry.evidence }),
			formatCopyField({ label: labels.missing, value: entry.missing }),
			formatCopyField({ label: labels.verifyNext, value: entry.verifyNext }),
		],
	});

	if (!details) {
		return `- ${name}`;
	}

	return `- ${name}\n${indentCopyText({ value: details })}`;
};

export const formatNoteMarkupForCopy = ({ value }: { value: string }) => {
	const mentions = parseMentions(value);

	if (mentions.length === 0) {
		return formatCopyText({ value });
	}

	let nextValue = "";
	let lastIndex = 0;

	for (const mention of mentions) {
		if (mention.index > lastIndex) {
			nextValue += value.slice(lastIndex, mention.index);
		}

		nextValue += mention.label;
		lastIndex = mention.index + mention.fullMatch.length;
	}

	if (lastIndex < value.length) {
		nextValue += value.slice(lastIndex);
	}

	return formatCopyText({ value: nextValue });
};
