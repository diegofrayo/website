import React from "react";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { TypeLocale } from "~/types";

type NextLink = any;

type TypeLinkProps = {
  children: any;
  href: string;
  className?: string;
  role?: "button";
  variant?: "DEFAULT" | "SECONDARY" | "UNSTYLED";
  is?: string | NextLink;
  external?: boolean;
  isNextLink?: boolean;
  locale?: TypeLocale;
};

function Link({
  children,
  href,
  className,
  is = "a",
  external = true,
  isNextLink = false,
  variant = "DEFAULT",
  ...rest
}: TypeLinkProps): any {
  if (!href || !children) {
    console.warn("Link component: href or children are falsy");
    return null;
  }

  function getExternalAttrs() {
    if (external === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
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
      {...getExternalAttrs()}
      {...rest}
    >
      {children}
    </LinkElement>
  );
}

const VARIANTS: Record<string, "DEFAULT" | "SECONDARY" | "UNSTYLED"> = {
  DEFAULT: "DEFAULT",
  SECONDARY: "SECONDARY",
  UNSTYLED: "UNSTYLED",
};

Link.variant = VARIANTS;

export default Link;

// --- Components ---

const LinkElement = twcss.a({
  __base: "tw-transition-opacity hover:tw-opacity-75",
  DEFAULT: "tw-font-bold tw-underline dfr-text-color-links dark:dfr-text-color-links",
  SECONDARY: "tw-text-black dark:tw-text-white",
  UNSTYLED: "",
});
