import React from "react";
import classnames from "classnames";

import { generateSlug } from "~/utils/strings";

type TypeTitle = {
  is: "h1" | "h2" | "h3" | "h4";
  children: string | JSX.Element;
  className?: string;
};

function Title({ is: Tag, children, className: classNameProp }: TypeTitle): JSX.Element {
  const { id, className } = useController({ children, Tag, className: classNameProp });

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

export default Title;

// --- Controller ---

// TODO: TS => Improve props
function useController({
  children,
  Tag,
  className,
}: {
  children: TypeTitle["children"];
  Tag: TypeTitle["is"];
  className?: TypeTitle["className"];
}): { id: string; className: string } {
  function generateStyles(tag: TypeTitle["is"]): string {
    return {
      h1: "tw-text-4xl",
      h2: "tw-text-3xl",
      h3: "tw-text-2xl",
      h4: "tw-text-xl",
    }[tag];
  }

  return {
    id: typeof children === "string" ? generateSlug(children) : "",
    className: classnames("tw-font-bold tw-font-sans", generateStyles(Tag), className),
  };
}
