import type { ThreadItemData } from "./mail-thread-item";

export type MailThreadSection = { key: string; threads: ThreadItemData[] };

export const groupMailThreadsByDate = ({ threads }: { threads: ThreadItemData[] }) => {
	const now = new Date();
	const todayStr = now.toDateString();
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toDateString();
	const sevenDaysAgo = new Date(now);
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const sections = threads.reduce<{
		last7Days: ThreadItemData[];
		older: ThreadItemData[];
		today: ThreadItemData[];
		yesterday: ThreadItemData[];
	}>(
		(acc, thread) => {
			const date = new Date(thread.receivedOn);
			const dateString = date.toDateString();

			if (dateString === todayStr) {
				acc.today.push(thread);
				return acc;
			}

			if (dateString === yesterdayStr) {
				acc.yesterday.push(thread);
				return acc;
			}

			if (date >= sevenDaysAgo) {
				acc.last7Days.push(thread);
				return acc;
			}

			acc.older.push(thread);
			return acc;
		},
		{ last7Days: [], older: [], today: [], yesterday: [] }
	);

	return [
		sections.today.length > 0 ? { key: "today", threads: sections.today } : null,
		sections.yesterday.length > 0 ? { key: "yesterday", threads: sections.yesterday } : null,
		sections.last7Days.length > 0 ? { key: "last7Days", threads: sections.last7Days } : null,
		sections.older.length > 0 ? { key: "older", threads: sections.older } : null,
	].filter((section): section is MailThreadSection => section !== null);
};
