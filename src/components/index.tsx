import * as React from "react";
import classnames from "classnames";

import Breadcumb from "./Breadcumb";
import BlogPostContent from "./BlogPostContent";
import ErrorPage from "./ErrorPage";
import MainLayout from "./MainLayout";
import Page from "./Page";

function BlogDate({ children, className }: Record<string, any>): any {
  return (
    <span
      className={classnames(
        "tw-inline-block tw-bg-gray-200 tw-py-1 tw-px-2 tw-rounded-md tw-text-gray-600 tw-font-bold",
        className,
      )}
    >
      🗓️ {children}
    </span>
  );
}

function Separator({ size = 2 }: Record<string, any>): any {
  return <hr className={classnames("tw-border-0", `tw-my-${size}`)} />;
}

export { BlogDate, BlogPostContent, Breadcumb, ErrorPage, MainLayout, Page, Separator };
