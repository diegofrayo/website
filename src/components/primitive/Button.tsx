import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "UNSTYLED" | "SIMPLE";
const VARIANTS = mirror(["UNSTYLED", "SIMPLE"]) as Record<T_Variant, T_Variant>;

type T_ButtonProps = T_HTMLAttributes["button"] & {
  variant?: T_Variant;
};

function Button({
  variant = VARIANTS.UNSTYLED,
  children,
  disabled = false,
  className = "",
  onClick,
  ...rest
}: T_ButtonProps): T_ReactElement {
  return (
    <button
      className={classNames(
        variant === VARIANTS.SIMPLE && "dfr-transition-opacity",
        disabled && "tw-cursor-not-allowed tw-opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.variant = VARIANTS;

export default Button;
