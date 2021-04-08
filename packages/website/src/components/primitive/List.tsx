import React from "react";
import classnames from "classnames";

export function List({ children, className }: Record<string, any>): any {
  return (
    <ul className={classnames("tw-list-inside tw-list-none", className)}>
      {React.Children.map(children, child => {
        if (!child) return child;

        return (
          <li className="tw-flex tw-flex-no-wrap tw-mb-3 last:tw-mb-0">
            <span className="tw-font-bold tw-mr-2 tw-text-black dark:tw-text-white">{"❯"}</span>
            <div className="tw-flex-1 tw-min-w-0">{child}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default List;

// --- Components ---

List.Item = function ListItem({ children }) {
  return <p>{children}</p>;
};
