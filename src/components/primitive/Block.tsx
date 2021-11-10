import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_BlockProps = T_HTMLElementAttributes["div"] & {
  is?: "div" | "main" | "section" | "article" | "header" | "footer";
  variant?: "FEATURED" | "QUOTE";
  align?: "center";
  display?: string;
};

const Block = React.forwardRef<HTMLDivElement, T_BlockProps>(function Block(
  { is: Tag = "div", children, variant, className = "", align = "", display = "", ...rest },
  ref,
): T_ReactElement {
  function composeClassName(): string {
    return classNames(
      className,
      display,
      align === "center" && "tw-justify-center tw-items-center tw-text-center",
      variant === "FEATURED" &&
        "dfr-border-color-primary dark:dfr-border-color-primary tw-p-4 tw-border tw-border-l-4",
      variant === "QUOTE" &&
        "dfr-border-color-primary dfr-text-color-secondary tw-px-4 tw-border-l-4 tw-italic dark:dfr-border-color-primary dark:dfr-text-color-secondary",
    );
  }

  return (
    <Tag className={composeClassName()} ref={ref} {...rest}>
      {children}
    </Tag>
  );
});

export default Block;
