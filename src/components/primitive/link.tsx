import { cva } from "class-variance-authority";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror, omit } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const LinkVariants = keyMirror(["UNSTYLED", "SMOOTH", "STYLED"]);
type LinkVariant = keyof typeof LinkVariants;

type AnchorHtmlAttributes = ReactTypes.DOM.HTMLElementAttributes["a"];
type LinkBase = {
	variant?: LinkVariant;
};

interface NativeLink extends AnchorHtmlAttributes, LinkBase {
	href: string;
	isExternalLink: true;
}

interface NextLink extends NextLinkProps, LinkBase {
	isExternalLink?: false;
	href: string;
	children: ReactTypes.Children;
	className?: string;
}

type LinkProps = NativeLink | NextLink;

// --- COMPONENT DEFINITION ---

function Link({
	variant = LinkVariants.UNSTYLED,
	href,
	className,
	...props
}: LinkProps): ReactTypes.JSXElement {
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

export { LinkVariants, type LinkVariant };

export default Link;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[LinkVariants.UNSTYLED]: "",
			[LinkVariants.SMOOTH]: "u-transition-opacity",
			[LinkVariants.STYLED]: "u-transition-opacity font-bold text-blue-700 underline",
		},
	},
});
