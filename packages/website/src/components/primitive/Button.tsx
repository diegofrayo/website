import React from "react";
import classNames from "classnames";

import { T_HTML_Attributes, T_ReactFCReturn } from "~/types";

type T_ButtonProps = T_HTML_Attributes["button"];

function Button({
  children,
  disabled = false,
  className = "",
  onClick,
  ...rest
}: T_ButtonProps): T_ReactFCReturn {
  return (
    <button
      className={classNames("tw-transition-opacity hover:tw-opacity-75", className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
