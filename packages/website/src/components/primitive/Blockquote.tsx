import React from "react";
import classnames from "classnames";

export function Blockquote({ children, className, ...rest }: Record<string, any>): any {
  return (
    <blockquote
      className={classnames(
        "dfr-border-color-primary tw-border-l-4 tw-pl-4 dfr-text-color-secondary tw-italic dark:tw-text-gray-400",
        className,
      )}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

export default Blockquote;
