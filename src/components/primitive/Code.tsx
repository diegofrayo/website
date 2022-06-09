import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/misc";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS_OPTIONS = ["INLINE", "MULTILINE"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];
type T_CodeProps = T_HTMLElementAttributes["pre"] & {
  variant: T_Variant;
};

function Code({ children, className, variant, ...rest }: T_CodeProps): T_ReactElement {
  if (variant === VARIANTS.INLINE) {
    return (
      <code className="dfr-Code tw-text-base tw-italic dfr-text-colorful-secondary-100 dark:dfr-text-colorful-primary-100">
        {children}

        <style jsx>
          {`
            code::before,
            code::after {
              content: "\`";
            }
          `}
        </style>
      </code>
    );
  }

  return (
    <pre
      className={classNames(
        "dfr-Code tw-block tw-max-w-full tw-overflow-x-auto tw-rounded-md tw-p-4 tw-font-mono tw-text-base dfr-shadow dfr-bg-color-primary dfr-text-color-dark-strong dark:dfr-bg-color-primary dark:dfr-text-color-light-strong",
        className,
      )}
      {...rest}
    >
      {children}

      <style jsx>
        {`
          pre {
            word-break: keep-all;
          }

          pre :global(.dfr-Code) {
            @apply dfr-text-color-dark-strong;
            font-style: normal;
          }

          pre :global(.dfr-Code::before),
          pre :global(.dfr-Code::after) {
            content: "";
          }
        `}
      </style>
    </pre>
  );
}

Code.variant = VARIANTS;

export default Code;
