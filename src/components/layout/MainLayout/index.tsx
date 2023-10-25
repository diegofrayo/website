import * as React from "react";
import cn from "classnames";
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
import { TypingTextEffect } from "~/components/shared";
import WEBSITE_METADATA from "~/data/metadata.json";
import { renderIf, withOnlyClientRender } from "~/hocs";
import { useDidMount, useOnWindowStopScroll, useToggleBodyScroll } from "~/hooks";
import { AuthService, withAuth } from "~/modules/auth";
import EnvVars from "~/modules/env-vars";
import { ROUTES, redirect, useRouting } from "~/modules/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import { generateSlug } from "@diegofrayo/utils/strings";
import { getScrollPosition, isPWA, setScrollPosition } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";
import { type T_IconName } from "~/components/primitive/Icon";

import AnalyticsService from "~/modules/analytics";
import styles from "./styles.module.css";

type T_MainLayoutProps = {
	children: DR.React.Children;
	title?: string;
};

function MainLayout({ title, children }: T_MainLayoutProps) {
	return (
		<Block is="main">
			<Block className="tw-relative tw-mx-auto tw-min-h-dv-screen tw-max-w-screen-md tw-px-6 tw-py-12 dr-bg-color-surface-100 print:tw-bg-transparent">
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
						>
							{`@${WEBSITE_METADATA.username}`}
						</Link>
						<TypingTextEffect className="tw-font-mono tw-text-sm tw-font-thin">
							{WEBSITE_METADATA.jobTitle.toLowerCase()}
						</TypingTextEffect>
					</Title>

					<NavigationMenu />

					<Block className="tw-absolute tw--top-1 tw-right-0">
						<ToolsMenu />
					</Block>
				</Block>

				<Space
					size={12}
					clasName="print:tw-hidden"
				/>

				<Block>
					{v.isNotEmptyString(title) ? (
						<Block className="tw-text-center print:tw-hidden">
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
		href: WEBSITE_METADATA.social.github,
		icon: Icon.icon.GITHUB_MONO,
		className: "",
	},
	{
		href: WEBSITE_METADATA.social.linkedin,
		icon: Icon.icon.LINKEDIN_MONO,
		className: "",
	},
	{
		href: WEBSITE_METADATA.social.twitter,
		icon: Icon.icon.TWITTER,
		className: "",
	},
	{
		href: WEBSITE_METADATA.social.instagram,
		icon: Icon.icon.INSTAGRAM_MONO,
		className: "",
	},
	{
		href: WEBSITE_METADATA.social.spotify,
		icon: Icon.icon.SPOTIFY_MONO,
		className: "",
	},
];

// --- COMPONENTS ---

const ToolsMenu = renderIf(function ToolsMenu() {
	// --- HANDLERS ---
	function onPointerEventHandler(event: DR.React.Events.OnMouseEvent<HTMLButtonElement>): void {
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
							<EnvironmentMenuItem />
							<ReloadPageMenuItem />
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
			url={url}
			title={`Open this page in "${isDevelopmentEnvironment(EnvVars) ? "prod" : "dev"}"`}
			icon={Icon.icon.EXTERNAL_LINK}
			isExternalLink
		/>
	);
}

const SignInMenuItem = renderIf(function SignInMenuItem() {
	return (
		<ToolsMenuItem
			url={ROUTES.SIGN_IN}
			title="Sign in"
			icon={Icon.icon.USER_CIRCLE}
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
				<RadixNavigationMenu.Item className="tw-inline-block sm:tw-hidden">
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

				<RadixNavigationMenu.Item className="tw-hidden sm:tw-inline-block">
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
					className="tw-top tw-absolute tw-top-[132.5px] tw-block tw-w-full"
					onClick={onCloseHandler}
				>
					<Icon
						icon={Icon.icon.CLOSE}
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
		<List className="sm:tw-inline-block sm:tw-overflow-hidden sm:tw-rounded-md sm:tw-border sm:dr-bg-color-surface-100 sm:dr-border-color-surface-300">
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
	function NavigationMenuItem({ children, href, icon, ...props }, forwardedRef) {
		// --- HOOKS ---
		const { isCurrentPathActive } = useRouting();

		return (
			<List.Item className="tw-block sm:tw-inline-block sm:tw-w-36 sm:tw-border-r sm:dr-border-color-surface-400 sm:last:tw-border-r-0">
				<Link
					className={cn(
						"tw-flex tw-items-center tw-justify-start tw-px-6 tw-py-1.5 tw-text-left tw-text-3xl tw-uppercase dr-font-titles sm:tw-justify-center sm:tw-text-center sm:tw-text-xl sm:dr-bg-color-surface-200",
						isCurrentPathActive(href)
							? "tw-text-white sm:dr-bg-color-surface-300"
							: "dr-text-color-surface-600",
					)}
					href={href}
					ref={forwardedRef}
					variant={Link.variant.SIMPLE}
					{...props}
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
};

function SocialIcon({ href, icon }: T_SocialIconProps) {
	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={href}
			className="tw-mx-2 tw-inline-block"
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
	function handleGoToTheTopClick(): void {
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
		<Block className="tw-flex tw-gap-1 tw-px-1 tw-py-3">
			{showAnalyticsFlag ? (
				<Block className="tw-relative tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border dr-bg-color-surface-200 dr-border-color-surface-300 tw-wh-6">
					<Icon
						icon={Icon.icon.CHART_BAR_SQUARE}
						size={14}
					/>
					<Icon
						icon={Icon.icon.CLOSE_SOLID}
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
