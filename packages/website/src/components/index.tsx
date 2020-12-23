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
  styled = true,
  external = true,
  ...rest
}: Record<string, any>): any {
  if (Tag === "a") {
    return (
      <LinkElement
        href={href}
        className={className}
        tw-variant={styled && "styled"}
        {...(external &&
          !href.startsWith("#") && { target: "_blank", rel: "noreferrer" })}
        {...rest}
      >
        {children}
      </LinkElement>
    );
  }

  return (
    <Tag href={href} passHref>
      <LinkElement tw-variant={styled && "styled"} className={className}>
        {children}
      </LinkElement>
    </Tag>
  );
}

const LinkElement = twcss.a({
  __base: "tw-transition-opacity hover:tw-opacity-75",
  styled: `tw-font-bold tw-underline twc-text-color-links dark:twc-text-color-links`,
});

export function UL({ children }: Record<string, any>): any {
  return (
    <ul className="tw-list-inside tw-list-none">
      {children}

      <style jsx>{`
        ul > :global(li) {
          @apply tw-mb-1;
        }

        ul > :global(li):before {
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
      <Emoji className="tw-text-xl tw-mr-3">{emoji}</Emoji>
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}

export function Emoji({ children, className }: Record<string, any>): any {
  return <span className={classnames("emoji", className)}>{children}</span>;
}
