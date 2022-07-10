import * as React from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Block, Button, Icon, Link, List, Text, Space } from "~/components/primitive";
import { AuthService } from "~/auth";
import { withAuthenticationRequired } from "~/hocs";
import { useClickOutside, useDidMount, useEnhancedState } from "~/hooks";
import { I18nService, useTranslation } from "~/i18n";
import http from "~/lib/http";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata, T_WebsiteMetadata } from "~/state/modules/metadata";
import { getErrorMessage, isDevelopmentEnvironment, reportError } from "~/utils/app";
import { deletePWACache, isPWA, showAlert } from "~/utils/browser";
import { ENV_VARS } from "~/utils/constants";
import { ROUTES, T_RoutesValues } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";
import { isNotEquals } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement } from "~/types";

function Header(): T_ReactElement {
	// hooks
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

	// render
	return (
		<Block
			is="header"
			className="tw-relative tw-py-8"
		>
			<Block className="tw-text-center">
				<Link
					variant={Link.variant.SECONDARY}
					href={ROUTES.HOME}
					className="tw-border-b-2 tw-border-dotted dfr-border-color-dark-strong dark:dfr-border-color-light-strong"
				>
					{WEBSITE_METADATA.username}
				</Link>
				<Block className="tw-mt-2">
					<MainMenu />
				</Block>
			</Block>

			<Block className="tw-absolute tw-top-7 tw-right-0">
				<SettingsMenu />
			</Block>
		</Block>
	);
}

export default Header;

// --- Components ---

type T_MainMenuItem = {
	label: string;
	url: T_RoutesValues;
};

