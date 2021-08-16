import React from "react";
import classNames from "classnames";

import { T_ReactElement } from "~/types";

enum E_Variants {
  DEFAULT = "DEFAULT",
  DASHED = "DASHED",
}

type T_SpaceProps = {
  size?: number;
  sizeLeft?: number;
  sizeRight?: number;
  sizeTop?: number;
  sizeBottom?: number;
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
  size,
  sizeTop,
  sizeBottom,
  sizeLeft,
  sizeRight,
  className,
  orientation = "h",
  variant = E_Variants.DEFAULT,
}: T_SpaceProps) {
  const isHorizontalDir = orientation === "h";

  function getSizeClass(): string {
    if (isHorizontalDir) {
      if (sizeTop || sizeBottom) {
        return `tw-mt-${sizeTop || 0} tw-mb-${sizeBottom || 0}`;
      }

      return `tw-my-${size || 2}`;
    }

    if (sizeTop || sizeBottom) {
      return `tw-ml-${sizeLeft || 0} tw-mr-${sizeRight || 0}`;
    }

    return `tw-mx-${size || 2}`;
  }

  return {
    className: classNames(
      "tw-flex-shrink-0 tw-h-px",
      getSizeClass(),
      !isHorizontalDir && "tw-inline-block tw-h-1",
      variant === E_Variants.DEFAULT && "tw-border-0",
      variant === E_Variants.DASHED &&
        "tw-border-dashed dfr-border-color-primary dark:dfr-border-color-primary",
      className,
    ),
  };
}
