import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "UNSTYLED" | "STYLED";
const VARIANTS = mirror(["UNSTYLED", "STYLED"]) as Record<T_Variant, T_Variant>;

type T_BlockquoteProps = T_HTMLAttributes["blockquote"] & {
  variant?: T_Variant;
};

function Blockquote({
  children,
  variant = VARIANTS.UNSTYLED,
  className = "",
  ...rest
}: T_BlockquoteProps): T_ReactElement {
  return (
    <blockquote
      className={classNames(
        variant === VARIANTS.STYLED &&
          "dfr-border-primary dark:dfr-border-primary tw-border-l-4 tw-pl-4",
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
