import { parseMentions } from "./mention-utils";

type NoteBodyProps = {
	body: string;
	className?: string;
};

export const NoteBody = ({ body, className }: NoteBodyProps) => {
	const mentions = parseMentions(body);

	if (mentions.length === 0) {
		return <span className={className}>{body}</span>;
	}

	// Build the rendered content with mentions as bold text using reduce
	const { parts, lastIndex } = mentions.reduce(
		(acc, mention, idx) => {
			const newParts = [...acc.parts];

			// Add text before this mention
			if (mention.index > acc.lastIndex) {
				newParts.push(<span key={`text-${idx}`}>{body.slice(acc.lastIndex, mention.index)}</span>);
			}

			// Add the mention as bold text (label is stored in the marker)
			newParts.push(
				<span key={`mention-${idx}`} className='font-bold'>
					{mention.label}
				</span>
			);

			return {
				parts: newParts,
				lastIndex: mention.index + mention.fullMatch.length,
			};
		},
		{ parts: [] as React.ReactNode[], lastIndex: 0 }
	);

	// Add any remaining text after the last mention
	const finalParts =
		lastIndex < body.length ? [...parts, <span key='text-end'>{body.slice(lastIndex)}</span>] : parts;

	return <span className={className}>{finalParts}</span>;
};
