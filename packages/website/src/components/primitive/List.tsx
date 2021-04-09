import React from "react";
import classNames from "classnames";

function List({ children, className }: Record<string, any>): any {
  return (
    <ul className={classNames("root tw-list-inside tw-list-none", className)}>
      {children}

      <style jsx>
        {`
          .root {
            padding-left: 19px;
          }

          .root :global(li) {
            position: relative;
            @apply tw-mb-3;
            @apply last:tw-mb-0;
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

List.Item = function ListItem({ children, className = "", ...rest }) {
  return (
    <li className={className} {...rest}>
      {children}
    </li>
  );
};
