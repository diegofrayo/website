import * as React from "react";

import { Block, Button, Icon, Link, Text } from "~/components/primitive";
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
			className="dfr-bg-color-gs-black tw-relative print:tw-hidden"
		>
			<Block className="dfr-max-w-layout dfr-text-color-gs-400 tw-mx-auto tw-px-8 tw-text-center">
				<Block className="tw-pt-16 tw-pb-8">
					<Text className="tw-text-center tw-text-xs tw-font-bold tw-uppercase">contact me</Text>
					<Block className="tw-mt-2 tw-inline-block tw-pt-2">
						<Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
							<FooterIcon
								url={"WEBSITE_METADATA.social.linkedin"}
								icon={Icon.icon.LINKEDIN}
							/>
							<FooterIcon
								url={"WEBSITE_METADATA.social.github"}
								icon={Icon.icon.GITHUB_LIGHT}
							/>
							<FooterIcon
								url={"WEBSITE_METADATA.social.twitter"}
								icon={Icon.icon.TWITTER}
							/>
							<FooterIcon
								url={"WEBSITE_METADATA.social.couchsurfing"}
								icon={Icon.icon.COUCHSURFING}
							/>
							<FooterIcon
								url={"WEBSITE_METADATA.social.spotify"}
								icon={Icon.icon.SPOTIFY}
							/>
						</Block>
					</Block>
				</Block>
				<Block className="tw-py-4 tw-text-xs">
					Diego Rayo | @diegofrayo | Software Developer | {new Date().getFullYear()}
				</Block>
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
};

function FooterIcon({ icon, url }: T_FooterIconProps): T_ReactElement {
	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={url}
			className="tw-m-2 tw-inline-block sm:tw-my-0 sm:tw-ml-0 sm:tw-mr-4 last:sm:tw-mr-0"
		>
			<Icon
				icon={icon}
				size={32}
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
				className="dfr-shadow dfr-bg-color-gs-black tw-fixed tw-bottom-3 tw-right-3 tw-z-50 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-bg-opacity-70 tw-text-2xl sm:tw-right-4 sm:tw-bottom-4"
				onClick={handleGoToTheTopClick}
			>
				<Icon
					icon={Icon.icon.ARROW_UP}
					color="dfr-text-color-gs-white"
				/>
			</Button>
		);
	}

	return null;
}
