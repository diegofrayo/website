import React from "react";
import classnames from "classnames";
import { useTheme } from "next-themes";

import { safeRender } from "~/hocs";

type TypeMDXContentProps = {
  content: any;
  variant?: "STYLED" | "UNSTYLED";
};

function MDXContent({ content, variant = "STYLED" }: TypeMDXContentProps): any {
  const { theme } = useTheme();

  return (
    <article
      className={classnames(
        "mdx-content",
        variant === MDXContent.variant.STYLED ? "mdx-content--styled" : "mdx-content--unstyled",
        theme === "dark" && "mdx-content--dark",
      )}
    >
      {content}

      <style jsx>{`
        /* Spacing: parent components */
        :global(.mdx-content--styled) > :global(blockquote),
        :global(.mdx-content--styled) > :global(hr),
        :global(.mdx-content--styled) > :global(img),
        :global(.mdx-content--styled) > :global(ol),
        :global(.mdx-content--styled) > :global(p),
        :global(.mdx-content--styled) > :global(pre),
        :global(.mdx-content--styled) > :global(ul),
        :global(.mdx-content--styled) :global(*[data-block]) {
          @apply tw-mb-6;
        }

        /* Spacing: nested components */
        :global(.mdx-content--styled) :global(li) > :global(p),
        :global(.mdx-content--styled) :global(li) > :global(pre),
        :global(.mdx-content--styled) :global(li) > :global(blockquote),
        :global(.mdx-content--styled) :global(li) > :global(img),
        :global(.mdx-content--styled) :global(blockquote) > :global(p) {
          @apply tw-mb-3;
        }

        /* Spacing: titles */
        :global(.mdx-content--styled) > :global(h1),
        :global(.mdx-content--styled) > :global(h2),
        :global(.mdx-content--styled) > :global(h3),
        :global(.mdx-content--styled) > :global(h4) {
          @apply tw-mt-6;
          @apply tw-mb-3;
        }

        /* Spacing: nested UL lists */
        :global(.mdx-content--styled) :global(li) > :global(ul) {
          @apply tw-mt-3;
        }

        /* Ordered lists */
        :global(.mdx-content--styled) :global(ol) {
          @apply tw-pl-9;
          list-style-type: decimal;
        }

        :global(.mdx-content--styled) :global(ol) > :global(li) {
          @apply tw-mb-6;
        }

        /* Separators */
        :global(.mdx-content--styled) :global(hr) {
          border-style: dashed;
        }

        /* Images */
        :global(.mdx-content--styled) > :global(img),
        :global(.mdx-content--styled) :global(li) > :global(img) {
          margin-left: auto;
          margin-right: auto;
        }

        /* For music pages (Custom line breaks) */
        :global(.mdx-content--unstyled) :global(br[data-separator]) {
          display: none;
        }
      `}</style>
    </article>
  );
}

MDXContent.variant = {
  STYLED: "STYLED",
  UNSTYLED: "UNSTYLED",
};

export default safeRender(MDXContent);
