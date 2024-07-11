import * as React from "react";
import * as RadixNavigationMenu from "@radix-ui/react-navigation-menu";

import {
	Block,
	Button,
	Icon,
	InlineText,
	Link,
	List,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import type { T_IconName } from "~/components/primitive/Icon";
import { Toast, TypingTextEffect } from "~/components/shared";
import WEBSITE_METADATA from "~/data/metadata.json";
import { renderIf, withOnlyClientRender } from "~/hocs";
import cn from "~/lib/cn";
import AnalyticsService from "~/modules/analytics";
import ServerAPI from "~/modules/api";
import { AuthService, withAuth } from "~/modules/auth";
import EnvVars from "~/modules/env-vars";
import { logAndReportError } from "~/modules/logging";
import { ROUTES, redirect, useRouting } from "~/modules/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import type DR from "@diegofrayo/types";
import { useDidMount, useOnWindowStopScroll, useToggleBodyScroll } from "@diegofrayo/hooks";
import { delay, getErrorMessage } from "@diegofrayo/utils/misc";
import {
	copyToClipboard,
	deletePWACache,
	getScrollPosition,
	isPWA,
	setScrollPosition,
} from "@diegofrayo/utils/browser";
import { createRandomString, generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import styles from "./styles.module.css";

type T_MainLayoutProps = {
	children: DR.React.Children;
	title?: string;
	className?: string;
};

function MainLayout({ title, children, className }: T_MainLayoutProps) {
	// --- HOOKS ---
	const { pathname } = useRouting();

	// --- STATES & REFS ---
	const [forceRenderKey, setForceRenderKey] = React.useState("");

	// --- VARS ---
	const parentUrl = getParentURL();

	// --- UTILS ---
	function getParentURL() {
		if (pathname === "/") return "";

		const urlParts = pathname.split("/");

		return `${urlParts.slice(0, urlParts.length - 1).join("/")}/`;
	}

	function dispatchForcedRender() {
		setForceRenderKey(createRandomString(10));
	}

	return (
		<Block is="main">
			<Block
				className={cn(
					"tw-relative tw-mx-auto tw-min-h-dv-screen tw-max-w-5xl tw-px-6 tw-py-12 dr-bg-color-surface-100 print:tw-bg-transparent print:tw-p-0",
					className,
				)}
			>
				<Block className="tw-absolute tw--top-1 tw-left-0">
					<Flags />
				</Block>

				<Block
					is="header"
					className="tw-relative print:tw-hidden"
				>
					<Title
						is="h1"
						className="tw-mb-8 tw-flex-shrink-0 tw-text-center"
					>
						<Link
							variant={Link.variant.SIMPLE}
							href={ROUTES.HOME}
							className="tw-block tw-text-2xl tw-text-white dr-font-main-title sm:tw-text-4xl"
							onClick={AnalyticsService.trackClickEvent("GENERAL|HEADER_LINK")}
						>
							{`@${WEBSITE_METADATA.username}`}
						</Link>
						<TypingTextEffect className="tw-font-mono tw-text-sm tw-font-thin">
							{WEBSITE_METADATA.jobTitle.toLowerCase()}
						</TypingTextEffect>
					</Title>

					<NavigationMenu />

					<Block className="tw-absolute tw--top-1 tw-right-0">
						<ToolsMenu dispatchForcedRender={dispatchForcedRender} />
					</Block>
				</Block>

				<Space
					size={12}
					clasName="print:tw-hidden"
				/>

				<Block key={forceRenderKey}>
					{v.isNotEmptyString(title) ? (
						<Block className="tw-text-center print:tw-hidden">
							{v.isNotEmptyString(parentUrl) ? (
								<Block>
									<Link
										variant={Link.variant.SIMPLE}
										href={parentUrl}
										className="tw-mb-4 tw-inline-block tw-text-base tw-text-white tw-underline"
										onClick={AnalyticsService.trackClickEvent("GENERAL|BREADCUMB_LINK", {
											link: parentUrl,
										})}
									>
										{parentUrl}
									</Link>
								</Block>
							) : null}
							<Title
								is="h1"
								variant={Title.variant.SIMPLE}
								className="tw-mb-16 tw-inline-block tw-border-b-8 tw-border-double tw-border-white tw-text-6xl tw-font-bold tw-uppercase tw-leading-none tw-text-white md:tw-text-8xl lg:tw-text-10xl"
							>
								{title}
							</Title>
						</Block>
					) : null}

					{children}
				</Block>

				<Space
					size={24}
					clasName="print:tw-hidden"
				/>

				<Footer />
			</Block>

			<WindowSize />
		</Block>
	);
}

export default MainLayout;

// --- CONSTANTS ---

const SOCIAL_ICONS = [
	{
		name: "github",
		href: WEBSITE_METADATA.social.github,
		icon: Icon.icon.GITHUB_MONO,
		className: "",
	},
	{
		name: "linkedin",
		href: WEBSITE_METADATA.social.linkedin,
		icon: Icon.icon.LINKEDIN_MONO,
		className: "",
	},
	{
		name: "twitter",
		href: WEBSITE_METADATA.social.twitter,
		icon: Icon.icon.TWITTER,
		className: "",
	},
	{
		name: "instagram",
		href: WEBSITE_METADATA.social.instagram,
		icon: Icon.icon.INSTAGRAM_MONO,
		className: "",
	},
	{
		name: "spotify",
		href: WEBSITE_METADATA.social.spotify,
		icon: Icon.icon.SPOTIFY_MONO,
		className: "",
	},
];

// --- COMPONENTS ---

type T_ToolsMenuProps = {
	dispatchForcedRender: () => void;
};

const ToolsMenu = renderIf(function ToolsMenu({ dispatchForcedRender }: T_ToolsMenuProps) {
	// --- HANDLERS ---
	function onPointerEventHandler(event: DR.React.Events.OnMouseEvent<HTMLButtonElement>) {
		event.preventDefault();
	}

	return (
		<RadixNavigationMenu.Root
			className="radix-navigation-menu-root tw-z-10"
			delayDuration={0}
		>
			<RadixNavigationMenu.List className="radix-navigation-menu-list">
				<RadixNavigationMenu.Item>
					<RadixNavigationMenu.Trigger
						className="radix-navigation-menu-trigger tw-p-2 tw-pr-0 tw-text-center"
						onPointerMove={onPointerEventHandler}
						onPointerLeave={onPointerEventHandler}
					>
						<Icon
							icon={Icon.icon.SETTINGS}
							wrapperClassName={styles["radix-navigation-menu-trigger-icon"]}
							size="tw-wh-6 sm:tw-wh-8"
							color="tw-text-white"
						/>
					</RadixNavigationMenu.Trigger>
					<RadixNavigationMenu.Content className="radix-navigation-menu-content">
						<List className="tw-block tw-overflow-hidden tw-rounded-md tw-border dr-bg-color-surface-200 dr-border-color-surface-300">
							<CopyURLMenuItem />
							<EnvironmentMenuItem />
							<ISRMenuItem />
							<ReloadPageMenuItem />
							<SwitchUserModeMenuItem dispatchForcedRender={dispatchForcedRender} />
							<SignInMenuItem />
							<SignOutMenuItem />
						</List>
					</RadixNavigationMenu.Content>
				</RadixNavigationMenu.Item>
			</RadixNavigationMenu.List>
			<Block className="radix-viewport-position radix-viewport-position--rtl tw-w-56 tw-rounded-md">
				<RadixNavigationMenu.Viewport className="radix-navigation-menu-viewport tw-w-full" />
			</Block>
		</RadixNavigationMenu.Root>
	);
})(() => AuthService.isUserLoggedIn() || isPWA());

interface I_ToolsMenuItemLinkProps {
	url: string;
	title: string;
	icon: T_IconName;
	isExternalLink?: boolean;

	onClick?: never;
}

interface I_ToolsMenuItemButtonProps {
	title: string;
	icon: T_IconName;
	onClick: DR.React.Events.OnClickEventHandler<HTMLButtonElement>;

	url?: never;
	isExternalLink?: never;
}

type T_ToolsMenuItemProps = I_ToolsMenuItemLinkProps | I_ToolsMenuItemButtonProps;

function ToolsMenuItem(props: T_ToolsMenuItemProps) {
	return (
		<List.Item className="tw-border-b tw-text-sm dr-border-color-surface-300 last:tw-border-0">
			{"url" in props ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={props.url}
					className="tw-flex tw-h-8 tw-w-full tw-items-center tw-justify-between tw-px-2"
					{...(props.isExternalLink ? { isExternalLink: props.isExternalLink } : {})}
				>
					<InlineText>{props.title}</InlineText>
					<Icon icon={props.icon} />
				</Link>
			) : (
				<Button
					variant={Button.variant.SIMPLE}
					className="tw-flex tw-h-8 tw-w-full tw-items-center tw-justify-between tw-px-2"
					onClick={props.onClick}
				>
					<InlineText>{props.title}</InlineText>
					<Icon icon={props.icon} />
				</Button>
			)}
		</List.Item>
	);
}

type T_SwitchUserModeMenuItemProps = {
	dispatchForcedRender: () => void;
};

function SwitchUserModeMenuItem({ dispatchForcedRender }: T_SwitchUserModeMenuItemProps) {
	// --- HANDLERS ---
	function handleClick() {
		if (AuthService.isGuestUser()) {
			AuthService.createTemporalSession();
		} else {
			AuthService.destroyTemporalSession();
		}

		dispatchForcedRender();
	}

	return (
		<ToolsMenuItem
			title={`Switch to "${AuthService.isGuestUser() ? "user" : "guest"}" mode`}
			icon={Icon.icon.USER_CIRCLE}
			onClick={handleClick}
		/>
	);
}

function CopyURLMenuItem() {
	// --- HANDLERS ---
	function handleClick() {
		copyToClipboard(window.location.href);
	}

	return (
		<ToolsMenuItem
			title="Copy URL"
			icon={Icon.icon.LINK}
			onClick={handleClick}
		/>
	);
}

function EnvironmentMenuItem() {
	// --- STATES & REFS ---
	const [url, setUrl] = React.useState("/");

	// --- EFFECTS ---
	useDidMount(() => {
		setUrl(
			isDevelopmentEnvironment(EnvVars)
				? `${WEBSITE_METADATA.url}${window.location.pathname}`
				: `http://localhost:3000${window.location.pathname}`,
		);
	});

	return (
		<ToolsMenuItem
			title={`Open this page in "${isDevelopmentEnvironment(EnvVars) ? "prod" : "dev"}"`}
			icon={Icon.icon.EXTERNAL_LINK}
			url={url}
			isExternalLink
		/>
	);
}

const ISRMenuItem = withAuth(function ISRMenuItem() {
	// --- HANDLERS ---
	async function handleISROnDemandClick() {
		try {
			const pin = window.prompt("Type the security pin");

			if (v.isNotEmptyString(pin)) {
				await ServerAPI.post("/isr", {
					path: window.location.pathname,
					secret: pin,
				});

				await deletePWACache();
				await delay(2000);
				window.location.reload();
			}
		} catch (error) {
			logAndReportError(error);
			Toast.error(getErrorMessage(error));
		}
	}

	return (
		<ToolsMenuItem
			title="ISR on-demand"
			icon={Icon.icon.SERVER}
			onClick={handleISROnDemandClick}
		/>
	);
});

const SignInMenuItem = renderIf(function SignInMenuItem() {
	return (
		<ToolsMenuItem
			title="Sign in"
			icon={Icon.icon.USER_CIRCLE}
			url={ROUTES.SIGN_IN}
		/>
	);
})(() => AuthService.isUserLoggedIn() === false);

const SignOutMenuItem = withAuth(function SignOutMenuItem() {
	// --- HANDLERS ---
	function handleClick() {
		AuthService.destroySession();
		redirect(AnalyticsService.composeURLWithDisableFlag(ROUTES.HOME));
	}

	return (
		<ToolsMenuItem
			title="Sign out"
			icon={Icon.icon.EXIT}
			onClick={handleClick}
		/>
	);
});

function ReloadPageMenuItem() {
	// --- HANDLERS ---
	function handleClick() {
		window.location.reload();
	}

	return (
		<ToolsMenuItem
			title="Reload app"
			icon={Icon.icon.REFRESH}
			onClick={handleClick}
		/>
	);
}

function NavigationMenu() {
	// --- STATES & REFS ---
	const [showMenu, setShowMenu] = React.useState(false);

	// --- HOOKS ---
	useToggleBodyScroll(showMenu);

	// --- HANDLERS ---
	function handleToggleMenuClick() {
		setShowMenu((currentState) => {
			const newState = !currentState;

			if (newState === true) {
				setScrollPosition(0);
			}

			return newState;
		});
	}

	return (
		<RadixNavigationMenu.Root
			className="radix-navigation-menu-root"
			delayDuration={0}
		>
			<RadixNavigationMenu.List className="radix-navigation-menu-list tw-text-center">
				<RadixNavigationMenu.Item className="tw-inline-block md:tw-hidden">
					<Button onClick={handleToggleMenuClick}>
						<Icon
							icon={Icon.icon.MENU}
							size={24}
						/>
					</Button>

					<NavigationMenuDialog
						show={showMenu}
						onCloseHandler={handleToggleMenuClick}
					/>
				</RadixNavigationMenu.Item>

				<RadixNavigationMenu.Item className="tw-hidden md:tw-inline-block">
					<NavigationMenuItems />
				</RadixNavigationMenu.Item>
			</RadixNavigationMenu.List>
		</RadixNavigationMenu.Root>
	);
}

type T_NavigationMenuDialogProps = {
	show: boolean;
	onCloseHandler: () => void;
};

function NavigationMenuDialog({ show, onCloseHandler }: T_NavigationMenuDialogProps) {
	if (show) {
		return (
			<Block className="tw-fixed tw-left-0 tw-top-0 tw-z-20 tw-flex tw-h-screen tw-w-screen tw-items-center tw-justify-center tw-bg-black/80 tw-backdrop-blur-md">
				<Button
					className="tw-top tw-absolute tw-top-[132px] tw-block tw-w-full sm:tw-top-[141px]"
					onClick={onCloseHandler}
				>
					<Icon
						icon={Icon.icon.X}
						size={24}
					/>
				</Button>
				<NavigationMenuItems />
			</Block>
		);
	}

	return null;
}

function NavigationMenuItems() {
	return (
		<List className="md:tw-inline-block md:tw-overflow-hidden md:tw-rounded-md md:tw-border md:dr-bg-color-surface-100 md:dr-border-color-surface-300">
			<NavigationMenuItem
				href={ROUTES.HOME}
				icon={Icon.icon.HOME}
			>
				Home
			</NavigationMenuItem>
			<NavigationMenuItem
				href={ROUTES.BLOG}
				icon={Icon.icon.RSS}
			>
				Blog
			</NavigationMenuItem>
			<NavigationMenuItem
				href={ROUTES.RESUME}
				icon={Icon.icon.DOCUMENT_TEXT}
			>
				Resume
			</NavigationMenuItem>
			<NavigationMenuItem
				href={ROUTES.KORDZ}
				icon={Icon.icon.MUSIC_NOTE}
			>
				Kordz
			</NavigationMenuItem>
			<AppsNavigationMenuItem />
		</List>
	);
}

type T_NavigationMenuItemProps = {
	href: string;
	icon: T_IconName;
	children: DR.React.Children;
};

const NavigationMenuItem = React.forwardRef<HTMLAnchorElement, T_NavigationMenuItemProps>(
	function NavigationMenuItem({ children, href, icon }, forwardedRef) {
		// --- HOOKS ---
		const { isCurrentPathActive } = useRouting();

		return (
			<List.Item className="tw-block md:tw-inline-block md:tw-w-32 md:tw-border-r md:dr-border-color-surface-400 md:last:tw-border-r-0">
				<Link
					className={cn(
						"tw-flex tw-items-center tw-justify-start tw-px-6 tw-py-1.5 tw-text-left tw-text-3xl tw-uppercase dr-font-titles md:tw-justify-center md:tw-text-center md:tw-text-lg md:dr-bg-color-surface-200",
						isCurrentPathActive(href)
							? "tw-text-white md:dr-bg-color-surface-300"
							: "dr-text-color-surface-600",
					)}
					href={href}
					ref={forwardedRef}
					variant={Link.variant.SIMPLE}
					onClick={AnalyticsService.trackClickEvent("GENERAL|NAVIGATION_MENU", { item: href })}
				>
					<Icon
						icon={icon}
						wrapperClassName="tw-mr-3 sm:tw-mr-1"
						size={24}
					/>
					<InlineText>{children}</InlineText>
				</Link>
			</List.Item>
		);
	},
);

const AppsNavigationMenuItem = withAuth(function AppsNavigationMenuItem() {
	return (
		<NavigationMenuItem
			href={ROUTES.APPS}
			icon={Icon.icon.COMMAND_LINE}
		>
			Apps
		</NavigationMenuItem>
	);
});

function Footer() {
	return (
		<Block
			is="footer"
			className="tw-text-center print:tw-hidden"
		>
			<Block>
				{SOCIAL_ICONS.map((socialIcon) => {
					return (
						<SocialIcon
							key={generateSlug(socialIcon.icon)}
							{...socialIcon}
						/>
					);
				})}
			</Block>
			<Space size={2} />

			<Text className="tw-text-sm">
				<InlineText>© {new Date().getFullYear()} All rights reserved | Coded by </InlineText>
				<InlineText is="strong">Diego Rayo</InlineText>
			</Text>

			<GoToTopButton />
		</Block>
	);
}

type T_SocialIconProps = {
	href: string;
	icon: T_IconName;
	name: string;
};

function SocialIcon({ href, icon, name }: T_SocialIconProps) {
	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={href}
			className="tw-mx-2 tw-inline-block"
			onClick={AnalyticsService.trackClickEvent("GENERAL|SOCIAL_NETWORKS", { item: name })}
			isExternalLink
		>
			<Icon
				icon={icon}
				size={32}
			/>
		</Link>
	);
}

