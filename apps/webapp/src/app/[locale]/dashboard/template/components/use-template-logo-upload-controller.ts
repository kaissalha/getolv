"use client";

import type { ChangeEvent } from "react";
import { useCallback, useReducer, useRef } from "react";

import { useTranslations } from "next-intl";

import { authClient } from "@/lib/auth-client";
import { uploadFromClient } from "@/lib/storage";
import { toast } from "@getolv/ui/components/sonner";

type TemplateLogoUploadState = {
	isUploading: boolean;
	optimisticLogo: {
		organizationId: string;
		url: string;
	} | null;
};

type TemplateLogoUploadAction =
	| { type: "set-uploading"; value: boolean }
	| { type: "set-optimistic-logo"; organizationId: string; url: string };

const maxLogoFileSizeMb = 10;

const templateLogoUploadReducer = (
	state: TemplateLogoUploadState,
	action: TemplateLogoUploadAction
): TemplateLogoUploadState => {
	switch (action.type) {
		case "set-uploading":
			return {
				...state,
				isUploading: action.value,
			};
		case "set-optimistic-logo":
			return {
				...state,
				optimisticLogo: {
					organizationId: action.organizationId,
					url: action.url,
				},
			};
		default:
			return state;
	}
};

export const useTemplateLogoUploadController = () => {
	const t = useTranslations("dashboard.template");
	const tCommon = useTranslations("common");
	const { data: activeOrganization, isPending: isOrganizationPending } = authClient.useActiveOrganization();
	const { data: activeMember, isPending: isMemberPending } = authClient.useActiveMember();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [state, dispatch] = useReducer(templateLogoUploadReducer, {
		isUploading: false,
		optimisticLogo: null,
	});

	const role = activeMember?.role;
	const hasOrganizationUpdateRole = role === "admin" || role === "member" || role === "owner";
	const canUploadLogo =
		!!activeOrganization &&
		hasOrganizationUpdateRole &&
		authClient.organization.checkRolePermission({
			permissions: { organization: ["update"] },
			role,
		});

	const optimisticLogo = state.optimisticLogo;
	const logoUrl =
		optimisticLogo && optimisticLogo.organizationId === activeOrganization?.id
			? optimisticLogo.url
			: activeOrganization?.logo?.trim() || undefined;

	const handleLogoTilePress = useCallback(() => {
		if (!canUploadLogo || state.isUploading) {
			return;
		}

		fileInputRef.current?.click();
	}, [canUploadLogo, state.isUploading]);

	const handleLogoFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const input = event.currentTarget;
			const file = input.files?.[0];
			input.value = "";

			if (!file || !activeOrganization || !canUploadLogo) {
				return;
			}

			if (file.type.length > 0 && !file.type.startsWith("image/")) {
				toast.error(t("logo.errors.invalidType"));
				return;
			}

			if (file.size > maxLogoFileSizeMb * 1024 * 1024) {
				toast.error(t("logo.errors.tooLarge", { size: maxLogoFileSizeMb }));
				return;
			}

			dispatch({ type: "set-uploading", value: true });

			const sanitizedFileName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "logo";

			try {
				const blob = await uploadFromClient({
					pathname: `organizations/${activeOrganization.id}/logos/${sanitizedFileName}`,
					file,
					handleUploadUrl: "/api/media",
					payload: {
						organizationId: activeOrganization.id,
						access: "public",
						maxFileSizeMb: maxLogoFileSizeMb,
					},
				});

				const adjustResponse = await fetch("/api/media/auto-adjust-logo", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						organizationId: activeOrganization.id,
						sourceImageUrl: blob.url,
					}),
				});

				let logoUrlToSave = blob.url;

				if (adjustResponse.ok) {
					const adjusted = (await adjustResponse.json()) as { url?: string };
					if (typeof adjusted.url === "string" && adjusted.url.length > 0) {
						logoUrlToSave = adjusted.url;
					}
				} else {
					const payload = (await adjustResponse.json().catch(() => null)) as {
						error?: { message?: string };
					} | null;
					const serverMessage = payload?.error?.message;
					toast.error(t("logo.errors.autoAdjustFailed"), {
						description: typeof serverMessage === "string" ? serverMessage : undefined,
					});
				}

				const result = await authClient.organization
					.update({
						data: {
							logo: logoUrlToSave,
						},
						organizationId: activeOrganization.id,
					})
					.catch(() => null);

				if (!result) {
					toast.error(t("logo.errors.uploadFailed"));
					return;
				}

				if (result.error) {
					if (result.error.code === "YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION") {
						toast.error(t("logo.errors.forbidden"));
						return;
					}

					toast.error(t("logo.errors.uploadFailed"));
					return;
				}

				dispatch({
					type: "set-optimistic-logo",
					organizationId: activeOrganization.id,
					url: logoUrlToSave,
				});
				toast.success(tCommon("saved"));
			} catch (error) {
				toast.error(t("logo.errors.uploadFailed"), {
					description: error instanceof Error ? error.message : undefined,
				});
			} finally {
				dispatch({ type: "set-uploading", value: false });
			}
		},
		[activeOrganization, canUploadLogo, t, tCommon]
	);

	return {
		canUploadLogo,
		fileInputRef,
		handleLogoFileChange,
		handleLogoTilePress,
		isPending: isOrganizationPending || isMemberPending,
		isUploading: state.isUploading,
		logoUrl,
	};
};
