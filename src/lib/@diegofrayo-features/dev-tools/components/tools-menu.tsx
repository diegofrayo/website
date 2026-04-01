import { DropdownMenu } from "radix-ui";

import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { copyToClipboard, showAlert } from "@diegofrayo-pkg/utilities/browser";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";
import { CopyToClipboardPopover } from "@diegofrayo-features/components/shared";
import type { CopyToClipboardPopoverProps } from "@diegofrayo-features/components/shared/copy-to-clipboard-popover";

import { AuthService, withAuth, type AuthUserRole } from "../../auth";
import {
	Button,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	List,
	type IconName,
} from "../../components/primitive";
import styles from "./tools-menu.styles.module.css";

type ToolsMenuProps = {
	productionURL: string;
};

function ToolsMenu({ productionURL }: ToolsMenuProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="leading-none">
				<Icon
					icon={IconCatalog.SETTINGS}
					wrapperClassName={styles["radix-navigation-menu-trigger-icon"]}
					size="size-6"
					color="text-white"
				/>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={12}
					className="z-50"
				>
					<List className="block overflow-hidden border border-zinc-300">
						<CopyURLMenuItem />
						<EnvironmentMenuItem productionURL={productionURL} />
						<SwitchUserModeMenuItem />
						<SignOutMenuItem />
					</List>

					<DropdownMenu.Separator />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export default ToolsMenu;

// --- COMPONENTS ---

function CopyURLMenuItem() {
	// --- HANDLERS ---
	function handleClick() {
		copyToClipboard(window.location.href);
	}

	return (
		<ToolsMenuItem
			as="button"
			icon={IconCatalog.LINK}
			title="Copy URL"
			popoverConfig={{ textToCopy: window.location.href, align: "end" }}
			onClick={handleClick}
		/>
	);
}

const EnvironmentMenuItem = withRenderInBrowser(function EnvironmentMenuItem({
	productionURL,
}: Pick<ToolsMenuProps, "productionURL">) {
	const url = isDevelopmentEnvironment()
		? `${productionURL}${window.location.pathname}`
		: `http://localhost:3000${window.location.pathname}`;

	return (
		<ToolsMenuItem
			as="link"
			icon={IconCatalog.EXTERNAL_LINK}
			title={`Open this page in "${isDevelopmentEnvironment() ? "prod" : "dev"}"`}
			url={url}
			isExternalLink
		/>
	);
});

function SwitchUserModeMenuItem() {
	// --- COMPUTED STATES ---
	const userRole = AuthService.getRole();

	// --- HANDLERS ---
	function handleClick(newUserRole: AuthUserRole) {
		return () => {
			if (newUserRole === "ANONYMOUS") {
				AuthService.switchToAnonymousUser();
				window.location.reload();
			} else if (newUserRole === "GUEST") {
				AuthService.switchToGuestUser();
				window.location.reload();
			} else if (newUserRole === "ADMIN") {
				const password = window.prompt("Type password")?.trim() || "";
				const isRightPassword = password === "ASKL";

				if (!password) return;

				if (isRightPassword) {
					AuthService.switchToAdminUser();
					window.location.reload();
				} else {
					showAlert("Wrong password");
				}
			}
		};
	}

	if (userRole === "ANONYMOUS") {
		return (
			<>
				<ToolsMenuItem
					as="button"
					icon={IconCatalog.CIRCLE_USER}
					title={'Switch to "guest" mode'}
					onClick={handleClick("GUEST")}
				/>
				<ToolsMenuItem
					as="button"
					icon={IconCatalog.CIRCLE_USER}
					title={'Switch to "admin" mode'}
					onClick={handleClick("ADMIN")}
				/>
			</>
		);
	}

	if (userRole === "GUEST") {
		return (
			<>
				<ToolsMenuItem
					as="button"
					icon={IconCatalog.CIRCLE_USER}
					title={'Switch to "anonymous" mode'}
					onClick={handleClick("ANONYMOUS")}
				/>
				<ToolsMenuItem
					as="button"
					icon={IconCatalog.CIRCLE_USER}
					title={'Switch to "admin" mode'}
					onClick={handleClick("ADMIN")}
				/>
			</>
		);
	}

	return (
		<>
			<ToolsMenuItem
				as="button"
				icon={IconCatalog.CIRCLE_USER}
				title={'Switch to "anonymous" mode'}
				onClick={handleClick("ANONYMOUS")}
			/>
			<ToolsMenuItem
				as="button"
				icon={IconCatalog.CIRCLE_USER}
				title={'Switch to "guest" mode'}
				onClick={handleClick("GUEST")}
			/>
		</>
	);
}

const SignOutMenuItem = withAuth(function SignOutMenuItem() {
	// --- HANDLERS ---
	function handleClick() {
		AuthService.destroySession();
		window.localStorage.clear();
	}

	return (
		<ToolsMenuItem
			as="button"
			icon={IconCatalog.LOG_OUT}
			title="Sign out"
			onClick={handleClick}
		/>
	);
});

interface ToolsMenuItemLinkProps {
	as: "link";
	icon: IconName;
	title: string;
	url: string;
	isExternalLink?: boolean;
	popoverConfig?: Omit<CopyToClipboardPopoverProps, "children">;
}

interface ToolsMenuItemButtonProps {
	as: "button";
	title: string;
	icon: IconName;
	onClick: ReactTypes.Events.OnClickEventHandler<HTMLButtonElement>;
	popoverConfig?: Omit<CopyToClipboardPopoverProps, "children">;
}

type ToolsMenuItemProps = ToolsMenuItemLinkProps | ToolsMenuItemButtonProps;

function ToolsMenuItem(props: ToolsMenuItemProps) {
	const isLinkElement = props.as === "link";

	return (
		<List.Item className="border-b border-zinc-300 bg-zinc-100 text-sm last:border-0">
			<ToolsMenuItemWrapper popoverConfig={props.popoverConfig}>
				{isLinkElement ? (
					<Link
						variant={Link.variant.SMOOTH}
						href={props.url}
						className="flex h-8 w-full items-center justify-between gap-4 px-2"
						isExternalLink={props.isExternalLink || false}
					>
						<InlineText>{props.title}</InlineText>
						<Icon icon={props.icon} />
					</Link>
				) : (
					<Button
						variant={Button.variant.SMOOTH}
						className="flex h-8 w-full items-center justify-between gap-4 px-2"
						onClick={props.onClick}
					>
						<InlineText>{props.title}</InlineText>
						<Icon icon={props.icon} />
					</Button>
				)}
			</ToolsMenuItemWrapper>
		</List.Item>
	);
}

type ToolsMenuItemWrapperProps = {
	children: ReactTypes.Children;
	popoverConfig: Omit<CopyToClipboardPopoverProps, "children"> | undefined;
};

const ToolsMenuItemWrapper = ({ children, popoverConfig }: ToolsMenuItemWrapperProps) => {
	if (popoverConfig) {
		return <CopyToClipboardPopover {...popoverConfig}>{children}</CopyToClipboardPopover>;
	}

	return children;
};
