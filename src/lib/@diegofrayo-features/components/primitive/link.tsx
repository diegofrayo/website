import { cva } from "class-variance-authority";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror, omit } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SMOOTH", "STYLED"]);
type Variant = keyof typeof VARIANTS;

type AnchorHtmlAttributes = DR.DOM.HTMLElementAttributes["a"];
type LinkBase = {
	variant?: Variant;
};

interface NativeLink extends AnchorHtmlAttributes, LinkBase {
	href: string;
	isExternalLink: true;
}

interface NextLink extends NextLinkProps, LinkBase {
	isExternalLink?: false;
	href: string;
	children: DR.React.Children;
	className?: string;
}

type LinkProps = NativeLink | NextLink;

// --- COMPONENT DEFINITION ---

function Link({ variant = VARIANTS.UNSTYLED, href, className, ...props }: LinkProps) {
	// --- UTILS ---
	function composeLinkAttributes(): { target?: "_blank"; rel?: "noreferrer" } {
		if (href.startsWith("#")) return {};

		return { target: "_blank", rel: "noreferrer" };
	}

	if ("isExternalLink" in props && props.isExternalLink === true) {
		return (
			<a
				href={href}
				className={cn(`dr-link dr-link--${variant.toLowerCase()}`, styles({ variant }), className)}
				{...composeLinkAttributes()}
				{...omit(props, ["isExternalLink"])}
			>
				{props.children}
			</a>
		);
	}

	return (
		<NextLink
			href={href}
			className={cn(`dr-link dr-link--${variant.toLowerCase()}`, styles({ variant }), className)}
			passHref
			{...omit(props, ["isExternalLink"])}
		>
			{props.children}
		</NextLink>
	);
}

Link.variant = VARIANTS;

export default Link;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.SMOOTH]: "with-transition-opacity",
			[VARIANTS.STYLED]: "with-transition-opacity font-bold text-blue-700 underline",
		},
	},
});
