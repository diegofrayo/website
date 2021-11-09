import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "UNSTYLED" | "SIMPLE" | "DEFAULT";
// TODO: TS: Use "generics" instead of "as" to type this var
const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DEFAULT"]) as Record<T_Variant, T_Variant>;

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
          "dfr-transition-opacity dfr-text-strong dark:dfr-text-strong tw-text-sm tw-lowercase",
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
