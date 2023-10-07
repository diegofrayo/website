import * as React from "react";
import cn from "classnames";
import * as RadixNavigationMenu from "@radix-ui/react-navigation-menu";
import * as RadixHoverCard from "@radix-ui/react-hover-card";

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
import WEBSITE_METADATA from "~/data/generated/metadata.json";
import { renderIf, withOnlyClientRendering } from "~/hocs";
import { useDidMount, useOnWindowStopScroll } from "~/hooks";
import { withAuth } from "~/modules/auth";
import { ROUTES, useRouting } from "~/modules/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import { generateSlug } from "@diegofrayo/utils/strings";
import { getScrollPosition, isPWA, setScrollPosition } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";
import { type T_IconName } from "~/components/primitive/Icon";

import styles from "./styles.module.css";

type T_MainLayoutProps = {
	children: DR.React.Children;
	title?: string;
};

function MainLayout({ title, children }: T_MainLayoutProps) {
	return (
		<Block is="main">
			<Block className="tw-mx-auto tw-min-h-dv-screen tw-max-w-screen-md tw-px-6 tw-py-12 dr-bg-color-surface-100">
				<Block
					is="header"
					className="tw-relative tw-flex tw-flex-col tw-items-center tw-justify-between"
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
							@diegofrayo
						</Link>
						<Text className="tw-font-mono tw-text-sm tw-font-thin">software developer</Text>
					</Title>

					<ToolsMenu />

					<NavigationMenu />
				</Block>

				<Space size={12} />

				<Block>
					{v.isNotEmptyString(title) ? (
						<Block className="tw-text-center">
							<Title
								is="h1"
								variant={Title.variant.DEFAULT}
								className="tw-mb-16 tw-inline-block tw-border-b-8 tw-border-double tw-border-white tw-text-6xl tw-font-bold tw-uppercase tw-leading-none tw-text-white md:tw-text-8xl lg:tw-text-10xl"
							>
								{title}
							</Title>
						</Block>
					) : null}

					{children}
				</Block>

				<Space size={24} />

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

const ToolsMenu = withAuth(function ToolsMenu() {
	// --- HANDLERS ---
	function onPointerEventHandler(event: DR.React.Events.OnMouseEvent<HTMLButtonElement>): void {
		event.preventDefault();
	}

	return (
		<Block className="tw-absolute tw--top-1 tw-right-0">
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
							</List>
						</RadixNavigationMenu.Content>
					</RadixNavigationMenu.Item>
				</RadixNavigationMenu.List>
				<Block className="radix-viewport-position radix-viewport-position--rtl tw-w-52 tw-rounded-md">
					<RadixNavigationMenu.Viewport className="radix-navigation-menu-viewport tw-w-full" />
				</Block>
			</RadixNavigationMenu.Root>
		</Block>
	);
});

interface I_ToolsMenuItemPropsLink {
	url: string;
	title: string;
	icon: T_IconName;
	isExternalLink?: boolean;
}

interface I_ToolsMenuItemPropsButton {
	title: string;
	icon: T_IconName;
	onClick: DR.React.Events.OnClickEventHandler<HTMLButtonElement>;
}

type T_ToolsMenuItemProps = I_ToolsMenuItemPropsLink | I_ToolsMenuItemPropsButton;

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

const EnvironmentMenuItem = renderIf(function EnvironmentMenuItem() {
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
		<ToolsMenuItem
			url={url}
			title={`Open this page in "${isDevelopmentEnvironment() ? "prod" : "dev"}"`}
			icon={Icon.icon.EXTERNAL_LINK}
			isExternalLink
		/>
	);
})(() => isPWA() === false);

const ReloadPageMenuItem = renderIf(function ReloadPageMenuItem() {
	// --- EFFECTS ---
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
})(() => isPWA() === true);

function NavigationMenu() {
	// --- STATES & REFS ---
	const [showMenu, setShowMenu] = React.useState(false);

	// --- HANDLERS ---
	function handleToggleMenuClick() {
		setShowMenu((currentState) => !currentState);
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

function Footer() {
	// --- STATES & REFS ---
	const [isHoverCardOpen, setIsHoverCardOpen] = React.useState(false);

	// --- HANDLERS ---
	function onHoverCardToggleHandler() {
		setIsHoverCardOpen((currentState) => !currentState);
	}

	return (
		<Block
			is="footer"
			className="tw-text-center"
		>
			<RadixHoverCard.Root open={isHoverCardOpen}>
				<RadixHoverCard.Trigger>
					<Block
						className="tw-inline-block tw-cursor-context-menu tw-p-1"
						onClick={onHoverCardToggleHandler}
					>
						<Icon icon={Icon.icon.STACK} />
					</Block>
				</RadixHoverCard.Trigger>
				<RadixHoverCard.Content
					className={cn("radix-hover-card-content", styles["radix-hover-card-content"])}
					side="top"
					sideOffset={0}
					onMouseLeave={onHoverCardToggleHandler}
				>
					<Block
						is="section"
						className="tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm dr-bg-color-surface-200 dr-border-color-surface-300"
					>
						<Block className="tw-flex tw-justify-between tw-text-white">
							<Title
								is="h2"
								className="tw-text-center tw-text-base tw-font-bold"
							>
								TECH STACK
							</Title>
							<Link
								variant={Link.variant.SIMPLE}
								href={`${WEBSITE_METADATA.social.github}/website`}
								className="tw-inline-block"
								isExternalLink
							>
								<Icon icon={Icon.icon.CODE} />
							</Link>
						</Block>
						<Space size={0.5} />
						<List
							variant={List.variant.DEFAULT}
							className="tw-text-left"
						>
							<List.Item>
								<StackItem
									toolName="typescript"
									href="https://typescriptlang.org"
									description="as the main language"
								/>
							</List.Item>
							<List.Item>
								<StackItem
									toolName="next.js"
									href="https://nextjs.org"
									description="as web framework"
								/>
							</List.Item>
							<List.Item>
								<StackItem
									toolName="tailwindcss"
									href="https://tailwindcss.com"
									description="as css framework"
								/>
							</List.Item>
							<List.Item>
								<StackItem
									toolName="vercel"
									href="https://vercel.com"
									description="as hosting platform"
								/>
							</List.Item>
						</List>
					</Block>

					<RadixHoverCard.Arrow
						width={20}
						height={10}
						className="radix-hover-card-arrow tw-relative tw--top-1 tw-fill-[var(--dr-color-surface-300)]"
					/>
				</RadixHoverCard.Content>
			</RadixHoverCard.Root>
			<Space size={2} />

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
				© {new Date().getFullYear()} All rights reserved | Coded by{" "}
				<InlineText is="strong">Diego Rayo</InlineText>
			</Text>

			<GoToTopButton />
		</Block>
	);
}

type T_StackItemProps = {
	toolName: string;
	href: string;
	description: string;
};

function StackItem({ toolName, href, description }: T_StackItemProps) {
	return (
		<React.Fragment>
			<Link
				variant={Link.variant.SIMPLE}
				href={href}
				className="tw-font-bold tw-underline"
				isExternalLink
			>
				<InlineText>{toolName}</InlineText>
				<Icon
					icon={Icon.icon.EXTERNAL_LINK}
					wrapperClassName="tw-ml-0.5 tw-mr-1.5"
					size={12}
				/>
			</Link>
			<InlineText>{description}</InlineText>
		</React.Fragment>
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

const WindowSize = withOnlyClientRendering(function WindowSize() {
	const [size, setSize] = React.useState([0, 0]);

	React.useLayoutEffect(() => {
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight]);
		};

		updateSize();

		window.addEventListener("resize", updateSize);

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	if (isDevelopmentEnvironment()) {
		return (
			<div className="tw-fixed tw-bottom-0 tw-left-0 tw-bg-black tw-bg-opacity-50 tw-p-2.5 tw-font-bold tw-text-white">
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
