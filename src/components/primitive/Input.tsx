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
        "tw-block tw-border-b-4 dfr-border-color-primary dark:dfr-border-color-primary",
        containerProps.className,
      )}
      {...(label ? { ...containerProps, htmlFor: id } : {})}
    >
      {label && <Text className="tw-mb-1 tw-cursor-pointer tw-font-bold">{label}</Text>}
      <input
        ref={ref}
        id={id}
        className={classNames(
          "dfr-Input tw-block tw-w-full tw-resize-none tw-rounded-none tw-border tw-p-2 tw-shadow-none dfr-bg-color-primary dfr-border-color-primary dark:dfr-bg-color-primary dark:dfr-border-color-primary",
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
