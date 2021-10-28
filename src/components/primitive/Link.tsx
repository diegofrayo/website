import React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale, T_ReactChildrenProp, T_ReactElement, T_HTMLAttributes } from "~/types";
import { getScrollPosition, isSmallScreen, setScrollPosition } from "~/utils/browser";
import { FIXED_HEADER_HEIGHT } from "~/utils/constants";

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

    // handlers
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
          onClick={onClick}
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
  onClick = () => undefined,
  ...rest
}: T_LinkProps) {
  function getExternalAttrs(href, external) {
    if (external === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
  }

  function onClickEnhanced(e) {
    onClick(e);

    setTimeout(() => {
      if (!isSmallScreen() || !href.startsWith("#")) return;

      setScrollPosition(getScrollPosition() - FIXED_HEADER_HEIGHT);
    }, 10);
  }

  return {
    // props
    children,
    href,
    className,
    is,
    external,
    isNextLink,
    variant,
    ...rest,

    // handlers
    onClick: onClickEnhanced,

    // vars
    getExternalAttrs,
  };
}

// --- Components ---

const LinkElement = twcss.a({
  __base: "",
  DEFAULT: "dfr-transition-opacity dfr-text-link dark:dfr-text-link tw-font-bold tw-underline",
  SECONDARY: "dfr-transition-opacity dfr-text-strong dark:dfr-text-strong",
  SIMPLE: "dfr-transition-opacity",
  UNSTYLED: "",
});
