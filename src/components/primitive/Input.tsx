import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_InputProps = T_HTMLAttributes["input"] & {
  id: string;
  label?: string;
  labelProps?: T_HTMLAttributes["label"];
};

const Input = React.forwardRef(function Input(
  { src, className, label, labelProps, id, ...rest }: T_InputProps,
  ref,
): T_ReactElement {
  return (
    <label className={labelProps?.className} {...(label ? { ...labelProps, htmlFor: id } : {})}>
      {label && <p className="tw-font-bold tw-cursor-pointer tw-mb-1">{label}</p>}
      <input
        ref={ref as any}
        id={id}
        src={src}
        className={classNames(
          "dfr-Input dfr-border-primary dark:dfr-border-primary tw-block tw-p-2 tw-w-full tw-rounded-md tw-border tw-border-b-4",
          className,
        )}
        {...rest}
      />

      <style jsx>{`
        .dfr-Input {
          @apply dfr-bg-secondary;
          outline: transparent;
        }

        :global(.tw-dark) .dfr-Input {
          @apply value:dark:dfr-bg-secondary;
        }
      `}</style>
    </label>
  );
});

export default Input;
