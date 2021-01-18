import * as React from "react";
import NextLink from "next/link";

import { TypeBreadcumbProps } from "~/types";
import { generateSlug } from "~/utils/strings";

import { Link } from "./";

function Breadcumb({ items }: TypeBreadcumbProps): any {
  const moreThanOneItem = items.length > 1;

  return (
    <ul className="root tw-block tw-text-left tw-pb-1">
      {items.map((item, index) => {
        if (index === items.length - 1 && moreThanOneItem) {
          return (
            <li
              key={`Breadcumb-li-${generateSlug(item.text)}`}
              className="tw-inline-block"
            >
              <span className="tw-text-base tw-italic">{item.text}</span>
            </li>
          );
        }

        return (
          <li
            key={`Breadcumb-li-${generateSlug(item.text)}`}
            className="tw-inline-block tw-mr-2"
          >
            <Link is={NextLink} href={item.url || "/"} styled={false}>
              <span className="tw-underline tw-font-bold tw-text-base">{item.text}</span>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          .root :global(a:after) {
            @apply tw-ml-1;
            ${moreThanOneItem ? 'content: "‣";' : ""}
          }
        `}
      </style>
    </ul>
  );
}

export default Breadcumb;
