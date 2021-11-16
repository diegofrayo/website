import * as React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import type { T_Locale, T_ReactElement, T_HTMLElementAttributes } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "UNSTYLED" | "SIMPLE" | "PRIMARY" | "SECONDARY";
const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "PRIMARY", "SECONDARY"]) as Record<
  T_Variant,
  T_Variant
>;

type T_LinkProps = T_HTMLElementAttributes["a"] & {
  variant: T_Variant;
  isExternalUrl?: boolean;
  locale?: T_Locale;
};

function Link(props: T_LinkProps): T_ReactElement {
  const {
    // utils
    composeLinkAttributes,

    // props
    children,
    variant,
    href,
    className,
    is: Tag,
    isExternalUrl,
    ...rest
  } = useController(props);

  if (!href || !children) {
    console.warn("Link component: href or children are falsy", { href, children });
    return null;
  }

  if (isExternalUrl) {
    return (
      <LinkElement
        href={href}
        className={classNames("dfr-Link", className)}
        twcssVariant={variant}
        is={Tag}
        {...composeLinkAttributes()}
        {...rest}
      >
        {children}
      </LinkElement>
    );
  }

  return (
    <Tag href={href} locale={rest.locale} passHref>
      <LinkElement className={classNames("dfr-Link", className)} twcssVariant={variant} {...rest}>
        {children}
      </LinkElement>
    </Tag>
  );
}

Link.variant = VARIANTS;

export default Link;

// --- Controller ---

function useController({
  children,
  href = "",
  className = "",
  isExternalUrl = false,
  variant = VARIANTS.UNSTYLED,
  ...rest
}: T_LinkProps) {
  function composeLinkAttributes() {
    if (isExternalUrl === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
  }

  return {
    // utils
    composeLinkAttributes,

    // props
    children,
    href,
    className,
    is: isExternalUrl ? "a" : NextLink,
    isExternalUrl,
    variant,
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
  SECONDARY: (props) =>
    `dfr-transition-opacity dfr-text-color-strong dark:dfr-text-color-strong ${
      props.fontWeight || "tw-font-bold"
    }`,
});
