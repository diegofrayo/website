"use client";

import * as React from "react";

import { Block, Button, Icon, Link, List } from "~/components/primitive";
import { generateSlug } from "~/@diegofrayo/library/utils/strings";
import { useOnWindowResize } from "~/@diegofrayo/library/hooks";

function Header() {
	// states & refs
	const [isMenuOpened, setIsMenuOpened] = React.useState(false);

	// vars
	const MENU = [
		{ text: "About me", url: "/about-me" },
		{ text: "Resume", url: "/resume" },
		{ text: "Blog", url: "/blog" },
		{ text: "Music", url: "/music" },
		{ text: "Bookmarks", url: "/bookmarks" },
	];

	// effects
	useOnWindowResize(() => {
		// TODO: [refactor] Create screen sizes helpers
		if (window.innerWidth >= 768) {
			setIsMenuOpened(true);
		} else {
			setIsMenuOpened((currentValue) => currentValue || false);
		}
	});

	// handlers
	function handleToggleMenuClick() {
		setIsMenuOpened((currentValue) => !currentValue);
	}

	return (
		<Block
			is="header"
			className="tw-border-b tw-border-slate-200 tw-px-0 tw-py-0 md:tw-px-8 md:tw-py-8"
		>
			<Block className="tw-mx-auto tw-flex tw-w-full tw-flex-col dfr-max-w-layout md:tw-flex-row md:tw-items-center md:tw-justify-between">
				<Block className="tw-px-10 tw-py-5 tw-text-center md:tw-p-0">
					<Link
						variant={Link.variant.SIMPLE}
						href="/"
						className="tw-inline-block"
					>
						<h1 className="tw-text-center tw-text-3xl tw-font-bold tw-italic tw-text-black">
							diegofrayo
						</h1>
					</Link>
					<Button
						className="tw-float-right tw-inline-block md:tw-hidden"
						onClick={handleToggleMenuClick}
					>
						<Icon
							icon={Icon.icon.MENU}
							size={36}
						/>
					</Button>
				</Block>
				<Block is="nav">
					{isMenuOpened ? (
						<List
							className="tw-border-t tw-border-slate-200 tw-bg-slate-100 tw-py-2 md:tw-border-0
						md:tw-bg-transparent"
						>
							{MENU.map((item) => {
								return (
									<List.Item
										key={generateSlug(item.text)}
										className="tw-my-4 tw-block tw-text-center tw-font-bold tw-text-slate-700 md:tw-ml-4 md:tw-inline-block md:first:tw-ml-0"
									>
										<Link
											variant={Link.variant.SIMPLE}
											href={item.url}
										>
											{item.text}
										</Link>
									</List.Item>
								);
							})}
						</List>
					) : null}
				</Block>
			</Block>
		</Block>
	);
}

export default Header;

// TODO: [css] border-image for the title (https://css-generators.com/custom-borders/)
/* <Block className="border tw-h-1.5 tw-rounded-md tw-bg-yellow-800" /> */
/* <style jsx>{`
	.root :global(div) {
	--mask: conic-gradient(from -60deg at bottom, #0000, #000 0deg 115deg, #0000 100deg) 100%/10px
	100%;
	-webkit-mask: var(--mask);
	mask: var(--mask);
	}
	`}</style> */
