import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Block, Button, Icon, Link, List, Text } from "~/components/primitive";
import { AuthService, withAuthComponent } from "~/features/auth";
import { I18nService, useTranslation } from "~/features/i18n";
import { renderIf } from "~/hocs";
import { useClickOutside, useDidMount, useEnhancedState } from "~/hooks";
import v from "~/lib/v";
import { useStoreSelector } from "~/stores";
import { selectWebsiteMetadata, T_WebsiteMetadata } from "~/stores/modules/metadata";
import { ROUTES, T_RoutesValues } from "~/features/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import { deletePWACache, isPWA } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";
import type { T_ReactChildren, T_ReactElement } from "~/types";

function Header(): T_ReactElement {
	return (
		<Block
			is="header"
			className="tw-relative tw-py-8"
		>
			<Block className="tw-text-center">
				<Link
					variant={Link.variant.SECONDARY}
					href={ROUTES.HOME}
					className="tw-border-b-2 tw-border-dotted dfr-border-color-bw"
				>
					DR TOOLS
				</Link>
				<Block className="tw-mt-2">
					<MainMenu />
				</Block>
			</Block>

			<Block className="tw-absolute tw-right-0 tw-top-8">
				<SettingsMenu />
			</Block>
		</Block>
	);
}

export default Header;

// --- COMPONENTS ---

type T_MainMenuItem = {
	label: string;
	url: T_RoutesValues;
};

function MainMenu(): T_ReactElement {
	// --- HOOKS ---
	const { currentLocale } = useTranslation();
	const { pathname, asPath } = useRouter();

	// --- STATES & REFS ---
	const [items, setItems] = React.useState<T_MainMenuItem[]>(createItems());
	const [showMenu, setShowMenu] = React.useState(false);
	const menuRef = React.useRef<HTMLDivElement>(null);

	// --- EFFECTS ---
	useClickOutside(menuRef, () => {
		setShowMenu(false);
	});

	React.useEffect(() => {
		const translator = I18nService.getInstance();

		setItems([
			...createItems(),
			...(AuthService.isUserLoggedIn()
				? [
						{
							label: translator.t("layout:header:common:menu_item_personal"),
							url: ROUTES.PERSONAL,
						},
				  ]
				: isPWA()
				? [
						{
							label: translator.t("layout:header:menu:sign_in"),
							url: ROUTES.SIGN_IN,
						},
				  ]
				: []),
		]);
	}, [currentLocale]);

	// --- HANDLERS ---
	function handleToggleMenuClick(): void {
		setShowMenu((currentValue) => !currentValue);
	}

	function handleHideMenuClick(): void {
		setShowMenu((currentValue) => !currentValue);
	}

	// --- UTILS ---
	function createItems(): T_MainMenuItem[] {
		const translator = I18nService.getInstance();

		return [
			{
				label: translator.t("layout:header:menu:home"),
				url: ROUTES.HOME,
			},
			{
				label: translator.t("layout:header:common:menu_item_blog"),
				url: ROUTES.BLOG,
			},
			{
				label: translator.t("layout:header:menu:music"),
				url: ROUTES.MUSIC,
			},
		];
	}

	return (
		<Block
			className="tw-relative tw-inline-block print:tw-hidden"
			ref={menuRef}
		>
			<Button
				variant={Button.variant.SIMPLE}
				onClick={handleToggleMenuClick}
			>
				<Icon
					icon={Icon.icon.CHEVRON_DOWN}
					size={32}
				/>
			</Button>

			{showMenu ? (
				<List className="tw-absolute tw-left-[-65px] tw-top-full tw-z-40 tw-block tw-w-40 tw-overflow-hidden dfr-shadow">
					{items.map((item) => {
						const isLinkActive =
							pathname === item.url ||
							asPath === item.url ||
							(v.isNotEquals(item.url, ROUTES.HOME) && pathname.startsWith(item.url));

						return (
							<List.Item
								key={generateSlug(item.label)}
								className="tw-border-b dfr-border-color-primary dfr-bg-color-wb last:tw-border-0"
								onClick={handleHideMenuClick}
							>
								<Link
									variant={Link.variant.SIMPLE}
									href={item.url}
									className={classNames(
										"tw-block tw-px-2 tw-py-1 tw-text-center tw-text-sm hover:tw-font-bold",
										isLinkActive && "tw-font-bold",
									)}
								>
									{item.label}
								</Link>
							</List.Item>
						);
					})}
				</List>
			) : null}
		</Block>
	);
}

