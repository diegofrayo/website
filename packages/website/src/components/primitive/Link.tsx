import React from "react";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale } from "~/types";

type NextLink = any;

type T_LinkProps = {
  children: any;
  href: string;
  className?: string;
  role?: "button";
  variant?: "DEFAULT" | "SECONDARY" | "UNSTYLED";
  is?: string | NextLink;
  external?: boolean;
  isNextLink?: boolean;
  locale?: T_Locale;
  disabled?: boolean;
};

function Link({
  children,
  href = "",
  className = "",
  is = "a",
  external = true,
  isNextLink = false,
  variant = VARIANTS.DEFAULT,
  ...rest
}: T_LinkProps): JSX.Element | null {
  const { getExternalAttrs } = useController();

  if (!href || !children) {
    console.warn("Link component: href or children are falsy");
    return null;
  }

  if (isNextLink === true) {
    return (
      <NextLink href={href} locale={rest.locale} passHref>
        <LinkElement className={className} tw-variant={variant} is={is} {...rest}>
          {children}
        </LinkElement>
      </NextLink>
    );
  }

  return (
    <LinkElement
      href={href}
      className={className}
      tw-variant={variant}
      is={is}
      {...getExternalAttrs(href, external)}
      {...rest}
    >
      {children}
    </LinkElement>
  );
}

const VARIANTS: Record<string, T_LinkProps["variant"]> = {
  DEFAULT: "DEFAULT",
  SECONDARY: "SECONDARY",
  UNSTYLED: "UNSTYLED",
};

Link.variant = VARIANTS;

export default Link;

// --- Controller ---

function useController() {
  function getExternalAttrs(href, external) {
    if (external === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
  }

  return { getExternalAttrs };
}

// --- Components ---

const LinkElement = twcss.a({
  __base: "tw-transition-opacity hover:tw-opacity-75",
  DEFAULT: "tw-font-bold tw-underline dfr-text-color-links dark:dfr-text-color-links",
  SECONDARY: "tw-text-black dark:tw-text-white",
  UNSTYLED: "",
});
