import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_BlockProps = T_HTMLAttributes["div"] & {
  is?: "div" | "section" | "article" | "header" | "footer";
};

function Block({ children, is: Tag = "div", ...rest }: T_BlockProps): T_ReactElement {
  return <Tag {...rest}>{children}</Tag>;
}

export default Block;
