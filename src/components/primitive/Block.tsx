import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_BlockProps = T_HTMLElementAttributes["div"] & {
  is?: "main" | "div" | "section" | "article" | "header" | "aside" | "footer";
  variant?: "UNSTYLED" | "FEATURED" | "QUOTE";
  align?: "CENTER";
  display?: string;
};

const Block = React.forwardRef<HTMLDivElement, T_BlockProps>(function Block(
  {
    is: Tag = "div",
    children,
    variant = "UNSTYLED",
    className = "",
    align = "",
    display = "",
    ...rest
  },
  ref,
): T_ReactElement {
  function composeClassName(): string {
    return classNames(
      className,
      display,
      align === "CENTER" && "tw-justify-center tw-items-center tw-text-center",
      variant === "FEATURED" &&
        "dfr-bg-color-light-strong dfr-border-color-primary tw-border tw-border-l-4 tw-p-4 dark:dfr-border-color-primary",
      variant === "QUOTE" &&
        "dfr-border-color-primary dfr-text-color-secondary tw-px-4 tw-border-l-4 tw-italic dark:dfr-border-color-primary dark:dfr-text-color-secondary",
    );
  }

  return (
    <Tag
      className={composeClassName()}
      ref={ref}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Block;
