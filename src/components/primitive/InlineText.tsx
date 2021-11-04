import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_InlineTextProps = T_HTMLAttributes["span"] & {
  is?: "span" | "strong";
};

function InlineText({ is: Tag = "span", children, ...rest }: T_InlineTextProps): T_ReactElement {
  return <Tag {...rest}>{children}</Tag>;
}

export default InlineText;
