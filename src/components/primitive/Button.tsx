import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

const VARIANTS_OPTIONS = ["UNSTYLED", "SIMPLE", "DEFAULT"] as const;
type T_Variant = typeof VARIANTS_OPTIONS[number];
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);

type T_ButtonProps = T_HTMLElementAttributes["button"] & {
  variant?: T_Variant;
  fontWeight?: string;
};

function Button({
  children,
  variant = VARIANTS.UNSTYLED,
  className = "",
  disabled = false,
  fontWeight = "",
  onClick,
  ...rest
}: T_ButtonProps): T_ReactElement {
  function composeClassName(): string {
    return classNames(
      variant === VARIANTS.SIMPLE && "dfr-transition-opacity",
      variant === VARIANTS.DEFAULT &&
        classNames(
          "dfr-transition-opacity dfr-text-color-dark-strong tw-text-sm tw-lowercase dark:dfr-text-color-light-strong",
          fontWeight || "tw-font-bold",
        ),
      disabled && "tw-cursor-not-allowed tw-opacity-50",
      className,
    );
  }

  return (
    <button className={composeClassName()} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

Button.variant = VARIANTS;

export default Button;
