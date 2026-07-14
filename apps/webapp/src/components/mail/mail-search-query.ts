import { addDays, isValid, parse, startOfDay } from "date-fns";

type MailSearchTextToken = {
	end: number;
	rawToken: string;
	start: number;
	type: "text";
};

export type MailSearchFilter = {
	displayToken: string;
	end: number;
	negated: boolean;
	normalizedToken: string;
	operator: string;
	rawToken: string;
	start: number;
	type: "filter";
	value: string;
};

const MAIL_SEARCH_FILTER_TOKEN_PATTERN = /(^|\s)(-?[\w-]+:(?:"[^"]+"|\S+))/g;
const MAIL_SEARCH_TEXT_TOKEN_PATTERN = /"[^"]+"|\S+/g;
const MAIL_SEARCH_LOCAL_OPERATOR_TOKENS = new Map([
	["important", "is:important"],
	["read", "is:read"],
	["starred", "is:starred"],
	["unread", "is:unread"],
]);
const MAIL_SEARCH_NEGATION_TOKENS = new Set(["not", "without"]);
const MAIL_SEARCH_CLASSIFICATION_LABELS = ["to respond", "meeting update", "fyi", "notification", "marketing"] as const;
const MAIL_SEARCH_SINGLE_TOKEN_VALUE_OPERATORS = new Set(["after", "before", "is"]);
const MAIL_SEARCH_LOCAL_VALUE_OPERATORS = new Set([
	"after",
	"before",
	"bcc",
	"category",
	"cc",
	"deliveredto",
	"filename",
	"from",
	"label",
	"labels",
	"list",
	"subject",
	"to",
]);
const MAIL_SEARCH_CLASSIFICATION_LABEL_TERMS = MAIL_SEARCH_CLASSIFICATION_LABELS.map((label) => ({
	label,
	terms: label.split(" "),
})).toSorted((a, b) => b.terms.length - a.terms.length);

const MAIL_SEARCH_FILTER_OPERATORS = new Set([
	"after",
	"bcc",
	"before",
	"category",
	"cc",
	"deliveredto",
	"filename",
	"from",
	"has",
	"in",
	"is",
	"label",
	"labels",
	"larger",
	"list",
	"newer",
	"newer_than",
	"older",
	"older_than",
	"rfc822msgid",
	"size",
	"smaller",
	"subject",
	"to",
]);

const parseMailSearchDate = ({ value }: { value: string }) => {
	if (!value) {
		return null;
	}

	const parsedDate = parse(value, "yyyy-MM-dd", new Date());

	if (!isValid(parsedDate)) {
		return null;
	}

	return startOfDay(parsedDate);
};

const formatMailSearchTerm = ({ value }: { value: string }) => {
	const trimmedValue = value.trim();

	if (!trimmedValue) {
		return null;
	}

	if (!/[\s"]/u.test(trimmedValue)) {
		return trimmedValue;
	}

	return `"${trimmedValue.replaceAll('"', '\\"')}"`;
};

const getNormalizedMailSearchTextTerm = ({ value }: { value: string }) => {
	const trimmedValue = value.trim();

	if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
		return trimmedValue.slice(1, -1).trim();
	}

	return trimmedValue;
};

const isQuotedMailSearchTextToken = ({ value }: { value: string }) => {
	const trimmedValue = value.trim();

	return trimmedValue.startsWith('"') && trimmedValue.endsWith('"');
};

const getMailSearchAfterTimestamp = ({ value }: { value: string }) => {
	const parsedDate = parseMailSearchDate({ value });

	if (!parsedDate) {
		return null;
	}

	return String(Math.floor(parsedDate.getTime() / 1000) - 1);
};

const getMailSearchBeforeTimestamp = ({ value }: { value: string }) => {
	const parsedDate = parseMailSearchDate({ value });

	if (!parsedDate) {
		return null;
	}

	return String(Math.floor(startOfDay(addDays(parsedDate, 1)).getTime() / 1000));
};

const createMailSearchToken = ({ rawToken, start }: { rawToken: string; start: number }): MailSearchTextToken => {
	return {
		end: start + rawToken.length,
		rawToken,
		start,
		type: "text",
	};
};

const normalizeMailSearchFilterToken = ({ key, negated, value }: { key: string; negated: boolean; value: string }) => {
	const normalizedKey = key === "labels" ? "label" : key;
	let normalizedValue = value;

	if (normalizedKey === "after" && !negated) {
		const timestamp = getMailSearchAfterTimestamp({ value });

		normalizedValue = timestamp ?? value;
	}

	if (normalizedKey === "before" && !negated) {
		const timestamp = getMailSearchBeforeTimestamp({ value });

		normalizedValue = timestamp ?? value;
	}

	const formattedValue =
		normalizedKey === "category" || normalizedKey === "has" || normalizedKey === "in" || normalizedKey === "is"
			? formatMailSearchTerm({ value: normalizedValue.toLowerCase() })
			: formatMailSearchTerm({ value: normalizedValue });

	return `${negated ? "-" : ""}${normalizedKey}:${formattedValue ?? normalizedValue}`;
};

