import * as React from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

import { Block, Button, Icon, Link, Title } from "~/components/primitive";
import { useDidMount, useOnWindowStopScroll } from "~/hooks";
import v from "~/lib/v";
import { getScrollPosition, setScrollPosition } from "~/utils/browser";
import type { T_ReactChildren, T_ReactElement, T_ReactElementNullable } from "~/types";

import Header from "./components/Header";

type T_MainLayoutProps = {
	title: string;
	children: T_ReactChildren;
	hasToDisplayGoToTheTopButton?: boolean;
	width?: string;
};

function MainLayout({
	children,
	title = "",
	hasToDisplayGoToTheTopButton = true,
	width,
}: T_MainLayoutProps): T_ReactElement {
	// --- HOOKS ---
	const { pathname } = useRouter();

	// --- VARS ---
	const parentUrl = getParentURL();

	// --- UTILS ---
	function getParentURL(): string {
		if (pathname === "/") return "";

		const urlParts = pathname.split("/");

		return `${urlParts.slice(0, urlParts.length - 1).join("/")}/`;
	}

	return (
		<Block is="main">
			<Block className={classNames("tw-mx-auto tw-px-8", width || "dfr-max-w-layout")}>
				<Header />

				<Block
					id="body"
					className="tw-py-32"
				>
					{v.isNotEmptyString(title) ? (
						<Block className="tw-text-center">
							{v.isNotEmptyString(parentUrl) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={parentUrl}
									className="tw-mb-4 tw-inline-block tw-underline dfr-text-color-bw"
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

// --- COMPONENTS ---

type T_FooterProps = Pick<T_MainLayoutProps, "hasToDisplayGoToTheTopButton">;

function Footer({ hasToDisplayGoToTheTopButton }: T_FooterProps): T_ReactElementNullable {
	// --- STATES & REFS ---
	const [bodyHasScroll, setBodyHasScroll] = React.useState(true);
	const [showFooter, setShowFooter] = React.useState(false);

	// --- EFFECTS ---
	useDidMount(() => {
		function bodyObserver(): void {
			setBodyHasScroll(
				document.documentElement.scrollHeight > document.documentElement.clientHeight,
			);
			setShowFooter(true);
		}

		bodyObserver();

		const observer = new ResizeObserver(bodyObserver);
		observer.observe(document.body);

		return () => {
			observer.disconnect();
		};
	});

	if (!showFooter) {
		return null;
	}

	return (
		<Block
			is="footer"
			className={classNames(
				"tw-w-full tw-py-2 dfr-bg-color-gs-black print:tw-hidden",
				!bodyHasScroll && "tw-absolute tw-bottom-0",
			)}
		>
			<Block className="tw-mx-auto tw-px-8 tw-py-2 tw-text-center tw-text-sm dfr-max-w-layout dfr-text-color-gs-400">
				DR Tools | {new Date().getFullYear()}
			</Block>

			{hasToDisplayGoToTheTopButton ? <GoToTopButton /> : null}
		</Block>
	);
}

function GoToTopButton(): T_ReactElementNullable {
	// --- STATES & REFS ---
	const [hasToDisplayTheButton, setHasToDisplayTheBottom] = React.useState(false);

	// --- EFFECTS ---
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

	// --- HANDLERS ---
	function handleGoToTheTopClick(): void {
		setScrollPosition(0);
	}

	if (hasToDisplayTheButton) {
		return (
			<Button
				variant={Button.variant.SIMPLE}
				className="tw-fixed tw-bottom-3 tw-right-3 tw-z-50 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-bg-opacity-70 tw-text-2xl dfr-shadow dfr-bg-color-gs-black sm:tw-bottom-4 sm:tw-right-4"
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
