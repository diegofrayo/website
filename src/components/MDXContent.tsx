import React from "react";
import classnames from "classnames";
import { useTheme } from "next-themes";

import { safeRender } from "~/hocs";

function MDXContent({ content }: Record<string, any>): any {
  const { theme } = useTheme();

  return (
    <article
      className={classnames("mdx-content", theme === "dark" && "mdx-content--dark")}
    >
      {content}

      <style jsx>{`
        :global(.mdx-content) > :global(p),
        :global(.mdx-content) :global(pre),
        :global(.mdx-content) :global(blockquote),
        :global(.mdx-content) :global(img),
        :global(.mdx-content) :global(hr),
        :global(.mdx-content) :global(ol),
        :global(.mdx-content) :global(ul),
        :global(.mdx-content) > :global(section[data-block]) {
          @apply twc-mt-base;
          @apply twc-mb-base;
        }

        :global(.mdx-content) :global(ol) {
          @apply tw-pl-6;
          list-style-type: decimal;
        }

        :global(.mdx-content) :global(blockquote) {
          @apply twc-border-color-primary;
          @apply tw-border-l-4;
          @apply tw-pl-4;
          @apply twc-text-color-secondary;
          font-style: italic;
        }

        :global(.mdx-content--dark) :global(blockquote) {
          @apply tw-text-gray-400;
        }

        :global(.mdx-content) :global(pre) {
          @apply tw-bg-gray-800;
          @apply tw-p-4;
          @apply tw-rounded-md;
          @apply tw-text-base;
          @apply tw-text-gray-300;
          max-width: 100%;
          overflow-x: auto;
          word-break: keep-all;
        }

        :global(.mdx-content) :global(p) :global(code) {
          @apply tw-text-base;
          @apply tw-text-red-700;
          font-style: italic;
        }

        :global(.mdx-content--dark) :global(p) :global(code) {
          @apply tw-text-red-400;
        }

        :global(.mdx-content) :global(p) :global(code):after {
          content: "\`";
        }

        :global(.mdx-content) :global(p) :global(code):before {
          content: "\`";
        }

        :global(.mdx-content--dark) :global(hr) {
          @apply value:dark:twc-border-color-primary;
        }

        :global(.mdx-content) :global(ul) :global(li) > :global(p) {
          display: inline;
        }

        :global(.mdx-content) :global(h1),
        :global(.mdx-content) :global(h2),
        :global(.mdx-content) :global(h3),
        :global(.mdx-content) :global(h4) {
          @apply tw-mb-3;
        }

        :global(.mdx-content) :global(h1) {
          @apply tw-text-3xl;
        }

        :global(.mdx-content) :global(h2) {
          @apply tw-text-2xl;
        }

        :global(.mdx-content) :global(h3) {
          @apply tw-text-xl;
        }

        :global(.mdx-content) :global(h4) {
          @apply tw-text-lg;
        }
      `}</style>
    </article>
  );
}

export default safeRender(MDXContent);
