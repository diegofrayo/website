import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_InputProps = T_HTMLAttributes["input"];

const Input = React.forwardRef(function Input(
  { src, className, ...rest }: T_InputProps,
  ref,
): T_ReactElement {
  return (
    <input
      ref={ref as any}
      src={src}
      className={classNames(
        "tw-block tw-p-2 tw-w-full tw-rounded-md tw-border tw-border-b-4 dfr-border-color-primary dark:dfr-border-color-primary",
        className,
      )}
      {...rest}
    />
  );
});

export default Input;
