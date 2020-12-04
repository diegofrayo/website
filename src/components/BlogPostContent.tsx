import * as React from "react";

function BlogPostContent({ content }: Record<string, any>): any {
  return (
    <article className="mdx-content">
      {content}

      <style jsx>{`
        :global(.mdx-content) {
          @apply tw-text-gray-700;
        }

        :global(.mdx-content) > :global(p),
        :global(.mdx-content) :global(pre),
        :global(.mdx-content) :global(blockquote),
        :global(.mdx-content) :global(img) {
          @apply tw-mt-3;
          @apply tw-mb-6;
          overflow: auto;
        }

        :global(.mdx-content) :global(p) :global(code) {
          @apply tw-text-red-700;
        }

        :global(.mdx-content) :global(p) :global(code)::after {
          content: "\`";
        }

        :global(.mdx-content) :global(p) :global(code)::before {
          content: "\`";
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

        :global(.mdx-content) :global(a) {
          @apply tw-text-blue-600;
          text-decoration: underline;
        }

        :global(.mdx-content) :global(h1),
        :global(.mdx-content) :global(h2),
        :global(.mdx-content) :global(h3),
        :global(.mdx-content) :global(h4) {
          @apply tw-mb-3;
          color: black;
          font-weight: bold;
          overflow: auto;
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

export default BlogPostContent;
