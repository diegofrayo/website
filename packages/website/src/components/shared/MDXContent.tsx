import React from "react";
import classnames from "classnames";
import { useTheme } from "next-themes";

import { safeRender } from "~/hocs";

type TypeMDXContentProps = {
  content: any;
  variant?: "DEFAULT" | "UNSTYLED";
};

function MDXContent({ content, variant = "DEFAULT" }: TypeMDXContentProps): any {
  const { theme } = useTheme();

  return (
    <article
      className={classnames(
        "mdx-content",
        variant === MDXContent.variant.DEFAULT ? "mdx-content--default" : "mdx-content--unstyled",
        theme === "dark" && "mdx-content--dark",
      )}
    >
      {content}

      <style jsx>{`
        :global(.mdx-content) > :global(p),
        :global(.mdx-content) > :global(pre),
        :global(.mdx-content) :global(blockquote),
        :global(.mdx-content) :global(img),
        :global(.mdx-content) > :global(hr),
        :global(.mdx-content) :global(ol),
        :global(.mdx-content) :global(ul),
        :global(.mdx-content) :global(*[data-block]) {
          @apply dfr-mt-base;
          @apply dfr-mb-base;
        }

        :global(.mdx-content) :global(ol) {
          @apply tw-pl-6;
          list-style-type: decimal;
        }

        :global(.mdx-content) > :global(img) {
          margin-left: auto;
          margin-right: auto;
          max-width: 100%;
        }

        :global(.mdx-content) :global(blockquote) {
          @apply dfr-border-color-primary;
          @apply tw-border-l-4;
          @apply tw-pl-4;
          @apply dfr-text-color-secondary;
          font-style: italic;
        }

        :global(.mdx-content--dark) :global(blockquote) {
          @apply tw-text-gray-400;
        }

        :global(.mdx-content) > :global(pre),
        :global(.mdx-content) :global(.Code) :global(pre) {
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

        :global(.mdx-content) :global(hr) {
          border-style: dashed;
        }

        :global(.mdx-content--dark) :global(hr) {
          @apply value:dark:dfr-border-color-primary;
        }

        :global(.mdx-content) :global(ul) :global(li) > :global(p) {
          display: inline;
        }

        :global(.mdx-content) :global(ul) :global(li) > :global(ul) {
          @apply tw-pl-6;
          @apply tw-mt-2;
          @apply tw-mb-3;
        }

        :global(.mdx-content--default) :global(h1),
        :global(.mdx-content--default) :global(h2),
        :global(.mdx-content--default) :global(h3),
        :global(.mdx-content--default) :global(h4) {
          @apply tw-mb-3;
        }

        :global(.mdx-content--default) :global(h1) {
          @apply tw-text-3xl;
        }

        :global(.mdx-content--default) :global(h2) {
          @apply tw-text-2xl;
        }

        :global(.mdx-content--default) :global(h3) {
          @apply tw-text-xl;
        }

        :global(.mdx-content--default) :global(h4) {
          @apply tw-text-lg;
        }
      `}</style>
    </article>
  );
}

MDXContent.variant = {
  DEFAULT: "DEFAULT",
  UNSTYLED: "UNSTYLED",
};

export default safeRender(MDXContent);
