import * as React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import { mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import type {
	T_HTMLElementAttributes,
	T_ReactElementNullable,
} from "~/@diegofrayo/library/types/react";

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "PRIMARY", "SECONDARY"]);
type T_Variant = keyof typeof VARIANTS;

export type T_LinkProps = T_HTMLElementAttributes["a"] & {
	variant: T_Variant;
	href: string;
	children: T_HTMLElementAttributes["a"]["children"];
};

function Link(props: T_LinkProps): T_ReactElementNullable {
	const {
		// props
		children,
		href,
		htmlAttributes,

		// vars
		isExternalLink,
		composedClassName,

		// utils
		composeLinkAttributes,
	} = useLink(props);

	if (isExternalLink) {
		return (
			<a
				{...composeLinkAttributes(isExternalLink)}
				{...htmlAttributes}
				href={href}
				className={composedClassName}
			>
				{children}
			</a>
		);
	}

	return (
		<NextLink
			href={href}
			className={composedClassName}
			passHref
		>
			{children}
		</NextLink>
	);
}

Link.variant = VARIANTS;

export default Link;

// --- Controller ---

type T_UseControllerReturn = Pick<T_LinkProps, "children" | "href"> & {
	htmlAttributes: Omit<T_HTMLElementAttributes["a"], "className" | "href">;
	isExternalLink: boolean;
	composedClassName: string;
	composeLinkAttributes: (isExternalLink: boolean) => { target: "_blank"; rel: "noreferrer" } | {};
};

function useLink({
	href = "",
	variant,
	className = "",
	children,
	...htmlAttributes
}: T_LinkProps): T_UseControllerReturn {
	// vars
	const isExternalLink = href.startsWith("/") === false && href.startsWith("#") === false;
	const composedClassName = classNames(className, {
		"dfr-transition-opacity": variant === VARIANTS.SIMPLE,
		"dfr-transition-opacity dfr-text-color-links tw-font-bold tw-underline":
			variant === VARIANTS.PRIMARY,
		"dfr-transition-opacity dfr-text-color-bw tw-font-bold": variant === VARIANTS.SECONDARY,
	});

	// utils
	const composeLinkAttributes: T_UseControllerReturn["composeLinkAttributes"] =
		function composeLinkAttributes(isExternalLink) {
			if (isExternalLink) {
				return { target: "_blank", rel: "noreferrer" };
			}

			return {};
		};

	return {
		// vars
		isExternalLink,
		composedClassName,

		// utils
		composeLinkAttributes,

		// props
		href,
		children,
		htmlAttributes,
	};
}
