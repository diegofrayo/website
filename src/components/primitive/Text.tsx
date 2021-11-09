import * as React from "react";

import { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLElementAttributes["p"];

function Text({ children, ...rest }: T_TextProps): T_ReactElement {
  return <p {...rest}>{children}</p>;
}

export default Text;
