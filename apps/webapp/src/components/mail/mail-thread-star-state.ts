"use client";

export const getMailThreadStarLabelIds = ({ isStarred, labelIds }: { isStarred: boolean; labelIds: string[] }) => {
	if (!isStarred) {
		return labelIds.filter((labelId) => labelId !== "STARRED");
	}

	if (labelIds.includes("STARRED")) {
		return labelIds;
	}

	return [...labelIds, "STARRED"];
};

export const patchMailThreadStarState = <Thread extends { isStarred: boolean; labelIds: string[] }>({
	isStarred,
	thread,
}: {
	isStarred: boolean;
	thread: Thread;
}) => ({
	...thread,
	isStarred,
	labelIds: getMailThreadStarLabelIds({ isStarred, labelIds: thread.labelIds }),
});
