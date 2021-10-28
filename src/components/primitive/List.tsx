import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variants = "DEFAULT" | "UNSTYLED";
const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]) as Record<T_Variants, T_Variants>;

function List({
  children,
  className = "",
  variant = "DEFAULT",
}: T_HTMLAttributes["ul"] & { variant?: "DEFAULT" | "UNSTYLED" }): T_ReactElement {
  return (
    <ul
      className={classNames(
        `root root--${variant.toLowerCase()}`,
        "tw-list-inside tw-list-none",
        className,
      )}
    >
      {children}

      <style jsx>
        {`
          .root--default {
            padding-left: 19px;
          }

          .root :global(li) {
            @apply tw-mb-3;
            @apply last:tw-mb-0;
            position: relative;
          }

          .root--default :global(li)::before {
            color: black;
            content: "❯";
            font-weight: bold;
            font-size: 14px;
            left: -19px;
            position: absolute;
            top: 2px;
          }

          :global(.tw-dark) .root--default :global(li)::before {
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

List.Item = function ListItem({ children, ...rest }: T_HTMLAttributes["li"]): T_ReactElement {
  return <li {...rest}>{children}</li>;
};
