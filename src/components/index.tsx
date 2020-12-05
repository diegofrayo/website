import * as React from "react";
import classnames from "classnames";

import Breadcumb from "./Breadcumb";
import BlogPostContent from "./BlogPostContent";
import ErrorPage from "./ErrorPage";
import MainLayout from "./MainLayout";
import Page from "./Page";

function TextWithEmoji({ children, emoji }: Record<string, any>): any {
  return (
    <section className="tw-flex tw-flex-no-wrap tw-mb-3">
      <span className="tw-text-xl tw-mr-3">{emoji}</span>
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}

function BlogDate({ children, className }: Record<string, any>): any {
  return (
    <span
      className={classnames(
        "tw-inline-block tw-bg-gray-100 tw-py-1 tw-px-2 tw-rounded-md  tw-font-bold tw-text-sm",
        className,
      )}
    >
      🗓️ {children}
    </span>
  );
}

export function Link({ children, href, className, ...rest }: Record<string, any>): any {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className={classnames(
        "tw-font-bold tw-underline tw-text-blue-700 hover:tw-opacity-75 tw-transition-opacity",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

function Separator({ size, className }: Record<string, any>): any {
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

export {
  BlogDate,
  BlogPostContent,
  Breadcumb,
  ErrorPage,
  MainLayout,
  Page,
  Separator,
  TextWithEmoji,
};
