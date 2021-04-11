import React from "react";
import classNames from "classnames";

import { T_ReactElement } from "~/types";

enum E_Variants {
  DEFAULT = "DEFAULT",
  DASHED = "DASHED",
}

type T_SpaceProps = {
  size?: number;
  className?: string;
  orientation?: "h" | "v";
  variant?: E_Variants;
};

function Space(props: T_SpaceProps): T_ReactElement {
  const { className } = useController(props);

  return <hr className={className} />;
}

Space.variant = E_Variants;

export default Space;

// --- Controller ---

function useController({
  size: sizeProp,
  className,
  orientation = "h",
  variant = E_Variants.DEFAULT,
}: T_SpaceProps) {
  const isHorizontalDir = orientation === "h";
  const size = typeof sizeProp === "number" ? sizeProp : 2;

  return {
    className: classNames(
      "tw-flex-shrink-0",
      `tw-${isHorizontalDir ? "my" : "mx"}-${size}`,
      !isHorizontalDir && "tw-inline-block tw-h-1",
      variant === E_Variants.DEFAULT && "tw-border-0",
      variant === E_Variants.DASHED &&
        "tw-border-dashed dfr-border-color-primary dark:dfr-border-color-primary",
      className,
    ),
  };
}
