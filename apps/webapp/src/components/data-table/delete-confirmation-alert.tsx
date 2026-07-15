import { useTranslations } from "next-intl";

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@getolv/ui/components/alert-dialog";
import { Button } from "@getolv/ui/components/button";

export const DeleteConfirmationAlert = ({
	totalSelected,
	open,
	setOpen,
	onConfirm,
}: {
	totalSelected: number;
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: () => void;
}) => {
	const t = useTranslations("components.table");

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("delete.title", { count: totalSelected })}</AlertDialogTitle>
					<AlertDialogDescription>{t("delete.description", { count: totalSelected })}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button variant='secondary'>{t("delete.cancel")}</Button>} />
					<AlertDialogClose
						onClick={onConfirm}
						render={<Button variant='destructive'>{t("delete.confirm")}</Button>}
					/>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
