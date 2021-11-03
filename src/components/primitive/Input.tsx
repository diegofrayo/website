import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

import Text from "./Text";

type T_InputProps = T_HTMLAttributes["input"] & {
  id: string;
  label?: string;
  containerProps?: T_HTMLAttributes["label"];
  inputProps?: T_HTMLAttributes["input"];
  is?: any;
  onChange?: any;
};

const Input = React.forwardRef(function Input(
  { label, containerProps, className, id, is: Tag = "input", ...rest }: T_InputProps,
  ref,
): T_ReactElement {
  return (
    <label
      className={classNames(
        "root",
        "dfr-border-primary dark:dfr-border-primary tw-border-b-4 tw-block",
        containerProps?.className,
      )}
      {...(label ? { ...containerProps, htmlFor: id } : {})}
    >
      {label && <Text className="tw-font-bold tw-cursor-pointer tw-mb-1">{label}</Text>}
      <Tag
        ref={ref as any}
        id={id}
        className={classNames(
          "dfr-Input dfr-border-primary dark:dfr-border-primary tw-border tw-rounded-none tw-shadow-none tw-block tw-p-2 tw-w-full tw-resize-none",
          className,
        )}
        {...rest}
      />

      <style jsx>{`
        .root:focus-within {
          border-color: transparent;
        }

        .root .dfr-Input {
          @apply dfr-bg-secondary;
        }

        :global(.tw-dark) .root .dfr-Input {
          @apply value:dark:dfr-bg-secondary;
        }
      `}</style>
    </label>
  );
});

export default Input;
