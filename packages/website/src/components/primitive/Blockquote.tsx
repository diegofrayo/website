import React from "react";
import classnames from "classnames";

import { TypeReactChildren } from "~/types";

export function Blockquote({
  children,
  className,
  variant = "DEFAULT",
  ...rest
}: {
  children: TypeReactChildren;
  className?: string;
  variant?: string;
  style?: any;
}): JSX.Element {
  return (
    <blockquote
      className={classnames(
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

Blockquote.variant = {
  DEFAULT: "DEFAULT",
  UNSTYLED: "UNSTYLED",
};

export default Blockquote;
