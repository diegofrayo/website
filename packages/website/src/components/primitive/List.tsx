import React from "react";
import classNames from "classnames";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

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
        `}
      </style>
    </ul>
  );
}

export default List;

// --- Components ---

List.Item = function ListItem({
  children,
  className = "",
  variant = "DEFAULT",
  ...rest
}: T_HTMLAttributes["li"] & { variant?: "DEFAULT" | "UNSTYLED" }): T_ReactElement {
  return (
    <li className={classNames(`root root--${variant.toLowerCase()}`, className)} {...rest}>
      {children}

      <style jsx>
        {`
          .root--default {
            @apply tw-mb-3;
            @apply last:tw-mb-0;
            position: relative;
          }

          .root--default::before {
            color: black;
            content: "❯";
            font-weight: bold;
            left: -19px;
            position: absolute;
            top: 0;
          }

          :global(.tw-dark) .root--default::before {
            color: white;
          }
        `}
      </style>
    </li>
  );
};
