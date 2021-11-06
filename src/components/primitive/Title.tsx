import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactChildrenProp, T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

import Icon from "./Icon";
import Link from "./Link";

enum E_Size {
  SM = "SM",
  MD = "MD",
  LG = "LG",
  XL = "XL",
}

enum E_Variants {
  "PRIMARY" = "PRIMARY", // For Markdown
  "SECONDARY" = "SECONDARY", // Black/White
  "UNSTYLED" = "UNSTYLED",
}

type T_TitleProps = {
  children: T_ReactChildrenProp;
  is: "h1" | "h2" | "h3" | "h4";
  variant?: E_Variants;
  size?: E_Size;
  showLinkIcon?: boolean;
} & T_HTMLAttributes["h1"];

function Title(props: T_TitleProps): T_ReactElement {
  const {
    // props
    variant,
    showLinkIcon,
    children,

    // vars
    id,
    className,
    Tag,

    ...rest
  } = useController(props);

  if (variant === E_Variants.PRIMARY && showLinkIcon) {
    return (
      <Tag id={id} className={className} {...rest}>
        <Link
          variant={Link.variant.SIMPLE}
          href={`#${id}`}
          className={classNames(
            "tw-visible sm:tw-invisible tw-float-left tw--ml-5 tw-pr-1 tw-leading-0",
            {
              h1: "tw-pt-3",
              h2: "tw-pt-2.5",
              h3: "tw-pt-2",
              h4: "tw-pt-1.5",
            }[Tag],
          )}
        >
          <Icon icon={Icon.icon.LINK} size={16} />
        </Link>

        {children}

        <style jsx>{`
          :global(.dfr-Title--primary):hover :global(.dfr-Link) {
            visibility: visible;
          }

          :global(.dfr-Title--primary) {
            scroll-margin-top: 20px;
          }
        `}</style>
      </Tag>
    );
  }

  return (
    <Tag id={id} className={classNames(className)}>
      {children}
    </Tag>
  );
}

Title.variant = E_Variants;
Title.size = E_Size;

export default Title;

// --- Controller ---

function useController({
  children,
  is: Tag,
  className = "",
  size = undefined,
  variant = E_Variants.PRIMARY,
  showLinkIcon = false,
  id = "",
  ...rest
}: T_TitleProps): Omit<T_TitleProps, "is"> & {
  id: string;
  Tag: T_TitleProps["is"];
} {
  function generateStyles(tag: T_TitleProps["is"]): string {
    return classNames(
      {
        PRIMARY: classNames(
          "dfr-text-strong dark:dfr-text-strong",
          {
            h4: "tw-text-xl",
            h3: "tw-text-2xl",
            h2: "tw-text-3xl",
            h1: "tw-text-4xl",
          }[tag],
        ),
        SECONDARY: "dfr-text-strong dark:dfr-text-strong",
        UNSTYLED: "",
      }[variant],
      size !== undefined &&
        {
          SM: "tw-text-xl",
          MD: "tw-text-2xl",
          LG: "tw-text-3xl",
          XL: "tw-text-4xl",
        }[size],
    );
  }

  return {
    // props
    variant,
    showLinkIcon,
    children,
    ...rest,

    // vars
    id:
      variant === E_Variants.PRIMARY && typeof children === "string" ? generateSlug(children) : id,
    className: classNames(
      `dfr-Title dfr-Title--${variant.toLowerCase()}`,
      "tw-font-bold tw-font-sans",
      generateStyles(Tag),
      className,
    ),
    Tag,
  };
}
