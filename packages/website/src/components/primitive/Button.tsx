import React from "react";
import classnames from "classnames";

function Button({ children, disabled = false, className = "", onClick, ...rest }) {
  return (
    <button
      className={classnames("tw-transition-opacity hover:tw-opacity-75", className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
