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

type T_LinkProps = T_HTMLElementAttributes["a"] & {
  variant: T_Variant;
  isExternalLink?: boolean;
  locale?: T_Locale;
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

  if (!href || !children) {
    logger("WARN", "Link component: href or children are falsy", { href, children });
    return null;
  }

  if (isExternalLink) {
    return (
      <LinkElement
        href={href}
        className={classNames("dfr-Link", className)}
        twcssVariant={variant}
        {...composeLinkAttributes()}
        {...rest}
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
        className={classNames("dfr-Link", className)}
        twcssVariant={variant}
        {...rest}
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
  __base: "",
  UNSTYLED: "",
  SIMPLE: "dfr-transition-opacity",
  PRIMARY:
    "dfr-transition-opacity dfr-link-color-primary dark:dfr-link-color-primary tw-font-bold tw-underline",
  SECONDARY: () =>
    "dfr-transition-opacity dfr-text-color-dark-strong tw-font-bold dark:dfr-text-color-light-strong",
});
