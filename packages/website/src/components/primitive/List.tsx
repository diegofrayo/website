import React from "react";
import classNames from "classnames";

import { T_HTML_Attributes, T_ReactElement } from "~/types";

function List({ children, className = "" }: T_HTML_Attributes["ul"]): T_ReactElement {
  return (
    <ul className={classNames("root tw-list-inside tw-list-none", className)}>
      {children}

      <style jsx>
        {`
          .root {
            padding-left: 19px;
          }

          .root :global(li) {
            @apply tw-mb-3;
            @apply last:tw-mb-0;
            position: relative;
          }

          .root :global(li::before) {
            color: black;
            content: "❯";
            font-weight: bold;
            left: -19px;
            position: absolute;
            top: 0;
          }

          :global(.tw-dark) .root :global(li::before) {
            color: white;
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
  ...rest
}: T_HTML_Attributes["li"]): T_ReactElement {
  return (
    <li className={className} {...rest}>
      {children}
    </li>
  );
};
