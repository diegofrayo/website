import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_InputProps = T_HTMLAttributes["input"] & {
  id: string;
  label?: string;
  labelProps?: T_HTMLAttributes["label"];
  is?: any;
  onChange?: any;
};

const Input = React.forwardRef(function Input(
  { className, label, labelProps, id, is: Tag = "input", ...rest }: T_InputProps,
  ref,
): T_ReactElement {
  return (
    <label
      className={classNames("root", labelProps?.className)}
      {...(label ? { ...labelProps, htmlFor: id } : {})}
    >
      {label && <p className="tw-font-bold tw-cursor-pointer tw-mb-1">{label}</p>}
      <Tag
        ref={ref as any}
        id={id}
        className={classNames(
          "dfr-Input dfr-border-primary dark:dfr-border-primary tw-block tw-p-2 tw-w-full tw-border tw-border-b-4 tw-resize-none",
          className,
        )}
        {...rest}
      />

      <style jsx>{`
        .root :global(.dfr-Input) {
          @apply dfr-bg-secondary;
        }

        .root :global(.dfr-Input:focus) {
          border-color: transparent;
        }

        :global(.tw-dark) .root :global(.dfr-Input) {
          @apply value:dark:dfr-bg-secondary;
        }
      `}</style>
    </label>
  );
});

export default Input;
