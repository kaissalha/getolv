import { describe, expect, it } from "vitest";

import { patchThreadClassificationInQueryData } from "@/components/mail/mail-thread-classification";

const classificationLabel = {
	backgroundColor: "#f2b2a8",
	id: "to respond",
	name: "to respond",
	textColor: "#8a1c0a",
};

describe("mail thread classification cache helpers", () => {
	it("patches streamed thread list chunks", () => {
		const data = [
			{
				page: {
					connectionEmail: "owner@example.com",
					connectionId: "conn-1",
					nextPageToken: null,
					threads: [
						{
							classificationLabel: null,
							id: "thread-1",
							isStarred: false,
							isUnread: true,
							labelIds: [],
							receivedOn: "2026-04-22T12:00:00.000Z",
							sender: {
								email: "sender@example.com",
							},
							snippet: "Need your reply",
							subject: "Follow-up",
						},
					],
				},
				type: "threads",
			},
		];

		expect(
			patchThreadClassificationInQueryData({
				classificationLabel,
				data,
				labelIds: ["to respond"],
				threadId: "thread-1",
			})
		).toEqual([
			{
				page: {
					connectionEmail: "owner@example.com",
					connectionId: "conn-1",
					nextPageToken: null,
					threads: [
						{
							classificationLabel,
							id: "thread-1",
							isStarred: false,
							isUnread: true,
							labelIds: ["to respond"],
							receivedOn: "2026-04-22T12:00:00.000Z",
							sender: {
								email: "sender@example.com",
							},
							snippet: "Need your reply",
							subject: "Follow-up",
						},
					],
				},
				type: "threads",
			},
		]);
	});
});
