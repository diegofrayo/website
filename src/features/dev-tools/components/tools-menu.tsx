import { Menu } from "@base-ui/react/menu";

import cn from "@diegofrayo-pkg/cn";
import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { copyToClipboard } from "@diegofrayo-pkg/utilities/browser/clipboard";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { CopyToClipboardPopover } from "~/components/common";
import { type CopyToClipboardPopoverProps } from "~/components/common/copy-to-clipboard-popover";
import { Button, Icon, InlineText, Link, List } from "~/components/primitive";
import { IconCatalog, type IconName } from "~/components/primitive/icon";
import AuthService, { withAuth } from "~/features/auth";
import { Routes } from "~/features/routing";

type ToolsMenuProps = {
	devURL: string;
	productionURL: string;
};

function ToolsMenu({ devURL, productionURL }: ToolsMenuProps) {
	return (
		<Menu.Root>
			<Menu.Trigger className="group leading-none">
				<Icon
					name={IconCatalog.SETTINGS}
					className="size-6 text-white transition-transform duration-300 ease-[ease] group-data-popup-open:rotate-180"
				/>
			</Menu.Trigger>

			<Menu.Portal>
				<Menu.Positioner
					sideOffset={12}
					alignOffset={0}
					className="z-50"
					style={{ left: -5 }}
				>
					<Menu.Popup>
						<List className="block overflow-hidden border border-zinc-300">
							<CopyURLMenuItem />
							<EnvironmentMenuItem
								productionURL={productionURL}
								devURL={devURL}
							/>
							<SignOutMenuItem />
						</List>

						<Menu.Separator />
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
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
	devURL,
}: Pick<ToolsMenuProps, "productionURL" | "devURL">) {
	const url = isDevelopmentEnvironment()
		? `${productionURL}${window.location.pathname}`
		: `${devURL}${window.location.pathname}`;

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

const SignOutMenuItem = withAuth(function SignOutMenuItem() {
	// --- HANDLERS ---
	async function handleClick() {
		await AuthService.signOut();
		window.localStorage.clear();
		window.location.href = Routes.INDEX;
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
	// --- COMPUTED STATES ---
	const isLinkElement = props.as === "link";

	// --- STYLES ---
	const classes = {
		element: cn("flex h-8 w-full items-center justify-between gap-4 px-2"),
	};

	return (
		<List.Item className="border-b border-zinc-300 bg-zinc-100 text-sm last:border-0">
			<ToolsMenuItemWrapper popoverConfig={props.popoverConfig}>
				{isLinkElement ? (
					<Link
						variant={Link.variant.SMOOTH}
						href={props.url}
						className={classes.element}
						isExternalLink={props.isExternalLink || false}
					>
						<InlineText>{props.title}</InlineText>
						<Icon name={props.icon} />
					</Link>
				) : (
					<Button
						variant={Button.variant.SMOOTH}
						className={classes.element}
						onClick={props.onClick}
					>
						<InlineText>{props.title}</InlineText>
						<Icon name={props.icon} />
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
