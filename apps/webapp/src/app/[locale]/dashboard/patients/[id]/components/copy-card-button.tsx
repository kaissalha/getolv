"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@starter/ui/components/button";
import { toast } from "@starter/ui/components/sonner";
import { useCopyToClipboard } from "@starter/ui/hooks/use-copy-to-clipboard";

type CopyCardButtonProps = {
	getValue: () => string;
};

export const CopyCardButton = ({ getValue }: CopyCardButtonProps) => {
	const tCommon = useTranslations("common");
	const { copyToClipboard, isCopied } = useCopyToClipboard({
		onCopy: () => {
			toast.success(tCommon("copiedToClipboard"));
		},
	});
	const label = isCopied ? tCommon("copiedToClipboard") : tCommon("copyToClipboard");

	return (
		<Button
			type='button'
			size='icon-xs'
			variant={isCopied ? "secondary" : "ghost"}
			onClick={() => copyToClipboard(getValue())}
			aria-label={label}
			title={label}
		>
			{isCopied ? <CheckIcon className='size-3.5' /> : <CopyIcon className='size-3.5' />}
		</Button>
	);
};
