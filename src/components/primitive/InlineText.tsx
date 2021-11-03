import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_InlineTextProps = T_HTMLAttributes["span"];

function InlineText({ children, ...rest }: T_InlineTextProps): T_ReactElement {
  return <span {...rest}>{children}</span>;
}

export default InlineText;
