import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variant = "INLINE" | "MULTILINE";
// TODO: TS: Use "generics" instead of "as" to type this var
const VARIANTS = mirror(["INLINE", "MULTILINE"]) as Record<T_Variant, T_Variant>;

type T_CodeProps = T_HTMLElementAttributes["pre"] & {
  variant: T_Variant;
};

function Code({ children, variant, className = "", ...rest }: T_CodeProps): T_ReactElement {
  if (variant === VARIANTS.INLINE) {
    return (
      <code className="dfr-Code dfr-text-colorful-secondary-100 tw-text-base tw-italic dark:dfr-text-colorful-primary-100">
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
        "dfr-Code dfr-bg-color-primary dfr-text-color-dark-strong dfr-shadow tw-font-mono tw-block tw-p-4 tw-text-base tw-rounded-md tw-max-w-full tw-overflow-x-auto dark:dfr-bg-color-primary dark:dfr-text-color-light-strong",
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

Code.variant = VARIANTS;

export default Code;
