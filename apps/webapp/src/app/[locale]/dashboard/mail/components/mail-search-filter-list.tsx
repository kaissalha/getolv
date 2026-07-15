"use client";

import { XIcon } from "lucide-react";

import type { MailSearchFilter } from "@/components/mail/mail-search-query";
import { Button } from "@getolv/ui/components/button";

type MailSearchFilterListProps = {
	filters: MailSearchFilter[];
	onRemoveFilter: ({ filter }: { filter: MailSearchFilter }) => void;
};

export const MailSearchFilterList = ({ filters, onRemoveFilter }: MailSearchFilterListProps) => {
	if (!filters.length) {
		return null;
	}

	return (
		<div className='flex flex-wrap items-center gap-2 border-t px-4 pb-3 md:px-5'>
			{filters.map((filter) => (
				<Button
					key={`${filter.start}-${filter.end}`}
					type='button'
					variant='secondary'
					size='xs'
					title={filter.displayToken}
					onClick={() => onRemoveFilter({ filter })}
					className='max-w-full font-normal'
				>
					<span className='truncate font-mono text-xs'>{filter.displayToken}</span>
					<XIcon className='size-3.5 shrink-0' aria-hidden />
				</Button>
			))}
		</div>
	);
};