const parseMailSearchFilterToken = ({
	rawToken,
	start,
}: {
	rawToken: string;
	start: number;
}): MailSearchFilter | null => {
	const negated = rawToken.startsWith("-");
	const token = negated ? rawToken.slice(1) : rawToken;
	const match = /^([\w-]+):(?:"([^"]+)"|(\S+))$/u.exec(token);

	if (!match) {
		return null;
	}

	const key = match[1].toLowerCase();

	if (!MAIL_SEARCH_FILTER_OPERATORS.has(key)) {
		return null;
	}

	const value = match[2] ?? match[3];
	const operator = key === "labels" ? "label" : key;

	return {
		displayToken: `${negated ? "-" : ""}${operator}:${value}`,
		end: start + rawToken.length,
		negated,
		normalizedToken: normalizeMailSearchFilterToken({ key, negated, value }),
		operator,
		rawToken,
		start,
		type: "filter",
		value,
	};
};

const parseMailSearchTokens = ({ search }: { search: string }) => {
	const tokens: Array<MailSearchFilter | MailSearchTextToken> = [];
	let cursor = 0;
	let filterMatch: RegExpExecArray | null;

	MAIL_SEARCH_FILTER_TOKEN_PATTERN.lastIndex = 0;
	MAIL_SEARCH_TEXT_TOKEN_PATTERN.lastIndex = 0;

	while (true) {
		filterMatch = MAIL_SEARCH_FILTER_TOKEN_PATTERN.exec(search);

		if (!filterMatch) {
			break;
		}

		const rawToken = filterMatch[2];
		const tokenStart = filterMatch.index + filterMatch[1].length;
		const precedingText = search.slice(cursor, tokenStart);
		let textMatch: RegExpExecArray | null;

		while (true) {
			textMatch = MAIL_SEARCH_TEXT_TOKEN_PATTERN.exec(precedingText);

			if (!textMatch) {
				break;
			}

			tokens.push(
				createMailSearchToken({
					rawToken: textMatch[0],
					start: cursor + textMatch.index,
				})
			);
		}

		tokens.push(
			parseMailSearchFilterToken({ rawToken, start: tokenStart }) ??
				createMailSearchToken({ rawToken, start: tokenStart })
		);

		cursor = tokenStart + rawToken.length;
		MAIL_SEARCH_TEXT_TOKEN_PATTERN.lastIndex = 0;
	}

	const trailingText = search.slice(cursor);
	let trailingTextMatch: RegExpExecArray | null;

	while (true) {
		trailingTextMatch = MAIL_SEARCH_TEXT_TOKEN_PATTERN.exec(trailingText);

		if (!trailingTextMatch) {
			break;
		}

		tokens.push(
			createMailSearchToken({
				rawToken: trailingTextMatch[0],
				start: cursor + trailingTextMatch.index,
			})
		);
	}

	MAIL_SEARCH_FILTER_TOKEN_PATTERN.lastIndex = 0;
	MAIL_SEARCH_TEXT_TOKEN_PATTERN.lastIndex = 0;

	return tokens;
};

const matchMailSearchClassificationLabel = ({
	startIndex,
	tokens,
}: {
	startIndex: number;
	tokens: Array<MailSearchFilter | MailSearchTextToken>;
}) => {
	for (const candidate of MAIL_SEARCH_CLASSIFICATION_LABEL_TERMS) {
		const matchesCandidate = candidate.terms.every((term, termIndex) => {
			const token = tokens[startIndex + termIndex];

			return (
				token?.type === "text" &&
				!isQuotedMailSearchTextToken({ value: token.rawToken }) &&
				getNormalizedMailSearchTextTerm({ value: token.rawToken }).toLowerCase() === term
			);
		});

		if (matchesCandidate) {
			return {
				label: candidate.label,
				tokenCount: candidate.terms.length,
			};
		}
	}

	return null;
};

const isMailSearchOperatorBoundaryToken = ({ token }: { token?: MailSearchFilter | MailSearchTextToken }) => {
	if (!token || token.type === "filter") {
		return true;
	}

	if (isQuotedMailSearchTextToken({ value: token.rawToken })) {
		return false;
	}

	const normalizedToken = getNormalizedMailSearchTextTerm({ value: token.rawToken }).toLowerCase();

	return (
		normalizedToken === "is" ||
		normalizedToken === "has" ||
		normalizedToken === "with" ||
		MAIL_SEARCH_NEGATION_TOKENS.has(normalizedToken) ||
		MAIL_SEARCH_LOCAL_OPERATOR_TOKENS.has(normalizedToken) ||
		MAIL_SEARCH_LOCAL_VALUE_OPERATORS.has(normalizedToken)
	);
};

