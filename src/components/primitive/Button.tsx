import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_ButtonProps = T_HTMLAttributes["button"];

function Button({
  children,
  disabled = false,
  className = "",
  onClick,
  ...rest
}: T_ButtonProps): T_ReactElement {
  return (
    <button
      className={classNames(
        disabled ? "tw-cursor-not-allowed tw-opacity-50" : "dfr-transition-opacity",
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

export default Button;
