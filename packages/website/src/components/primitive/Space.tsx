import React from "react";
import classnames from "classnames";

type TypeSpaceProps = {
  size?: number;
  className?: string;
  dir?: "h" | "v";
};

function Space({ size, className, dir = "h" }: TypeSpaceProps): any {
  const isHorizontalDir = dir === "h";

  return (
    <hr
      className={classnames(
        "tw-border-0 tw-flex-shrink-0",
        Number.isInteger(size) && `tw-${isHorizontalDir ? "my" : "mx"}-${size}`,
        !isHorizontalDir && "tw-inline-block tw-h-1",
        className,
      )}
    />
  );
}

export default Space;
