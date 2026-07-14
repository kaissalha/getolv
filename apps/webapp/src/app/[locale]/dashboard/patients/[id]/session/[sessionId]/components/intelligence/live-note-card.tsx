"use client";

import { FileTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatCopyCard } from "@/app/[locale]/dashboard/patients/[id]/components/patient-card-copy";

import { IntelligenceCard } from "./intelligence-card";

type LiveNoteCardProps = {
	text: string;
	loading?: boolean;
};

export const LiveNoteCard = ({ text, loading }: LiveNoteCardProps) => {
	const t = useTranslations("sessionIntelligence");
	const getCopyValue = () =>
		formatCopyCard({
			title: t("liveNote"),
			sections: [text || t("liveNotePlaceholder")],
		});

	return (
		<IntelligenceCard
			title={t("liveNote")}
			icon={<FileTextIcon className='size-4' />}
			loading={loading}
			className='h-full min-h-0 w-full'
			getCopyValue={getCopyValue}
		>
			{text.length ? (
				<p className='min-w-0 text-pretty text-sm leading-relaxed text-foreground/90'>{text}</p>
			) : (
				<p className='text-sm text-muted-foreground'>{t("liveNotePlaceholder")}</p>
			)}
		</IntelligenceCard>
	);
};
