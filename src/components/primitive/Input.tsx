import React, { Fragment } from "react";
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
  const Container = label ? "label" : Fragment;

  return (
    <Container {...(label ? { ...labelProps, htmlFor: id } : {})}>
      {label && <p className="tw-font-bold tw-cursor-pointer tw-mb-1">{label}</p>}
      <input
        ref={ref as any}
        id={id}
        src={src}
        className={classNames(
          "tw-block tw-p-2 tw-w-full tw-rounded-md tw-border tw-border-b-4 dfr-border-color-primary dark:dfr-border-color-primary",
          className,
        )}
        {...rest}
      />
    </Container>
  );
});

export default Input;
