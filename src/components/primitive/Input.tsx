import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

import Text from "./Text";

type T_InputProps = T_HTMLElementAttributes["input"] & {
  containerProps?: T_HTMLElementAttributes["label"];
  label?: string;
  id: string;
};

const Input = React.forwardRef<HTMLInputElement, T_InputProps>(function Input(
  { containerProps = {}, label = "", className = "", id, ...rest }: T_InputProps,
  ref,
): T_ReactElement {
  return (
    <label
      className={classNames(
        "root",
        "dfr-border-color-primary tw-border-b-4 tw-block dark:dfr-border-color-primary",
        containerProps.className,
      )}
      {...(label ? { ...containerProps, htmlFor: id } : {})}
    >
      {label && <Text className="tw-font-bold tw-cursor-pointer tw-mb-1">{label}</Text>}
      <input
        ref={ref}
        id={id}
        className={classNames(
          "dfr-Input dfr-bg-color-primary dfr-border-color-primary tw-border tw-rounded-none tw-shadow-none tw-block tw-p-2 tw-w-full tw-resize-none dark:dfr-bg-color-primary dark:dfr-border-color-primary",
          className,
        )}
        {...rest}
      />

      <style jsx>{`
        .root:focus-within {
          border-color: transparent;
        }
      `}</style>
    </label>
  );
});

export default Input;
