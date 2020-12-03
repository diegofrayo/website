import * as React from "react";
import classnames from "classnames";

function Separator({ size = 2 }: Record<string, any>): any {
  return <hr className={classnames("tw-border-0", `tw-my-${size}`)} />;
}

export default Separator;
