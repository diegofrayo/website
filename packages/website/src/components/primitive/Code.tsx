import React from "react";
import classNames from "classnames";

import { T_ReactChildrenProp, T_ReactStylesProp } from "~/types";

enum E_Variants {
  MULTILINE = "MULTILINE",
  INLINE = "INLINE",
}

type T_Code = {
  children: T_ReactChildrenProp;
  variant?: E_Variants;

  className?: string;
  style?: T_ReactStylesProp;
};

function Code({ children, variant = E_Variants.MULTILINE, className, ...rest }: T_Code) {
  if (variant === E_Variants.INLINE) {
    return (
      <code className="tw-text-base tw-italic tw-text-red-700 dark:tw-text-red-400">
        {children}

        <style jsx>{`
          code::before,
          code::after {
            content: "\`";
          }
        `}</style>
      </code>
    );
  }

  return (
    <pre
      className={classNames(
        "tw-bg-gray-800 dark:tw-bg-gray-700 tw-block tw-p-4 tw-text-base tw-text-gray-300 tw-rounded-md tw-max-w-full tw-overflow-x-auto",
        className,
      )}
      {...rest}
    >
      <code>{children}</code>

      <style jsx>{`
        pre {
          word-break: keep-all;
        }
      `}</style>
    </pre>
  );
}

Code.variant = E_Variants;

export default Code;
