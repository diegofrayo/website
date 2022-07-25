import * as React from "react";
import { useRouter } from "next/router";

import { Block, Button, Icon, Link, Title, Text } from "~/components/primitive";
import { useOnWindowStopScroll } from "~/hooks";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata, T_WebsiteMetadata } from "~/state/modules/metadata";
import { getScrollPosition, setScrollPosition } from "~/utils/browser";
import { isNotEmptyString } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement, T_ReactElementNullable } from "~/types";

import Header from "./Header";
import { T_IconName } from "../primitive/Icon";

type T_MainLayoutProps = {
	title: string;
	children: T_ReactChildren;
	hasToDisplayGoToTheTopButton?: boolean;
};

function MainLayout({
	children,
	title = "",
	hasToDisplayGoToTheTopButton = true,
}: T_MainLayoutProps): T_ReactElement {
	// hooks
	const { pathname } = useRouter();

	// vars
	const parentUrl = getParentURL();

	// utils
	function getParentURL(): string {
		if (pathname === "/") return "";

		const urlParts = pathname.split("/");

		return `${urlParts.slice(0, urlParts.length - 1).join("/")}/`;
	}

	// render
	return (
		<Block is="main">
			<Block className="tw-mx-auto tw-px-8 dfr-max-w-layout">
				<Header />

				<Block
					id="body"
					className="tw-py-32"
				>
					{isNotEmptyString(title) ? (
						<Block className="tw-text-center">
							{isNotEmptyString(parentUrl) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={parentUrl}
									className="tw-mb-4 tw-block tw-underline dfr-text-color-bw"
								>
									{parentUrl}
								</Link>
							) : null}

							<Title
								is="h1"
								variant={Title.variant.UNSTYLED}
								className="tw-mb-16 tw-text-3xl tw-font-bold tw-uppercase dfr-text-color-bw sm:tw-text-6xl"
							>
								{title}
							</Title>
						</Block>
					) : null}
					{children}
				</Block>
			</Block>

			<Footer hasToDisplayGoToTheTopButton={hasToDisplayGoToTheTopButton} />
		</Block>
	);
}

export default MainLayout;

// --- Components ---

type T_FooterProps = Pick<T_MainLayoutProps, "hasToDisplayGoToTheTopButton">;

function Footer({ hasToDisplayGoToTheTopButton }: T_FooterProps): T_ReactElement {
	// hooks
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

	// render
	return (
		<Block
			is="footer"
			className="tw-relative dfr-bg-color-gs-black print:tw-hidden"
		>
			<Block className="tw-mx-auto tw-px-8 tw-text-center dfr-max-w-layout dfr-text-color-gs-400">
				<Block className="tw-pt-16 tw-pb-8">
					<Text className="tw-text-center tw-text-xs tw-font-bold tw-uppercase">contact me</Text>
					<Block className="tw-mt-2 tw-inline-block tw-border-t tw-pt-2 dfr-border-color-gs-700">
						<Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
							<FooterIcon
								url={WEBSITE_METADATA.social.linkedin}
								icon={Icon.icon.LINKEDIN}
							/>
							<FooterIcon
								url={WEBSITE_METADATA.social.github}
								icon={Icon.icon.GITHUB_LIGHT}
							/>
							<FooterIcon
								url={WEBSITE_METADATA.social.twitter}
								icon={Icon.icon.TWITTER}
							/>
							<FooterIcon
								url={WEBSITE_METADATA.social.couchsurfing}
								icon={Icon.icon.COUCHSURFING}
							/>
							<FooterIcon
								url={WEBSITE_METADATA.social.spotify}
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

type T_FooterIconProps = { icon: T_IconName; url: string };

function FooterIcon({ icon, url }: T_FooterIconProps): T_ReactElement {
	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={url}
			className="tw-m-2 tw-inline-block sm:tw-my-0 sm:tw-ml-0 sm:tw-mr-4 last:sm:tw-mr-0"
			isExternalLink
		>
			<Icon
				icon={icon}
				size="tw-w-8 tw-h-8"
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

	// render
	if (hasToDisplayTheButton) {
		return (
			<Button
				variant={Button.variant.SIMPLE}
				className="tw-fixed tw-bottom-3 tw-right-3 tw-z-50 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-border tw-bg-opacity-70 tw-text-2xl dfr-border-color-gs-700 dfr-bg-color-gs-black sm:tw-right-4 sm:tw-bottom-4"
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
