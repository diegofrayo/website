import * as React from "react";
import classnames from "classnames";

import twcss from "~/lib/twcss";
import { TypeLocale } from "~/types";

export { default as Breadcumb } from "./Breadcumb";
export { default as ErrorPage } from "./ErrorPage";
export { default as MDXContent } from "./MDXContent";
export { default as MainLayout } from "./MainLayout";
export { default as Page } from "./Page";

type TypeLinkProps = {
  children: any;
  href: string;
  className?: string;
  is?: string | any;
  styled?: boolean;
  external?: boolean;
  locale?: TypeLocale;
  role?: "button";
};

export function Link({
  children,
  href,
  className,
  is: Tag = "a",
  styled = true,
  external = true,
  ...rest
}: TypeLinkProps): any {
  if (!href) return null;

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
    <Tag href={href} locale={rest.locale} passHref>
      <LinkElement tw-variant={styled && "styled"} className={className} {...rest}>
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

export function Image({ src, ...rest }: Record<string, any>): any {
  if (!src) return null; // TODO: Remove this

  return <img src={src} {...rest} />;
}

type TypeSeparatorProps = {
  size?: number;
  className?: string;
  dir?: "h" | "v";
};

export function Separator({ size, className, dir = "h" }: TypeSeparatorProps): any {
  const isHorizontalDir = dir === "h";

  return (
    <hr
      className={classnames(
        "tw-border-0 tw-flex-shrink-0",
        Number.isInteger(size) && `tw-${isHorizontalDir ? "my" : "mx"}-${size}`,
        !isHorizontalDir && "tw-inline-block tw-h-1",
        className,
      )}
    />
  );
}

type TypeTextWithEmojiProps = {
  emoji: string;
  children: any;
};

export function TextWithEmoji({ emoji, children }: TypeTextWithEmojiProps): any {
  return (
    <section className="tw-flex tw-flex-nowrap tw-mb-3">
      <Emoji className="tw-text-xl tw-mr-3">{emoji}</Emoji>
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}

type TypeEmojiProps = {
  className?: string;
  children: string;
};

export function Emoji({ children, className }: TypeEmojiProps): any {
  return <span className={classnames("emoji", className)}>{children}</span>;
}
