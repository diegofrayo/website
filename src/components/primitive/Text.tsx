import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLAttributes["p"];

function Text({ children, ...rest }: T_TextProps): T_ReactElement {
  return <p {...rest}>{children}</p>;
}

export default Text;
