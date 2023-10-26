import * as React from "react";
import NextLink, { LinkProps } from "next/link";
import cn from "classnames";
import { cva } from "class-variance-authority";

import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;

type T_AnchorHtmlAttributes = DR.DOM.HTMLElementAttributes["a"];
type T_LinkBase = {
	variant?: T_Variant;
};

interface I_NativeLink extends T_AnchorHtmlAttributes, T_LinkBase {
	href: string;
	isExternalLink: true;
}

interface I_NextLink extends LinkProps, T_LinkBase {
	href: string;
	children: DR.React.Children;
	className?: string;
}

export type T_LinkProps = I_NativeLink | I_NextLink;

// --- COMPONENT DEFINITION ---

function Link({ variant = VARIANTS.UNSTYLED, ...props }: T_LinkProps) {
	// --- UTILS ---
	function composeLinkAttributes(): { target?: "_blank"; rel?: "noreferrer" } {
		if (props.href.startsWith("#")) {
			return {};
		}

		return { target: "_blank", rel: "noreferrer" };
	}

	if ("isExternalLink" in props) {
		return (
			<a
				href={props.href}
				className={cn(
					`dr-link dr-link--${variant.toLowerCase()}`,
					styles({ variant }),
					props.className,
				)}
				{...composeLinkAttributes()}
			>
				{props.children}
			</a>
		);
	}

	return (
		<NextLink
			href={props.href}
			className={cn(
				`dr-link dr-link--${variant.toLowerCase()}`,
				styles({ variant }),
				props.className,
			)}
			passHref
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
			[VARIANTS.SIMPLE]: "dr-transition-opacity",
			[VARIANTS.STYLED]:
				"tw-font-bold tw-underline dr-transition-opacity dr-text-color-primary-100",
		},
	},
});