function MainMenu(): T_ReactElement {
	// hooks
	const { currentLocale } = useTranslation();
	const { pathname, asPath } = useRouter();

	// states & refs
	const [items, setItems] = React.useState<T_MainMenuItem[]>(createItems());
	const [showMenu, setShowMenu] = React.useState(false);
	const menuRef = React.useRef<HTMLDivElement>(null);

	// effects
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
						{
							label: translator.t("layout:header:menu:sign_out"),
							url: ROUTES.SIGN_OUT,
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

	// handlers
	function handleToggleMenuClick(): void {
		setShowMenu((currentValue) => !currentValue);
	}

	function handleHideMenuClick(): void {
		setShowMenu((currentValue) => !currentValue);
	}

	// utils
	function createItems(): T_MainMenuItem[] {
		const translator = I18nService.getInstance();

		return [
			{
				label: translator.t("layout:header:menu:home"),
				url: ROUTES.HOME,
			},
			{
				label: translator.t("layout:header:menu:about_me"),
				url: ROUTES.ABOUT_ME,
			},
			{
				label: translator.t("layout:header:menu:resume"),
				url: ROUTES.RESUME,
			},
			{
				label: translator.t("layout:header:common:menu_item_blog"),
				url: ROUTES.BLOG,
			},
			{
				label: translator.t("layout:header:menu:music"),
				url: ROUTES.MUSIC,
			},
			{
				label: translator.t("layout:header:common:menu_item_readings"),
				url: ROUTES.READINGS,
			},
		];
	}

	// render
	return (
		<div
			className="root tw-relative tw-inline-block  print:tw-hidden"
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
				<List
					is="menu"
					className="tw-absolute tw-top-full tw-left-[-65px] tw-z-40 tw-block tw-w-40 tw-overflow-hidden dfr-shadow dark:dfr-shadow"
				>
					{items.map((item) => {
						const isLinkActive =
							pathname === item.url ||
							asPath === item.url ||
							(isNotEquals(item.url, ROUTES.HOME) && pathname.startsWith(item.url));

						return (
							<List.Item
								key={generateSlug(item.label)}
								className="tw-border-b tw-border-gray-800 dfr-bg-color-dark-strong last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary"
								onClick={handleHideMenuClick}
							>
								<Link
									variant={Link.variant.SIMPLE}
									href={item.url}
									className={classNames(
										"tw-block tw-px-2 tw-py-1 tw-text-center tw-text-base tw-text-gray-400 hover:tw-font-bold",
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
		</div>
	);
}
const SettingsMenu = withAuthenticationRequired(function SettingsMenu(): T_ReactElement {
	// hooks
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation();

	// states & refs
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [showMenu, setShowMenu, toggleShowMenu] = useEnhancedState(false);

	// vars
	const isDarkMode = theme === "dark";

	// effects
	useDidMount(() => {
		if (!isDarkMode) return;
		setTheme("light");
	});

	useClickOutside(menuRef, () => {
		setShowMenu(false);
	});

	// handlers
	function handleToggleThemeClick(): void {
		toggleTheme();
	}

	function handleToggleShowMenuClick(): void {
		toggleShowMenu();
	}

	function handlePrintClick(): void {
		window.print();
	}

	// utils
	function toggleTheme(): void {
		setTheme(isDarkMode ? "light" : "dark");
	}

	// render
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
					size={32}
				/>
			</Button>

			{showMenu ? (
				<List
					is="menu"
					className="tw-absolute tw-top-full tw-right-0 tw-z-40 tw-mt-2 tw-w-44 tw-overflow-hidden dfr-shadow dark:dfr-shadow"
				>
					<MenuItem
						title={t("layout:header:settings:theme")}
						className="tw-hidden"
					>
						<Button
							variant={Button.variant.SIMPLE}
							disabled={!isDarkMode}
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
							onClick={handleToggleThemeClick}
						>
							<Icon
								icon={Icon.icon.MOON}
								color="tw-text-indigo-700 dark:tw-text-indigo-300"
								size={18}
							/>
						</Button>
					</MenuItem>
					<ISRMenuItem />
					<EnvironmentMenuItem />
					<ReloadPWAMenuItem />
					<MenuItem title="Print">
						<Button
							variant={Button.variant.SIMPLE}
							onClick={handlePrintClick}
						>
							<Icon icon={Icon.icon.PRINTER} />
						</Button>
					</MenuItem>
				</List>
			) : null}
		</Block>
	);
});

const EnvironmentMenuItem = withAuthenticationRequired(function EnvironmentMenuItem() {
	// hooks
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

	// states & refs
	const [url, setUrl] = React.useState("/");

	// effects
	useDidMount(() => {
		setUrl(
			isDevelopmentEnvironment()
				? `${WEBSITE_METADATA.url}${window.location.pathname}`
				: `http://localhost:3000${window.location.pathname}`,
		);
	});

	// render
	return (
		<MenuItem title={`Open in "${isDevelopmentEnvironment() ? "prod" : "dev"}"`}>
			<Link
				variant={Link.variant.SIMPLE}
				href={url}
				isExternalLink
			>
				<Icon icon={Icon.icon.EXTERNAL_LINK} />
			</Link>
		</MenuItem>
	);
});

const ISRMenuItem = withAuthenticationRequired(function ISRMenuItem() {
	// handlers
	async function handleISROnDemandClick(): Promise<void> {
		try {
			await http.post("/api/diegofrayo", {
				path: window.location.pathname,
				secret: ENV_VARS.NEXT_PUBLIC_ISR_TOKEN,
			});

			await deletePWACache();
			window.location.reload();
		} catch (error) {
			reportError(error);
			showAlert(`ERROR: ${getErrorMessage(error)}`);
		}
	}

	// render
	return (
		<MenuItem title="ISR on-demand">
			<Button
				variant={Button.variant.SIMPLE}
				onClick={handleISROnDemandClick}
			>
				<Icon icon={Icon.icon.SERVER} />
			</Button>
		</MenuItem>
	);
});

const ReloadPWAMenuItem = withAuthenticationRequired(function ReloadPWAMenuItem() {
	// states & refs
	const [hasToRender, setHasToRender] = React.useState(false);

	// effect
	useDidMount(() => {
		setHasToRender(isPWA());
	});

	// handlers
	async function handleRefreshClick(): Promise<void> {
		await deletePWACache();
		window.location.reload();
	}

	// render
	if (hasToRender) {
		return (
			<MenuItem title="PWA">
				<Button
					variant={Button.variant.SIMPLE}
					onClick={handleRefreshClick}
				>
					<Icon icon={Icon.icon.REFRESH} />
				</Button>
			</MenuItem>
		);
	}

	return null;
});

type T_MenuItemProps = {
	children: T_ReactChildren;
	title: string;
	className?: string;
};

function MenuItem({ children, title, className = "" }: T_MenuItemProps): T_ReactElement {
	return (
		<List.Item
			className={classNames(
				"tw-flex tw-h-16 tw-flex-col tw-items-center tw-justify-center tw-border-b tw-px-2 dfr-bg-color-primary dfr-border-color-primary last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary",
				className,
			)}
		>
			<Text className="tw-text-right tw-text-xs tw-font-bold">{title}</Text>
			<Block className="tw-mt-2 tw-text-right tw-leading-none">{children}</Block>
		</List.Item>
	);
}
