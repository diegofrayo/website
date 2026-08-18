import { forwardRef } from "react";
import { NavigationMenu as BaseUINavigationMenu } from "@base-ui/react/navigation-menu";

import cn from "@diegofrayo-pkg/cn";
import { useBoolean } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { Box, Button, Icon, InlineText, Link, List, Title } from "~/components/primitive";
import { IconCatalog, type IconName } from "~/components/primitive/icon";
import { WEBSITE_METADATA } from "~/constants";
import AnalyticsService from "~/features/analytics";
import { Routes, useRouting } from "~/features/routing";

type HeaderProps = {
	height: number;
};

function Header({ height }: HeaderProps) {
	// --- STYLES ---
	const classes = {
		container: cn(
			"fixed z-40 flex w-full bg-white p-4 shadow-md",
			"sm:relative sm:h-auto sm:shadow-none",
			"print:hidden",
		),
	};

	return (
		<Box
			as="header"
			className={classes.container}
			style={{ height }}
		>
			<Box className="u-body-max-width mx-auto flex w-full items-center justify-between gap-4">
				<Title
					as="h1"
					variant={Title.variant.SIMPLE}
					className="flex shrink-0"
				>
					<Link
						variant={Link.variant.SMOOTH}
						href={Routes.INDEX}
						className="font-special block font-bold text-black"
						onClick={AnalyticsService.trackClickEvent("GENERAL|HEADER_LINK")}
					>
						{`@${WEBSITE_METADATA.username}`}
					</Link>
				</Title>

				<NavigationMenu />
			</Box>
		</Box>
	);
}

export default Header;

// --- COMPONENTS ---

function NavigationMenu() {
	return (
		<>
			<NavigationMenuDesktop className="hidden sm:flex" />
			<NavigationMenuMobile className="block sm:hidden" />
		</>
	);
}

function NavigationMenuDesktop({ className }: { className?: string }) {
	return <NavigationMenuList className={cn("flex justify-end gap-2", className)} />;
}

function NavigationMenuMobile({ className }: { className?: string }) {
	// --- STATE ---
	const { state: isMenuVisible, setTrue: showMenu, setFalse: closeMenu } = useBoolean(false);

	// --- HANDLERS ---
	function handleOpenMenuClick() {
		showMenu();
	}

	function handleCloseMenuClick() {
		closeMenu();
	}

	return (
		<Box className={cn(className)}>
			<Button onClick={handleOpenMenuClick}>
				<Icon
					icon={IconCatalog.MENU}
					size={24}
				/>
			</Button>

			{isMenuVisible && (
				<Box
					className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/85 backdrop-blur-sm"
					data-mobile-menu-open="true"
				>
					<Button
						className="absolute top-44 block w-full"
						onClick={handleCloseMenuClick}
					>
						<Icon
							color="text-white"
							icon={IconCatalog.X}
							size={32}
						/>
					</Button>
					<NavigationMenuList />
				</Box>
			)}
		</Box>
	);
}

function NavigationMenuList({ className }: { className?: string }) {
	return (
		<BaseUINavigationMenu.Root
			className={cn("w-full", className)}
			delay={0}
		>
			<BaseUINavigationMenu.List className="block px-4 text-center sm:flex sm:w-full sm:justify-end sm:gap-6 sm:px-0">
				<NavigationMenuItem
					href={Routes.BLOG}
					icon={IconCatalog.RSS}
				>
					Blog
				</NavigationMenuItem>
				<NavigationMenuItem
					href={Routes.RESUME}
					icon={IconCatalog.ID_CARD}
				>
					Resume
				</NavigationMenuItem>
				<NavigationMenuItem
					href={Routes.PORTFOLIO}
					icon={IconCatalog.CODE_XML}
				>
					Portfolio
				</NavigationMenuItem>
			</BaseUINavigationMenu.List>
		</BaseUINavigationMenu.Root>
	);
}

type NavigationMenuItemProps = {
	children: ReactTypes.Children;
	href: string;
	icon: IconName;
};

const NavigationMenuItem = forwardRef<HTMLAnchorElement, NavigationMenuItemProps>(
	function NavigationMenuItem({ children, href, icon }, forwardedRef) {
		// --- HOOKS ---
		const { isCurrentPathActive } = useRouting();

		// --- STYLES ---
		const classes = {
			item: cn(
				"inline-flex items-center justify-start font-bold text-zinc-500",
				"sm:font-normal sm:text-inherit sm:lowercase",
				{ "text-white sm:font-bold sm:text-black sm:underline": isCurrentPathActive(href) },
			),
		};

		return (
			<List.Item className="my-2 sm:my-0">
				<Link
					className="font-titles block px-1 text-left text-xl font-bold uppercase sm:text-right sm:text-base md:px-0"
					href={href}
					ref={forwardedRef}
					variant={Link.variant.SMOOTH}
					onClick={AnalyticsService.trackClickEvent("GENERAL|NAVIGATION_MENU", { item: href })}
				>
					<Box className={classes.item}>
						<Icon
							icon={icon}
							wrapperClassName="mr-2 sm:mr-1 sm:hidden"
							size={24}
						/>
						<InlineText>{children}</InlineText>
					</Box>
				</Link>
			</List.Item>
		);
	},
);
