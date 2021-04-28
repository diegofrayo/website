import React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale, T_ReactChildrenProp, T_ReactElement, T_HTMLAttributes } from "~/types";
import { getScrollPosition, isSmallScreen, setScrollPosition } from "~/utils/browser";

enum E_Variants {
  DEFAULT = "DEFAULT",
  SECONDARY = "SECONDARY",
  SIMPLE = "SIMPLE",
  UNSTYLED = "UNSTYLED",
}

type T_LinkProps = T_HTMLAttributes["a"] & {
  children: T_ReactChildrenProp;
  disabled?: boolean;
  external?: boolean;
  is?: string;
  isNextLink?: boolean;
  locale?: T_Locale;
  role?: "button";
  variant?: E_Variants;
};

function Link(props: T_LinkProps): T_ReactElement {
  const {
    // vars
    getExternalAttrs,
    onClick,

    // props
    children,
    href,
    className,
    is,
    external,
    isNextLink,
    variant,
    ...rest
  } = useController(props);

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

function useController({
  children,
  href = "",
  className = "",
  is = "a",
  external = true,
  isNextLink = false,
  variant = E_Variants.DEFAULT,
  ...rest
}: T_LinkProps) {
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
    children,
    href,
    className,
    is,
    external,
    isNextLink,
    variant,
    ...rest,

    // vars
    getExternalAttrs,
    onClick: href.startsWith("#") ? onClick : undefined,
  };
}

// --- Components ---

const LinkElement = twcss.a({
  __base: "",
  DEFAULT:
    "tw-transition-opacity hover:tw-opacity-75 tw-font-bold tw-underline dfr-text-color-links dark:dfr-text-color-links",
  SECONDARY: "tw-transition-opacity hover:tw-opacity-75 tw-text-black dark:tw-text-white",
  SIMPLE: "tw-transition-opacity hover:tw-opacity-75",
  UNSTYLED: "",
});
