"use client";

import { useCallback } from "react";

import { LayoutTemplateIcon, LogOutIcon, SettingsIcon, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSettings } from "@/hooks/use-settings";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@getolv/ui/components/sidebar";
import { useHydrated } from "@getolv/ui/hooks/use-hydrated";

import { useIsMenuItemActive } from "./utils/use-is-menu-item-active";

type ActionMenuItem = {
	key: string;
	title: string;
	kind: "action";
	onClick: () => void | Promise<void>;
	icon: LucideIcon;
};

type LinkMenuItem = {
	key: string;
	title: string;
	kind: "link";
	href: string;
	icon: LucideIcon;
	exactMatch?: boolean;
};

type MenuItem = ActionMenuItem | LinkMenuItem;

export const NavSecondary = () => {
	const t = useTranslations();
	const { isMobile, setOpenMobile } = useSidebar("navigation");
	const isHydrated = useHydrated();
	const router = useRouter();
	const [, setActiveSetting] = useSettings();
	const { isMenuItemActive } = useIsMenuItemActive();

	const items: MenuItem[] = [
		{
			key: "template",
			title: t("breadcrumbs.template"),
			kind: "link",
			href: "/dashboard/template",
			icon: LayoutTemplateIcon,
		},
		{
			key: "settings",
			title: t("breadcrumbs.settings"),
			kind: "action",
			onClick: () => setActiveSetting("list"),
			icon: SettingsIcon,
		},
		{
			key: "logout",
			title: t("account.logout"),
			kind: "action",
			onClick: async () => {
				await authClient.signOut();
				router.push("/login");
			},
			icon: LogOutIcon,
		},
	];

	const handleActionItemClick = useCallback(
		(item: ActionMenuItem) => {
			void item.onClick();
			if (isMobile) {
				setOpenMobile(false);
			}
		},
		[isMobile, setOpenMobile]
	);

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					if (item.kind === "link") {
						return (
							<Link href={item.href} key={item.key}>
								<SidebarMenuItem>
									<SidebarMenuButton
										tooltip={item.title}
										isActive={isMenuItemActive(item.href, item.exactMatch)}
										onClick={() => setOpenMobile(false)}
									>
										<item.icon />
										{isMobile && isHydrated && <span>{item.title}</span>}
									</SidebarMenuButton>
								</SidebarMenuItem>
							</Link>
						);
					}

					return (
						<SidebarMenuItem key={item.key}>
							<SidebarMenuButton tooltip={item.title} onClick={() => handleActionItemClick(item)}>
								<item.icon />
								{isMobile && isHydrated && <span>{item.title}</span>}
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
};