function GoToTopButton() {
	// --- STATES & REFS ---
	const [showButton, setShowButton] = React.useState(false);

	// --- EFFECTS ---
	useOnWindowStopScroll({
		onScrollStoppedCallback: () => {
			setShowButton(false);
		},
		onScrollCallback: () => {
			if (getScrollPosition() > 0) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		},
	});

	// --- HANDLERS ---
	function handleGoToTheTopClick() {
		AnalyticsService.trackEvent("GENERAL|GO_TO_TOP");

		setScrollPosition(0);
	}

	if (showButton) {
		return (
			<Button
				variant={Button.variant.SIMPLE}
				className="tw-fixed tw-bottom-3 tw-right-3 tw-z-50 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-md tw-border tw-text-2xl dr-bg-color-surface-200 dr-border-color-surface-300 sm:tw-bottom-4 sm:tw-right-4"
				onClick={handleGoToTheTopClick}
			>
				<Icon icon={Icon.icon.ARROW_UP} />
			</Button>
		);
	}

	return null;
}

function Flags() {
	// --- STATES & REFS ---
	const [showAnalyticsFlag, setShowAnalyticsFlag] = React.useState(false);
	const [showAuthFlag, setShowAuthFlag] = React.useState(false);

	// --- EFFECTS ---
	useDidMount(() => {
		setShowAnalyticsFlag(AnalyticsService.isAnalyticsDisabled());
		setShowAuthFlag(AuthService.isUserLoggedIn());
	});

	return (
		<Block className="tw-flex tw-gap-1 tw-px-1 tw-py-3 print:tw-hidden">
			{showAnalyticsFlag ? (
				<Block className="tw-relative tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border dr-bg-color-surface-200 dr-border-color-surface-300 tw-wh-6">
					<Icon
						icon={Icon.icon.EYE}
						size={14}
					/>
					<Icon
						icon={Icon.icon.X_SOLID}
						size={12}
						wrapperClassName="tw-absolute tw--top-1 tw--right-1 tw-text-red-700"
					/>
				</Block>
			) : null}
			{showAuthFlag ? (
				<Block className="tw-relative tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border dr-bg-color-surface-200 dr-border-color-surface-300 tw-wh-6">
					<Icon
						icon={Icon.icon.USER_CIRCLE}
						size={14}
					/>
					<Icon
						icon={Icon.icon.CHECK_BADGE}
						size={12}
						wrapperClassName="tw-absolute tw--top-1 tw--right-1 tw-text-green-700"
					/>
				</Block>
			) : null}
		</Block>
	);
}

const WindowSize = withOnlyClientRender(function WindowSize() {
	const [size, setSize] = React.useState([0, 0]);

	React.useEffect(() => {
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight]);
		};

		updateSize();

		window.addEventListener("resize", updateSize);

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	if (isDevelopmentEnvironment(EnvVars)) {
		return (
			<div className="tw-fixed tw-bottom-0 tw-left-0 tw-bg-black/80 tw-p-2.5 tw-font-bold tw-text-white print:tw-hidden">
				<span>{size.join("x")} | </span>
				<span className="tw-inline-block sm:tw-hidden">mobile</span>
				<span className="tw-hidden sm:tw-inline-block md:tw-hidden">sm</span>
				<span className="tw-hidden md:tw-inline-block lg:tw-hidden">md</span>
				<span className="tw-hidden lg:tw-inline-block">lg</span>
			</div>
		);
	}

	return null;
});
