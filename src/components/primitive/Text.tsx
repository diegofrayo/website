import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLElementAttributes["p"];

function Text({ children, className = "", ...rest }: T_TextProps): T_ReactElement {
  const finalChildren =
    children && typeof children === "object" && (children as React.ReactElement)?.type === "p"
      ? (children as React.ReactElement).props.children
      : children;

  return (
    <p
      className={classNames("dfr-Text", className)}
      {...rest}
    >
      {finalChildren}
    </p>
  );
}

export default Text;
