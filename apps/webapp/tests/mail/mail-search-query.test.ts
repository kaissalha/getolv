import { describe, expect, it } from "vitest";

import {
	buildMailSearchQuery,
	parseMailSearchQuery,
	removeMailSearchFilter,
} from "@/components/mail/mail-search-query";

describe("mail search query helpers", () => {
	it("builds a Gmail query from free text and inline filter tokens", () => {
		const expectedAfter = String(Math.floor(new Date(2026, 3, 20).getTime() / 1000) - 1);
		const expectedBefore = String(Math.floor(new Date(2026, 3, 23).getTime() / 1000));

		expect(
			buildMailSearchQuery({
				search: 'vercel from:alerts@example.com subject:"domain renewal" is:unread is:starred has:attachment category:updates after:2026-04-20 before:2026-04-22',
			})
		).toBe(
			`vercel from:alerts@example.com subject:"domain renewal" is:unread is:starred has:attachment category:updates after:${expectedAfter} before:${expectedBefore}`
		);
	});

	it("parses supported Gmail operators into removable filters", () => {
		const { filters, query } = parseMailSearchQuery({
			search: 'follow-up from:alerts@example.com filename:pdf newer_than:7d label:"Care Team"',
		});

		expect(query).toBe('follow-up from:alerts@example.com filename:pdf newer_than:7d label:"Care Team"');
		expect(filters.map((filter) => filter.displayToken)).toEqual([
			"from:alerts@example.com",
			"filename:pdf",
			"newer_than:7d",
			"label:Care Team",
		]);
	});

	it("rewrites obvious natural mail intent into Gmail operators locally", () => {
		expect(
			buildMailSearchQuery({
				search: "unread from alerts@example.com with attachment",
			})
		).toBe("is:unread from:alerts@example.com has:attachment");
	});

	it("rewrites negated classification labels into Gmail label filters", () => {
		expect(
			buildMailSearchQuery({
				search: "flight not marketing",
			})
		).toBe("flight -label:marketing");
		expect(
			buildMailSearchQuery({
				search: "agenda not meeting update",
			})
		).toBe('agenda -label:"meeting update"');
	});

	it("keeps multi-word operator values together as a quoted phrase", () => {
		expect(
			buildMailSearchQuery({
				search: "subject quarterly review unread",
			})
		).toBe('subject:"quarterly review" is:unread');
		expect(
			buildMailSearchQuery({
				search: "label care team",
			})
		).toBe('label:"care team"');
	});

	it("preserves impossible after and before dates instead of rolling them forward", () => {
		expect(
			buildMailSearchQuery({
				search: "after:2026-02-31 before:2026-13-40",
			})
		).toBe("after:2026-02-31 before:2026-13-40");
	});

	it("removes an inline filter without disturbing the remaining query", () => {
		const search = 'follow-up from:alerts@example.com subject:"domain renewal"';
		const { filters } = parseMailSearchQuery({ search });
		const subjectFilter = filters.find((filter) => filter.operator === "subject");

		expect(subjectFilter).toBeDefined();
		expect(removeMailSearchFilter({ filter: subjectFilter!, search })).toBe("follow-up from:alerts@example.com");
	});
});
