import React from "react";
import classNames from "classnames";

import { TypeReactChildren } from "~/types";

type TypeBlockquote = {
  children: TypeReactChildren;
  className?: string;
  variant?: "DEFAULT" | "UNSTYLED";
  style?: any;
};

export function Blockquote({
  children,
  className,
  variant = "DEFAULT",
  ...rest
}: TypeBlockquote): JSX.Element {
  return (
    <blockquote
      className={classNames(
        "dfr-border-color-primary tw-border-l-4 tw-pl-4",
        variant === "DEFAULT" && "dfr-text-color-secondary tw-italic dark:tw-text-gray-400",
        className,
      )}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

const VARIANTS: Record<string, TypeBlockquote["variant"]> = {
  DEFAULT: "DEFAULT",
  UNSTYLED: "UNSTYLED",
};

Blockquote.variant = VARIANTS;

export default Blockquote;
