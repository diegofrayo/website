import * as React from "react";
import classnames from "classnames";

import twcss from "~/lib/twcss";

export { default as Breadcumb } from "./Breadcumb";
export { default as ErrorPage } from "./ErrorPage";
export { default as MDXContent } from "./MDXContent";
export { default as MainLayout } from "./MainLayout";
export { default as Page } from "./Page";

export function Link({
  children,
  href,
  className,
  is: Tag = "a",
  ...rest
}: Record<string, any>): any {
  if (Tag === "a") {
    return (
      <LinkElement
        target="_blank"
        rel="noreferrer"
        href={href}
        className={className}
        {...rest}
      >
        {children}
      </LinkElement>
    );
  }

  return (
    <Tag href={href} passHref>
      <LinkElement className={className}>{children}</LinkElement>
    </Tag>
  );
}

const LinkElement = twcss.a`tw-font-bold tw-underline tw-text-blue-700`;

export function UL({ children }: Record<string, any>): any {
  return (
    <ul className="tw-list-inside tw-list-none">
      {children}

      <style jsx>{`
        ul :global(li) {
          @apply tw-mb-2;
        }

        ul :global(li):before {
          @apply tw-mr-2;
          content: "‣";
          font-weight: bold;
        }
      `}</style>
    </ul>
  );
}

export function Separator({ size, className }: Record<string, any>): any {
  return (
    <hr
      className={classnames(
        "tw-border-0",
        Number.isInteger(size) && `tw-my-${size}`,
        className,
      )}
    />
  );
}

export function TextWithEmoji({ children, emoji }: Record<string, any>): any {
  return (
    <section className="tw-flex tw-flex-nowrap tw-mb-3">
      <span className="tw-text-xl tw-mr-3">{emoji}</span>
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}
