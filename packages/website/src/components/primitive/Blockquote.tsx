import React from "react";
import classNames from "classnames";

import { T_ReactChildrenProp, T_ReactFCReturn, T_ReactStylesProp } from "~/types";

enum E_Variants {
  DEFAULT = "DEFAULT",
  UNSTYLED = "UNSTYLED",
}

type T_Blockquote = {
  children: T_ReactChildrenProp;
  variant?: E_Variants;

  className?: string;
  style?: T_ReactStylesProp;
};

function Blockquote({
  children,
  className = "",
  variant = E_Variants.DEFAULT,
  ...rest
}: T_Blockquote): T_ReactFCReturn {
  return (
    <blockquote
      className={classNames(
        "dfr-border-color-primary tw-border-l-4 tw-pl-4",
        variant === E_Variants.DEFAULT &&
          "dfr-text-color-secondary dark:tw-text-gray-400 tw-italic",
        className,
      )}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

Blockquote.variant = E_Variants;

export default Blockquote;
