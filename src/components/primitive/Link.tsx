import * as React from "react";
import classNames from "classnames";
import NextLink from "next/link";

import twcss from "~/lib/twcss";
import { T_Locale, T_ReactElement, T_HTMLElementAttributes } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "UNSTYLED" | "SIMPLE" | "PRIMARY" | "SECONDARY";
const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "PRIMARY", "SECONDARY"]) as Record<
  T_Variant,
  T_Variant
>;

type T_LinkProps = T_HTMLElementAttributes["a"] & {
  variant: T_Variant;
  external?: boolean;
  is?: "a" | typeof NextLink;
  locale?: T_Locale;
  fontWeight?: string;
};

function Link(props: T_LinkProps): T_ReactElement {
  const {
    // handlers
    onClick,

    // utils
    getExternalAttrs,

    // props
    children,
    variant,
    href,
    className,
    is: Tag,
    external,
    fontWeight,
    ...rest
  } = useController(props);

  if (!href || !children) {
    console.warn("Link component: href or children are falsy");
    return null;
  }

  if (Tag === NextLink) {
    return (
      <Tag href={href} locale={rest.locale} passHref>
        <LinkElement
          className={classNames("dfr-Link", className)}
          twcssVariant={variant}
          fontWeight={fontWeight}
          onClick={onClick}
          {...rest}
        >
          {children}
        </LinkElement>
      </Tag>
    );
  }

  return (
    <LinkElement
      href={href}
      className={classNames("dfr-Link", className)}
      twcssVariant={variant}
      is={Tag}
      fontWeight={fontWeight}
      onClick={onClick}
      {...getExternalAttrs(href, external)}
      {...rest}
    >
      {children}
    </LinkElement>
  );
}

Link.variant = VARIANTS;

export default Link;

// --- Controller ---

function useController({
  children,
  href = "",
  className = "",
  is,
  external = false,
  variant = VARIANTS.UNSTYLED,
  onClick,
  ...rest
}: T_LinkProps) {
  function getExternalAttrs(href, external) {
    if (external === false || href.startsWith("#")) return {};
    return { target: "_blank", rel: "noreferrer" };
  }

  return {
    // handlers
    onClick,

    // utils
    getExternalAttrs,

    // props
    children,
    href,
    className,
    is: external ? is : is || NextLink,
    external,
    variant,
    ...rest,
  };
}

// --- Components ---

const LinkElement = twcss.a({
  __base: "",
  UNSTYLED: "",
  SIMPLE: "dfr-transition-opacity",
  PRIMARY: "dfr-transition-opacity dfr-text-link dark:dfr-text-link tw-font-bold tw-underline",
  SECONDARY: (props) =>
    `dfr-transition-opacity dfr-text-strong dark:dfr-text-strong ${
      props.fontWeight || "tw-font-bold"
    }`,
});
