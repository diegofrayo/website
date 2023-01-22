"use client";

import { Block, Link } from "~/components/primitive";

function Header() {
	return (
		<Block
			is="header"
			className="tw-border-b tw-border-slate-200 tw-py-8"
		>
			<Block className="tw-mx-auto tw-w-full tw-max-w-screen-lg">
				<Link
					variant={Link.variant.SIMPLE}
					href="/"
					className="tw-inline-block"
				>
					<h1 className="tw-text-center tw-text-3xl tw-font-bold tw-italic tw-text-blue-800">
						diegofrayo
					</h1>
				</Link>
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
