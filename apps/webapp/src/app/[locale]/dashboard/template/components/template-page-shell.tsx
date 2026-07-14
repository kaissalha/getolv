"use client";

import Image from "next/image";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Skeleton } from "@starter/ui/components/skeleton";
import { Spinner } from "@starter/ui/components/spinner";

import { TemplateGallery } from "./template-gallery";
import { TemplatePageHeader } from "./template-page-header";
import { useTemplateLogoUploadController } from "./use-template-logo-upload-controller";

const TemplateLogoTileSkeleton = () => {
	return <Skeleton className='rounded-2xl' style={{ width: 280, height: 260 }} />;
};

const TemplateLogoTile = ({
	canUpload,
	isUploading,
	logoUrl,
	onPress,
}: {
	canUpload: boolean;
	isUploading: boolean;
	logoUrl?: string;
	onPress: () => void;
}) => {
	const t = useTranslations("dashboard.template");
	const actionLabel = isUploading ? t("logo.uploading") : logoUrl ? t("logo.replace") : t("logo.upload");

	const cardContent = (
		<>
			<div className='relative flex flex-1 items-center justify-center'>
				{logoUrl ? (
					<>
						<Image
							src={logoUrl}
							alt={t("logo.alt")}
							width={640}
							height={320}
							unoptimized
							className='h-auto max-h-28 w-auto max-w-full object-contain'
						/>
						{isUploading ? (
							<div className='absolute inset-0 flex items-center justify-center bg-white/35 backdrop-blur-sm'>
								<Spinner className='size-8 text-black/55' />
							</div>
						) : null}
					</>
				) : isUploading ? (
					<Spinner className='size-8 text-black/55' />
				) : (
					<PlusIcon aria-hidden className='size-10 text-black/50' />
				)}
			</div>
			<div className='bg-linear-to-b from-stone-100/60 to-stone-50 px-3 py-3 text-start backdrop-blur-sm'>
				<span className='text-sm font-medium text-black/55'>{t("logo.title")}</span>
			</div>
		</>
	);

	if (!canUpload) {
		return (
			<div className='bg-black/3 flex flex-col overflow-clip rounded-2xl' style={{ width: 280, height: 260 }}>
				{cardContent}
			</div>
		);
	}

	return (
		<button
			type='button'
			onClick={onPress}
			disabled={isUploading}
			aria-label={actionLabel}
			className='bg-black/3 flex flex-col overflow-clip rounded-2xl text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-100'
			style={{ width: 280, height: 260 }}
		>
			{cardContent}
		</button>
	);
};

export const TemplatePageShell = () => {
	const { canUploadLogo, fileInputRef, handleLogoFileChange, handleLogoTilePress, isPending, isUploading, logoUrl } =
		useTemplateLogoUploadController();

	return (
		<>
			<TemplatePageHeader />

			<div className='min-h-0 flex-1 overflow-y-auto flex w-full flex-col px-4 pb-10 md:px-5'>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					className='sr-only'
					onChange={handleLogoFileChange}
					tabIndex={-1}
				/>
				{isPending ? (
					<TemplateLogoTileSkeleton />
				) : (
					<TemplateLogoTile
						canUpload={canUploadLogo}
						isUploading={isUploading}
						logoUrl={logoUrl}
						onPress={handleLogoTilePress}
					/>
				)}
				<TemplateGallery />
			</div>
		</>
	);
};
