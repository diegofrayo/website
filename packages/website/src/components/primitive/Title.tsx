import React from "react";
import classnames from "classnames";

import { generateSlug } from "~/utils/strings";

type TypeTitle = {
  is: "h1" | "h2" | "h3" | "h4";
  children: string | JSX.Element;
  variant?: "PRIMARY" | "SECONDARY";
  className?: string;
};

function Title(props: TypeTitle): JSX.Element {
  const { Tag, id, className, children } = useController(props);

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

const VARIANTS: Record<string, "PRIMARY" | "SECONDARY"> = {
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY",
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
}: TypeTitle): {
  id: string;
  className: string;
  children: TypeTitle["children"];
  Tag: TypeTitle["is"];
} {
  function generateStyles(tag: TypeTitle["is"]): string {
    return classnames(
      {
        h1: "tw-text-4xl",
        h2: "tw-text-3xl",
        h3: "tw-text-2xl",
        h4: "tw-text-xl",
      }[tag],
      {
        PRIMARY: "dfr-text-color-secondary dark:dfr-text-color-secondary",
        SECONDARY: "tw-text-black dark:tw-text-white",
      }[variant || ""],
    );
  }

  return {
    id: typeof children === "string" ? generateSlug(children) : "",
    children,
    Tag,
    className: classnames("tw-font-bold tw-font-sans", generateStyles(Tag), className),
  };
}
