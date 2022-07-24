import * as React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale } from "~/i18n";
import { logger } from "~/utils/app";
import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

const VARIANTS_OPTIONS = ["UNSTYLED", "SIMPLE", "PRIMARY", "SECONDARY"] as const;
type T_Variant = typeof VARIANTS_OPTIONS[number];
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);

export type T_LinkProps = T_HTMLElementAttributes["a"] & {
	variant: T_Variant;
	isExternalLink?: boolean;
	locale?: T_Locale;
	href: string;
};

function Link(props: T_LinkProps): T_ReactElementNullable {
	const {
		// utils
		composeLinkAttributes,

		// props
		children,
		variant,
		href,
		className,
		isExternalLink,
		...rest
	} = useController(props);

	if (!children) {
		logger("WARN", '"children" prop is not valid', { href, children });
		return null;
	}

	if (isExternalLink) {
		return (
			<LinkElement
				{...composeLinkAttributes()}
				{...rest}
				href={href}
				className={classNames("dfr-Link", className)}
				TWCSSVariant={variant}
				is="a"
				data-variant={variant}
			>
				{children}
			</LinkElement>
		);
	}

	return (
		<NextLink
			href={href}
			locale={rest.locale || false}
			passHref
		>
			<LinkElement
				{...rest}
				className={classNames("dfr-Link", className)}
				TWCSSVariant={variant}
				is="a"
				data-variant={variant}
			>
				{children}
			</LinkElement>
		</NextLink>
	);
}

Link.variant = VARIANTS;

export default Link;

// --- Controller ---

type T_UseControllerReturn = T_LinkProps & {
	composeLinkAttributes: () => { target?: "_blank"; rel?: "noreferrer" };
};

function useController({
	href = "",
	isExternalLink = false,
	...rest
}: T_LinkProps): T_UseControllerReturn {
	const composeLinkAttributes: T_UseControllerReturn["composeLinkAttributes"] =
		function composeLinkAttributes() {
			if (isExternalLink === false || href.startsWith("#")) {
				return {};
			}

			return { target: "_blank", rel: "noreferrer" };
		};

	return {
		// utils
		composeLinkAttributes,

		// props
		href,
		isExternalLink,
		...rest,
	};
}

// --- Components ---

const LinkElement = twcss.a({
	$TWCSS_BASE_STYLES: "",
	UNSTYLED: "",
	SIMPLE: "dfr-transition-opacity",
	PRIMARY: "dfr-transition-opacity dfr-links-inv tw-font-bold tw-underline",
	SECONDARY: () => "dfr-transition-opacity dfr-text-color-bw-inv tw-font-bold",
});
