import React from "react";
import classnames from "classnames";
import twcss from "~/lib/twcss";

function Separator({ size = 2, ...rest }: Record<string, any>): any {
  return (
    <SeparatorPrimitive
      className={classnames("tw-border-0", `tw-my-${size}`)}
      {...rest}
    />
  );
}

const SeparatorPrimitive = twcss.hr``;

export default Separator;
