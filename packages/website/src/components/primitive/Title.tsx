import React from "react";
import classNames from "classnames";

import { T_ReactChildrenProp, T_ReactFCReturn } from "~/types";
import { generateSlug } from "~/utils/strings";

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

type T_Title = {
  children: T_ReactChildrenProp;
  is: "h1" | "h2" | "h3" | "h4";
  variant?: E_Variants;
  size?: E_Size;

  className?: string;
};

function Title(props: T_Title): T_ReactFCReturn {
  const { Tag, id, className, children } = useController(props);

  return (
    <Tag id={id} className={className}>
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
}: T_Title): Omit<T_Title, "is" | "variant"> & {
  id: string;
  Tag: T_Title["is"];
} {
  function generateStyles(tag: T_Title["is"]): string {
    return classNames(
      {
        PRIMARY: classNames(
          "dfr-text-color-secondary dark:dfr-text-color-secondary",
          {
            h4: "tw-text-xl",
            h3: "tw-text-2xl",
            h2: "tw-text-3xl",
            h1: "tw-text-4xl",
          }[tag],
        ),
        SECONDARY: "tw-text-black dark:tw-text-white",
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
    id: typeof children === "string" ? generateSlug(children) : "",
    children,
    Tag,
    className: classNames("tw-font-bold tw-font-sans", generateStyles(Tag), className),
  };
}
