import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/objects-and-arrays";

const VARIANTS_OPTIONS = ["UNSTYLED", "FEATURED", "QUOTE"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];
type T_BlockProps = T_HTMLElementAttributes["div"] & {
  is?: "main" | "div" | "section" | "article" | "header" | "aside" | "footer";
  variant?: T_Variant;
};

const Block = React.forwardRef<HTMLDivElement, T_BlockProps>(function Block(
  { is: Tag = "div", children, variant = VARIANTS.UNSTYLED, className = "", ...rest },
  ref,
): T_ReactElement {
  // utils
  function composeClassName(): string {
    return classNames(
      className,
      variant === "FEATURED" &&
        "dfr-bg-color-light-strong dfr-border-color-primary tw-border tw-border-l-4 tw-p-4 dark:dfr-border-color-primary",
      variant === "QUOTE" &&
        "dfr-border-color-primary dfr-text-color-secondary tw-px-4 tw-border-l-4 tw-italic dark:dfr-border-color-primary dark:dfr-text-color-secondary",
    );
  }

  // render
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

// TODO: Typing issue, fix soon
// @ts-ignore
Block.variant = VARIANTS;

export default Block;
