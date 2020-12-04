import * as React from "react";
import classnames from "classnames";

import Breadcumb from "./Breadcumb";

function BlogDate({ children, className }: Record<string, any>): any {
  return (
    <span
      className={classnames(
        "tw-inline-block tw-bg-gray-200 tw-py-1 tw-px-2 tw-rounded-md tw-text-gray-600 tw-font-bold",
        className,
      )}
    >
      🗓️ {children}
    </span>
  );
}
export { Breadcumb, BlogDate };
