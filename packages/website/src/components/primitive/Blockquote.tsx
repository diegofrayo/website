import React from "react";
import classNames from "classnames";

import { T_HTML_Attributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variants = "DEFAULT" | "UNSTYLED";
const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]) as Record<T_Variants, T_Variants>;

type T_BlockquoteProps = T_HTML_Attributes["blockquote"] & {
  variant?: T_Variants;
};

function Blockquote({
  children,
  className = "",
  variant = VARIANTS.DEFAULT,
  ...rest
}: T_BlockquoteProps): T_ReactElement {
  return (
    <blockquote
      className={classNames(
        "dfr-border-color-primary tw-border-l-4 tw-pl-4",
        variant === VARIANTS.DEFAULT && "dfr-text-color-secondary dark:tw-text-gray-400 tw-italic",
        className,
      )}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

Blockquote.variant = VARIANTS;

export default Blockquote;