const getMailSearchLocalValue = ({
	operator,
	startIndex,
	tokens,
}: {
	operator: string;
	startIndex: number;
	tokens: Array<MailSearchFilter | MailSearchTextToken>;
}) => {
	const valueTokens: string[] = [];

	for (let tokenIndex = startIndex; tokenIndex < tokens.length; tokenIndex += 1) {
		const token = tokens[tokenIndex];

		if (!token || token.type !== "text") {
			break;
		}

		if (isMailSearchOperatorBoundaryToken({ token })) {
			if (!valueTokens.length) {
				return null;
			}

			break;
		}

		valueTokens.push(getNormalizedMailSearchTextTerm({ value: token.rawToken }));

		if (MAIL_SEARCH_SINGLE_TOKEN_VALUE_OPERATORS.has(operator)) {
			break;
		}
	}

	const value = valueTokens.join(" ").trim();

	if (!value) {
		return null;
	}

	return {
		tokenCount: valueTokens.length,
		value,
	};
};

export const getMailSearchTextTerms = ({ search }: { search: string }) => {
	return parseMailSearchTokens({ search })
		.filter((token): token is MailSearchTextToken => token.type === "text")
		.map((token) => getNormalizedMailSearchTextTerm({ value: token.rawToken }).toLowerCase())
		.filter(Boolean);
};

export const rewriteMailSearchQueryLocally = ({ search }: { search: string }) => {
	const tokens = parseMailSearchTokens({ search });
	const rewrittenParts: string[] = [];

	for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
		const currentToken = tokens[tokenIndex];

		if (currentToken.type === "filter") {
			rewrittenParts.push(currentToken.normalizedToken);
			continue;
		}

		const normalizedCurrentToken = getNormalizedMailSearchTextTerm({
			value: currentToken.rawToken,
		}).toLowerCase();
		const nextToken = tokens[tokenIndex + 1];
		const isCurrentTokenQuoted = isQuotedMailSearchTextToken({ value: currentToken.rawToken });

		if (
			!isCurrentTokenQuoted &&
			nextToken?.type === "text" &&
			(normalizedCurrentToken === "has" || normalizedCurrentToken === "with") &&
			(getNormalizedMailSearchTextTerm({ value: nextToken.rawToken }).toLowerCase() === "attachment" ||
				getNormalizedMailSearchTextTerm({ value: nextToken.rawToken }).toLowerCase() === "attachments")
		) {
			rewrittenParts.push("has:attachment");
			tokenIndex += 1;
			continue;
		}

		if (!isCurrentTokenQuoted && MAIL_SEARCH_NEGATION_TOKENS.has(normalizedCurrentToken)) {
			const classificationLabelMatch = matchMailSearchClassificationLabel({
				startIndex: tokenIndex + 1,
				tokens,
			});

			if (classificationLabelMatch) {
				const formattedLabel = formatMailSearchTerm({ value: classificationLabelMatch.label });

				rewrittenParts.push(`-label:${formattedLabel ?? classificationLabelMatch.label}`);
				tokenIndex += classificationLabelMatch.tokenCount;
				continue;
			}
		}

		const localValue = getMailSearchLocalValue({
			operator: normalizedCurrentToken,
			startIndex: tokenIndex + 1,
			tokens,
		});

		if (
			!isCurrentTokenQuoted &&
			localValue &&
			(normalizedCurrentToken === "is" || MAIL_SEARCH_LOCAL_VALUE_OPERATORS.has(normalizedCurrentToken))
		) {
			const formattedValue = formatMailSearchTerm({ value: localValue.value });

			if (formattedValue) {
				rewrittenParts.push(`${normalizedCurrentToken}:${formattedValue}`);
				tokenIndex += localValue.tokenCount;
				continue;
			}
		}

		const mappedToken = isCurrentTokenQuoted ? null : MAIL_SEARCH_LOCAL_OPERATOR_TOKENS.get(normalizedCurrentToken);

		if (mappedToken) {
			rewrittenParts.push(mappedToken);
			continue;
		}

		rewrittenParts.push(currentToken.rawToken);
	}

	return {
		query: rewrittenParts.join(" ").trim(),
	};
};

export const parseMailSearchQuery = ({ search }: { search: string }) => {
	const tokens = parseMailSearchTokens({ search });
	const filters = tokens.filter((token): token is MailSearchFilter => token.type === "filter");

	return {
		filters,
		query: tokens
			.map((token) => (token.type === "filter" ? token.normalizedToken : token.rawToken))
			.join(" ")
			.trim(),
	};
};

export const hasNegativeMailClassificationLabelFilter = ({ search }: { search: string }) => {
	return parseMailSearchQuery({ search }).filters.some(
		(filter) =>
			filter.operator === "label" &&
			filter.negated &&
			MAIL_SEARCH_CLASSIFICATION_LABEL_TERMS.some((candidate) => candidate.label === filter.value.toLowerCase())
	);
};

export const buildMailSearchQuery = ({ search }: { search: string }) => {
	return parseMailSearchQuery({ search: rewriteMailSearchQueryLocally({ search }).query }).query;
};

export const removeMailSearchFilter = ({ filter, search }: { filter: MailSearchFilter; search: string }) => {
	return `${search.slice(0, filter.start).trimEnd()} ${search.slice(filter.end).trimStart()}`.trim();
};
