import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "DEFAULT" | "DASHED";
// TODO: TS: Use "generics" instead of "as" to type this var
const VARIANTS = mirror(["DEFAULT", "DASHED"]) as Record<T_Variant, T_Variant>;

type T_SpaceProps = T_HTMLElementAttributes["hr"] & {
  className?: string;
  variant?: T_Variant;
  orientation?: "h" | "v";
  responsive?: string;
  size?: number;
  sizeLeft?: number;
  sizeRight?: number;
  sizeTop?: number;
  sizeBottom?: number;
};

function Space(props: T_SpaceProps): T_ReactElement {
  const { className } = useController(props);

  return <hr className={className} />;
}

Space.variant = VARIANTS;

export default Space;

// --- Controller ---

function useController({
  className = "",
  variant = VARIANTS.DEFAULT,
  orientation = "h",
  responsive = "",
  size,
  sizeTop,
  sizeBottom,
  sizeLeft,
  sizeRight,
}: T_SpaceProps): { className: string } {
  const isVerticalOrientation = orientation === "v";

  function composeClassName(): string {
    return classNames(
      "tw-flex-shrink-0",
      isVerticalOrientation ? "tw-h-full" : "tw-h-px",
      responsive || classNames(composeSizeClassNames(), isVerticalOrientation && "tw-inline-block"),
      variant === VARIANTS.DEFAULT && "tw-border-0",
      variant === VARIANTS.DASHED &&
        "dfr-border-color-primary dark:dfr-border-color-primary tw-border-dashed",
      className,
    );
  }

  function composeSizeClassNames(): string {
    if (isVerticalOrientation) {
      if (sizeLeft || sizeRight) {
        return `${composeSingleSideClassName("ml", sizeLeft)} ${composeSingleSideClassName(
          "mr",
          sizeRight,
        )}`.trim();
      }

      return composeSingleSideClassName("mx", size);
    }

    if (sizeTop || sizeBottom) {
      return `${composeSingleSideClassName("mt", sizeTop)} ${composeSingleSideClassName(
        "mb",
        sizeBottom,
      )}`.trim();
    }

    return composeSingleSideClassName("my", size);
  }

  function composeSingleSideClassName(singleSide: string, size?: number) {
    if (typeof size !== "number") return "";

    return `tw-${singleSide}-${size}`;
  }

  return {
    className: composeClassName(),
  };
}
