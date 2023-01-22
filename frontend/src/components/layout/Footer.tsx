import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, Link } from "~/components/primitive";
import { useOnWindowStopScroll } from "~/@diegofrayo/library/hooks";
import { getScrollPosition, setScrollPosition } from "~/@diegofrayo/library/utils/browser";
import type { T_IconName } from "~/components/primitive/Icon";
import type { T_ReactElement, T_ReactElementNullable } from "~/@diegofrayo/library/types/react";

type T_FooterProps = {
	hasToDisplayGoToTheTopButton?: boolean;
};

function Footer({ hasToDisplayGoToTheTopButton }: T_FooterProps): T_ReactElement {
	return (
		<Block
			is="footer"
			className="tw-relative tw-border-t tw-border-slate-100 tw-bg-slate-50 tw-py-4 tw-px-8 tw-text-center tw-text-slate-500 print:tw-hidden"
		>
			<Block className="tw-my-16">
				<Block className="tw-inline-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
					<FooterIcon
						url={"WEBSITE_METADATA.social.linkedin"}
						icon={Icon.icon.LINKEDIN}
						className="tw-bg-sky-800"
					/>
					<FooterIcon
						url={"WEBSITE_METADATA.social.github"}
						icon={Icon.icon.GITHUB_LIGHT}
						className="tw-bg-gray-700"
					/>
					<FooterIcon
						url={"WEBSITE_METADATA.social.twitter"}
						icon={Icon.icon.TWITTER}
						className="tw-bg-blue-900"
					/>
					<FooterIcon
						url={"WEBSITE_METADATA.social.couchsurfing"}
						icon={Icon.icon.COUCHSURFING}
						className="tw-bg-orange-900"
					/>
					<FooterIcon
						url={"WEBSITE_METADATA.social.spotify"}
						icon={Icon.icon.SPOTIFY}
						className="tw-bg-green-900"
					/>
				</Block>
			</Block>
			<Block className="tw-text-xs">
				Diego Rayo | @diegofrayo | Software Developer | {new Date().getFullYear()}
			</Block>

			{hasToDisplayGoToTheTopButton ? <GoToTopButton /> : null}
		</Block>
	);
}

export default Footer;

// --- Components ---

type T_FooterIconProps = {
	icon: T_IconName;
	url: string;
	className: string;
};

function FooterIcon({ icon, url, className }: T_FooterIconProps): T_ReactElement {
	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={url}
			className={classNames("tw-m-2 tw-inline-block tw-rounded-xl tw-p-2", className)}
		>
			<Icon
				icon={icon}
				size={48}
			/>
		</Link>
	);
}

function GoToTopButton(): T_ReactElementNullable {
	// states & refs
	const [hasToDisplayTheButton, setHasToDisplayTheBottom] = React.useState(false);

	// effects
	useOnWindowStopScroll({
		onScrollStoppedCallback: () => {
			setHasToDisplayTheBottom(false);
		},
		onScrollCallback: () => {
			if (getScrollPosition() > 0) {
				setHasToDisplayTheBottom(true);
			} else {
				setHasToDisplayTheBottom(false);
			}
		},
	});

	// handlers
	function handleGoToTheTopClick(): void {
		setScrollPosition(0);
	}

	if (hasToDisplayTheButton) {
		return (
			<Button
				variant={Button.variant.SIMPLE}
				className="tw-fixed tw-bottom-3 tw-right-3 tw-z-50 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-70 tw-text-2xl sm:tw-right-4 sm:tw-bottom-4"
				onClick={handleGoToTheTopClick}
			>
				<Icon
					icon={Icon.icon.ARROW_UP}
					color="tw-text-white"
				/>
			</Button>
		);
	}

	return null;
}
