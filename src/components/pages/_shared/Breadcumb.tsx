import React from "react";
import Link from "next/link";

import { slugify } from "~/utils/misc";

function Breadcumb({ items }: Record<string, any>): any {
  return (
    <ul className="tw-block tw-text-left tw-pb-1">
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <li
              key={`Breadcumb-li-${slugify(item.text)}`}
              className="tw-block sm:tw-inline-block"
            >
              <span className="tw-text-base tw-text-gray-700">{item.text}</span>
            </li>
          );
        }

        return (
          <li
            key={`Breadcumb-li-${slugify(item.text)}`}
            className="tw-block sm:tw-inline-block tw-mr-0 sm:tw-mr-4"
          >
            <Link href={item.url} passHref>
              <a className="tw-text-base tw-text-gray-700 tw-font-bold">
                <span className="tw-underline">{item.text}</span>
              </a>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          a:after {
            content: "▶️";
            @apply tw-ml-1;
          }
        `}
      </style>
    </ul>
  );
}

export default Breadcumb;
