import React from "react";
import classnames from "classnames";

export function Blockquote({ children, className }: Record<string, any>): any {
  return (
    <blockquote
      className={classnames(
        "dfr-border-color-primary tw-border-l-4 tw-pl-4 dfr-text-color-secondary tw-italic",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}

export default Blockquote;
