import * as React from "react";
import ClipboardJS from "clipboard";

import { useDidMount } from "~/hooks";

function MDXContent({ content }: Record<string, any>): any {
  useDidMount(() => {
    setTimeout(() => {
      new ClipboardJS(".clipboard");
    }, 2000);
  });

  return (
    <article className="mdx-content">
      {content}

      <style jsx>{`
        :global(.mdx-content) > :global(p),
        :global(.mdx-content) :global(pre),
        :global(.mdx-content) :global(blockquote),
        :global(.mdx-content) :global(img),
        :global(.mdx-content) :global(hr),
        :global(.mdx-content) :global(ol) {
          @apply tw-mt-3;
          @apply tw-mb-6;
        }

        :global(.mdx-content) :global(ol) {
          @apply tw-pl-6;
          list-style-type: decimal;
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

        :global(.mdx-content) :global(blockquote) {
          @apply tw-border-black;
          @apply tw-border-l-4;
          @apply tw-pl-4;
          color: black;
          font-style: italic;
        }

        :global(.mdx-content) :global(p) :global(code) {
          @apply tw-text-red-700;
          @apply tw-text-base;
        }

        :global(.mdx-content) :global(p) :global(code):after {
          content: "\`";
        }

        :global(.mdx-content) :global(p) :global(code):before {
          content: "\`";
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

export default MDXContent;
