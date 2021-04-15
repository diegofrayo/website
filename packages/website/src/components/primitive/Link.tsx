import React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale, T_ReactChildrenProp, T_ReactElement, T_HTML_Attributes } from "~/types";
import { getScrollPosition, isSmallScreen, setScrollPosition } from "~/utils/browser";

enum E_Variants {
  DEFAULT = "DEFAULT",
  SECONDARY = "SECONDARY",
  UNSTYLED = "UNSTYLED",
}

type T_LinkProps = T_HTML_Attributes["a"] & {
  children: T_ReactChildrenProp;
  disabled?: boolean;
  external?: boolean;
  is?: string;
  isNextLink?: boolean;
  locale?: T_Locale;
  role?: "button";
  variant?: E_Variants;
};

function Link({
  children,
  href = "",
  className = "",
  is = "a",
  external = true,
  isNextLink = false,
  variant = E_Variants.DEFAULT,
  ...rest
}: T_LinkProps): T_ReactElement {
  const { getExternalAttrs, onClick } = useController(href);

  if (!href || !children) {
    console.warn("Link component: href or children are falsy");
    return null;
  }

  if (isNextLink === true) {
    return (
      <NextLink href={href} locale={rest.locale} passHref>
        <LinkElement
          className={classNames("dfr-Link", className)}
          twcssVariant={variant}
          is={is}
          {...rest}
        >
          {children}
        </LinkElement>
      </NextLink>
    );
  }

  return (
    <LinkElement
      href={href}
      className={classNames("dfr-Link", className)}
      twcssVariant={variant}
      is={is}
      onClick={onClick}
      {...getExternalAttrs(href, external)}
      {...rest}
    >
      {children}
    </LinkElement>
  );
}

Link.variant = E_Variants;

export default Link;

// --- Controller ---

function useController(href) {
  function getExternalAttrs(href, external) {
    if (external === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
  }

  function onClick() {
    setTimeout(() => {
      if (!isSmallScreen()) return;

      setScrollPosition(getScrollPosition() - 80);
    }, 10);
  }

  return {
    getExternalAttrs,
    onClick: href.startsWith("#") ? onClick : undefined,
  };
}

// --- Components ---

const LinkElement = twcss.a({
  __base: "tw-transition-opacity hover:tw-opacity-75",
  DEFAULT: "tw-font-bold tw-underline dfr-text-color-links dark:dfr-text-color-links",
  SECONDARY: "tw-text-black dark:tw-text-white",
  UNSTYLED: "",
});