const SettingsMenu = withAuthComponent(function SettingsMenu(): T_ReactElement {
	// --- STATES & REFS ---
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [showMenu, setShowMenu, toggleShowMenu] = useEnhancedState(false);

	// --- EFFECTS ---
	useClickOutside(menuRef, () => {
		setShowMenu(false);
	});

	// --- HANDLERS ---
	function handleToggleShowMenuClick(): void {
		toggleShowMenu();
	}

	return (
		<Block
			className="tw-relative print:tw-hidden"
			ref={menuRef}
		>
			<Button
				variant={Button.variant.SIMPLE}
				onClick={handleToggleShowMenuClick}
			>
				<Icon
					icon={Icon.icon.COG}
					size={28}
				/>
			</Button>

			{showMenu ? (
				<List className="tw-absolute tw-right-0 tw-top-full tw-z-40 tw-mt-2 tw-w-48 tw-overflow-hidden dfr-shadow">
					{/* <ToggleThemeMenuItem /> */}
					<RefreshAPPMenuItem />
					<EnvironmentMenuItem />
				</List>
			) : null}
		</Block>
	);
});

/*
function ToggleThemeMenuItem(): T_ReactElement {
	// --- HOOKS ---
	const { t } = useTranslation();
	const { theme, setTheme } = useTheme();

	// --- VARS ---
	const isDarkMode = theme === "dark";

	// --- HANDLERS ---
	function handleToggleThemeClick(): void {
		setTheme(isDarkMode ? "light" : "dark");
	}

	return (
		<SettingsMenuItem title={t("layout:header:settings:theme")}>
			<Button
				variant={Button.variant.SIMPLE}
				disabled={v.isNotTrue(isDarkMode)}
				className={classNames(
					"tw-border-dashed tw-border-yellow-600 tw-py-0.5",
					v.isNotTrue(isDarkMode) && "tw-border-b",
				)}
				onClick={handleToggleThemeClick}
			>
				<Icon
					icon={Icon.icon.SUN}
					color="tw-text-yellow-600"
					size={18}
				/>
			</Button>
			<Space
				orientation="v"
				size={1}
			/>
			<Button
				variant={Button.variant.SIMPLE}
				disabled={isDarkMode}
				className={classNames(
					"tw-border-dashed tw-border-indigo-700 tw-py-0.5 dark:tw-border-indigo-300",
					isDarkMode && "tw-border-b",
				)}
				onClick={handleToggleThemeClick}
			>
				<Icon
					icon={Icon.icon.MOON}
					color="tw-text-indigo-700 dark:tw-text-indigo-300"
					size={18}
				/>
			</Button>
		</SettingsMenuItem>
	);
}
*/

const RefreshAPPMenuItem = renderIf(function RefreshAPPMenuItem() {
	// --- HANDLERS ---
	async function handleRefreshClick(): Promise<void> {
		await deletePWACache();
		window.location.reload();
	}

	return (
		<SettingsMenuItem title="Refresh APP and Cache">
			<Button
				variant={Button.variant.SIMPLE}
				onClick={handleRefreshClick}
			>
				<Icon icon={Icon.icon.REFRESH} />
			</Button>
		</SettingsMenuItem>
	);
})(() => AuthService.isUserLoggedIn() && isPWA());

const EnvironmentMenuItem = withAuthComponent(function EnvironmentMenuItem() {
	// --- HOOKS ---
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

	// --- STATES & REFS ---
	const [url, setUrl] = React.useState("/");

	// --- EFFECTS ---
	useDidMount(() => {
		setUrl(
			isDevelopmentEnvironment()
				? `${WEBSITE_METADATA.url}${window.location.pathname}`
				: `http://localhost:3000${window.location.pathname}`,
		);
	});

	return (
		<SettingsMenuItem title={`Open in "${isDevelopmentEnvironment() ? "prod" : "dev"}"`}>
			<Link
				variant={Link.variant.SIMPLE}
				href={url}
				isExternalLink
			>
				<Icon icon={Icon.icon.EXTERNAL_LINK} />
			</Link>
		</SettingsMenuItem>
	);
});

type T_SettingsMenuItemProps = {
	children: T_ReactChildren;
	title: string;
	className?: string;
};

function SettingsMenuItem({
	children,
	title,
	className = "",
}: T_SettingsMenuItemProps): T_ReactElement {
	return (
		<List.Item
			className={classNames(
				"tw-flex tw-h-8 tw-items-center tw-justify-between tw-border-b tw-px-2 dfr-border-color-primary dfr-bg-color-wb last:tw-border-0",
				className,
			)}
		>
			<Text className="tw-text-right tw-text-xs">{title}</Text>
			<Block className="tw-text-right tw-leading-none">{children}</Block>
		</List.Item>
	);
}
