import { useCallback, useMemo } from "react";

import { parseAsString, useQueryState } from "nuqs";

import { useMailSearchState } from "@/hooks/use-mail-search-state";

const MAIL_FOLDERS = ["inbox", "sent", "drafts", "starred", "trash"] as const;
export type MailFolder = (typeof MAIL_FOLDERS)[number];

type UseMailStateOptions = {
	defaultFolder?: MailFolder;
	defaultSearch?: string;
};

export const useMailState = ({ defaultFolder = "inbox", defaultSearch = "" }: UseMailStateOptions = {}) => {
	const [folder, setFolder] = useQueryState("folder", parseAsString.withDefault(defaultFolder));
	const searchState = useMailSearchState({ defaultSearch });

	const folderState = useMemo(
		() => ({
			folder: (MAIL_FOLDERS.includes(folder as MailFolder) ? folder : defaultFolder) as MailFolder,
			onFolderChange: setFolder,
		}),
		[folder, defaultFolder, setFolder]
	);

	const clearFilters = useCallback(() => {
		void setFolder(null);
		void searchState.onSearchChange(null);
	}, [searchState, setFolder]);

	return useMemo(
		() => ({
			folder: folderState,
			search: searchState,
			clearFilters,
		}),
		[folderState, searchState, clearFilters]
	);
};
