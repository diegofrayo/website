import * as React from "react";
import classNames from "classnames";

import { T_HTMLElementAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variants = "UNSTYLED" | "DEFAULT";
const VARIANTS = mirror(["UNSTYLED", "DEFAULT"]) as Record<T_Variants, T_Variants>;

type T_ListProps = T_HTMLElementAttributes["ul"] & {
  variant?: T_Variants;
};

function List({
  children,
  className = "",
  variant = VARIANTS.UNSTYLED,
}: T_ListProps): T_ReactElement {
  return (
    <ul
      className={classNames(
        `dfr-List dfr-List--${variant.toLowerCase()}`,
        "tw-list-inside tw-list-none",
        className,
      )}
    >
      {children}

      <style jsx>
        {`
          .dfr-List--default {
            padding-left: 19px;
          }

          .dfr-List--default :global(li) {
            @apply tw-mb-3;
            @apply last:tw-mb-0;
            position: relative;
          }

          .dfr-List--default :global(li)::before {
            color: black;
            content: "❯";
            font-weight: bold;
            font-size: 14px;
            left: -19px;
            position: absolute;
            top: 2px;
          }

          :global(.tw-dark) .dfr-List--default :global(li)::before {
            color: white;
          }
        `}
      </style>
    </ul>
  );
}

List.variant = VARIANTS;

export default List;

// --- Components ---

List.Item = function ListItem({
  children,
  ...rest
}: T_HTMLElementAttributes["li"]): T_ReactElement {
  return <li {...rest}>{children}</li>;
};
