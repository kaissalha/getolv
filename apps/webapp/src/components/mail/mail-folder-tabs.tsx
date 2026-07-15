"use client";

import { useTranslations } from "next-intl";

import type { MailFolder } from "@/hooks/use-mail-state";
import { Tabs, TabsList, TabsTrigger } from "@getolv/ui/components/tabs";

const FOLDERS: MailFolder[] = ["inbox", "sent", "drafts", "starred", "trash"];

type MailFolderTabsProps = {
	activeFolder: MailFolder;
	onFolderChange: (folder: string | null) => void;
	counts?: Partial<Record<MailFolder, number>>;
};

export const MailFolderTabs = ({ activeFolder, onFolderChange, counts }: MailFolderTabsProps) => {
	const t = useTranslations("mail.folders");

	return (
		<Tabs value={activeFolder} onValueChange={onFolderChange}>
			<TabsList>
				{FOLDERS.map((folder) => (
					<TabsTrigger key={folder} value={folder}>
						{t(folder)}
						{counts?.[folder] != null && counts[folder] > 0 && (
							<span className='ms-1.5 text-xs text-muted-foreground'>({counts[folder]})</span>
						)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
};
