import * as React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale } from "~/features/i18n";
import { logger } from "~/features/logging";
import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "PRIMARY", "SECONDARY"]);
type T_Variant = keyof typeof VARIANTS;

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
				data-variant={variant}
			>
				{children}
			</LinkElement>
		);
	}

	return (
		<LinkElement
			{...rest}
			href={href}
			locale={rest.locale || false}
			passHref
			className={classNames("dfr-Link", className)}
			TWCSSVariant={variant}
			is={NextLink}
			data-variant={variant}
		>
			{children}
		</LinkElement>
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
	PRIMARY: "dfr-transition-opacity dfr-text-color-links tw-font-bold tw-underline",
	SECONDARY: () => "dfr-transition-opacity dfr-text-color-bw tw-font-bold",
});
