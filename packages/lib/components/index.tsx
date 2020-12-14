import * as React from "react";
import classnames from "classnames";

import twcss from "~/lib/twcss";

export { default as Breadcumb } from "./Breadcumb";
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
        {...(external && { target: "_blank", rel: "noreferrer" })}
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
  styled: `tw-font-bold tw-underline twc-text-color-links dark:twc-text-color-links tw-transition-opacity hover:tw-opacity-75`,
});

export function Separator({ size, className }: Record<string, any>): any {
  return (
    <hr
      className={classnames(
        "tw-border-0",
        Number.isInteger(size) && `tw-my-${size}`,
        className
      )}
    />
  );
}

export function Emoji({ children, className }: Record<string, any>): any {
  return <span className={classnames("emoji", className)}>{children}</span>;
}
