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
        return `${getItemClass("tw-mt", sizeTop)} ${getItemClass("tw-mb", sizeBottom)}`.trim();
      }

      return getItemClass("tw-my", size);
    }

    if (sizeLeft || sizeRight) {
      return `${getItemClass("tw-ml", sizeLeft)} ${getItemClass("tw-mr", sizeRight)}`.trim();
    }

    return getItemClass("tw-mx", size);
  }

  function getItemClass(className, size) {
    if (typeof size !== "number") return "";

    return `${className}-${size}`;
  }

  return {
    className: classNames(
      "tw-flex-shrink-0 tw-h-px",
      getSizeClass(),
      !isHorizontalDir && "tw-inline-block",
      variant === E_Variants.DEFAULT && "tw-border-0",
      variant === E_Variants.DASHED &&
        "dfr-border-primary dark:dfr-border-primary tw-border-dashed",
      className,
    ),
  };
}
