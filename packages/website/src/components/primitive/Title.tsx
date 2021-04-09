import React from "react";
import classNames from "classnames";

import { generateSlug } from "~/utils/strings";

type T_Title = {
  is: "h1" | "h2" | "h3" | "h4";
  children: string | JSX.Element;
  variant?: "PRIMARY" | "SECONDARY" | "UNSTYLED";
  className?: string;
};

function Title(props: T_Title): JSX.Element {
  const { Tag, id, className, children } = useController(props);

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

const VARIANTS: Record<string, "PRIMARY" | "SECONDARY" | "UNSTYLED"> = {
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY",
  UNSTYLED: "UNSTYLED",
};

Title.variant = VARIANTS;

export default Title;

// --- Controller ---

// TODO: TS => Improve props
function useController({
  children,
  is: Tag,
  className,
  variant = VARIANTS.PRIMARY,
}: T_Title): {
  id: string;
  className: string;
  children: T_Title["children"];
  Tag: T_Title["is"];
} {
  function generateStyles(tag: T_Title["is"]): string {
    return classNames(
      variant !== "UNSTYLED" &&
        {
          h1: "tw-text-4xl",
          h2: "tw-text-3xl",
          h3: "tw-text-2xl",
          h4: "tw-text-xl",
        }[tag],
      {
        PRIMARY: "dfr-text-color-secondary dark:dfr-text-color-secondary",
        SECONDARY: "tw-text-black dark:tw-text-white",
        UNSTYLED: "",
      }[variant || ""],
    );
  }

  return {
    id: typeof children === "string" ? generateSlug(children) : "",
    children,
    Tag,
    className: classNames("tw-font-bold tw-font-sans", generateStyles(Tag), className),
  };
}
