import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_BlockProps = T_HTMLAttributes["div"] & {
  is?: "div" | "section" | "article" | "header" | "footer";
};

const Block = React.forwardRef(function Block(
  { is: Tag = "div", children, ...rest }: T_BlockProps,
  ref,
): T_ReactElement {
  return (
    <Tag ref={ref as any} {...rest}>
      {children}
    </Tag>
  );
});

export default Block;
