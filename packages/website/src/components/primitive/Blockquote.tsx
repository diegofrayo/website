import React from "react";
import classNames from "classnames";

import { T_HTML_Attributes, T_ReactElement } from "~/types";

enum E_Variants {
  DEFAULT = "DEFAULT",
  UNSTYLED = "UNSTYLED",
}

type T_BlockquoteProps = T_HTML_Attributes["blockquote"] & {
  variant?: E_Variants;
};

function Blockquote({
  children,
  className = "",
  variant = E_Variants.DEFAULT,
  ...rest
}: T_BlockquoteProps): T_ReactElement {
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
