import * as React from "react";
import classNames from "classnames";

import { isObject } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactChildren, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLElementAttributes["p"];

function Text({ children, className = "", ...rest }: T_TextProps): T_ReactElement {
  return (
    <p
      className={classNames("dfr-Text", className)}
      {...rest}
    >
      {parseChildren(children)}
    </p>
  );
}

export default Text;

// --- Utils ---

function parseChildren(children: T_ReactChildren): T_ReactChildren {
  if (isObject(children)) {
    const childrenAsReactElement = children as React.ReactElement;

    if (childrenAsReactElement.type === "p") {
      return childrenAsReactElement.props.children;
    }
  }

  return children;
}
