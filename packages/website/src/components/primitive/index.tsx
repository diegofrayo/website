import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";

import twcss from "~/lib/twcss";
import { TypeLocale } from "~/types";

export { default as Modal } from "./Modal";

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
        {...(external && !href.startsWith("#") && { target: "_blank", rel: "noreferrer" })}
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
  styled: `tw-font-bold tw-underline dfr-text-color-links dark:dfr-text-color-links`,
});

export function UL({ children }: Record<string, any>): any {
  return (
    <ul className="tw-list-inside tw-list-none">
      {children}

      <style jsx>{`
        ul > :global(li) {
          @apply tw-mb-2;
        }

        ul > :global(li):before {
          @apply tw-mr-2;
          @apply tw-text-black;
          content: "❯";
          font-weight: bold;
        }

        :global(.tw-dark) ul > :global(li):before {
          @apply tw-text-gray-400;
        }
      `}</style>
    </ul>
  );
}

export function Collapsible({
  children,
  title,
  htmlAttrs,
}: {
  children: any;
  title?: string;
  htmlAttrs?: { openByDefault?: boolean };
}) {
  const [show, setShow] = useState(htmlAttrs?.openByDefault === true ? true : false);
  const containerRef: any = useRef(undefined);

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;

    if (show === true) {
      containerRef?.current.setAttribute("open", "");
    } else {
      containerRef?.current.removeAttribute("open");
    }
  }, [containerRef]);

  return (
    <details ref={containerRef} data-block>
      <summary
        className="tw-font-bold"
        role="button"
        onClick={() => {
          setShow(cv => !cv);
        }}
      >
        {title ? title : show ? "Hide" : "Show"}
      </summary>

      <div className="tw-pl-5">{children}</div>
    </details>
  );
}
