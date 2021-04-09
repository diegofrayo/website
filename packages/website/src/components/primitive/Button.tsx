import React from "react";
import classNames from "classnames";

import { T_ReactChildrenProp, T_ReactFCReturn, T_ReactStylesProp } from "~/types";

type T_Button = {
  children: T_ReactChildrenProp;

  disabled?: boolean;
  className?: string;
  style?: T_ReactStylesProp;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
};

function Button({
  children,
  disabled = false,
  className = "",
  onClick,
  ...rest
}: T_Button): T_ReactFCReturn {
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
