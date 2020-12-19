import * as React from "react";
import NextLink from "next/link";

import { slugify } from "~/utils/misc";

function Breadcumb({ items }: Record<string, any>): any {
  const moreThanOneItem = items.length > 1;

  return (
    <ul className="tw-block tw-text-left tw-pb-1">
      {items.map((item, index) => {
        if (index === items.length - 1 && moreThanOneItem) {
          return (
            <li key={`Breadcumb-li-${slugify(item.text)}`} className="tw-inline-block">
              <span className="tw-text-base">{item.text}</span>
            </li>
          );
        }

        return (
          <li
            key={`Breadcumb-li-${slugify(item.text)}`}
            className="tw-inline-block tw-mr-2"
          >
            <NextLink href={item.url} passHref>
              <a className="tw-text-base tw-font-bold">
                <span className="tw-underline">{item.text}</span>
              </a>
            </NextLink>
          </li>
        );
      })}

      <style jsx>
        {`
          a:after {
            @apply tw-ml-1;
            ${moreThanOneItem ? 'content: "‣";' : ""}
          }
        `}
      </style>
    </ul>
  );
}

export default Breadcumb;
