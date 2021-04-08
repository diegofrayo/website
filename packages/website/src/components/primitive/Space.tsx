import React from "react";
import classNames from "classnames";

type TypeSpaceProps = {
  size?: number;
  className?: string;
  dir?: "h" | "v";
  variant?: "DEFAULT" | "DASHED";
};

function Space(props: TypeSpaceProps): JSX.Element {
  const { className } = useController(props);

  return <hr className={className} />;
}

const VARIANTS: Record<string, TypeSpaceProps["variant"]> = {
  DEFAULT: "DEFAULT",
  DASHED: "DASHED",
};

Space.variant = VARIANTS;

export default Space;

// --- Controller ---

function useController({ size, className, dir = "h", variant = VARIANTS.DEFAULT }: TypeSpaceProps) {
  const isHorizontalDir = dir === "h";

  return {
    className: classNames(
      "tw-flex-shrink-0",
      typeof size === "number" && `tw-${isHorizontalDir ? "my" : "mx"}-${size}`,
      !isHorizontalDir && "tw-inline-block tw-h-1",
      variant === VARIANTS.DEFAULT && "tw-border-0",
      variant === VARIANTS.DASHED &&
        "tw-border-dashed dfr-border-color-primary dark:dfr-border-color-primary",
      className,
    ),
  };
}
