import React from "react";

import { safeRender } from "~/hocs";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";

enum E_Variant {
  STYLED = "STYLED",
  UNSTYLED = "UNSTYLED",
}

type T_MDXContentProps = {
  content: T_ReactChildrenProp;
  variant?: E_Variant;
};

function MDXContent({ content, variant = E_Variant.STYLED }: T_MDXContentProps): T_ReactElement {
  return (
    <article className={`dfr-MDXContent dfr-MDXContent--${variant.toLowerCase()}`}>
      {content}

      <style jsx>{`
        /* Spacing: parent components */
        :global(.dfr-MDXContent--styled) > :global(blockquote),
        :global(.dfr-MDXContent--styled) > :global(hr),
        :global(.dfr-MDXContent--styled) > :global(img),
        :global(.dfr-MDXContent--styled) > :global(ol),
        :global(.dfr-MDXContent--styled) > :global(p),
        :global(.dfr-MDXContent--styled) > :global(pre),
        :global(.dfr-MDXContent--styled) > :global(ul),
        :global(.dfr-MDXContent--styled) :global(*[data-markdown-block]) {
          @apply tw-mb-6;
        }

        /* Spacing: nested components */
        :global(.dfr-MDXContent--styled) :global(li) > :global(p),
        :global(.dfr-MDXContent--styled) :global(li) > :global(pre),
        :global(.dfr-MDXContent--styled) :global(li) > :global(blockquote),
        :global(.dfr-MDXContent--styled) :global(li) > :global(img),
        :global(.dfr-MDXContent--styled) :global(blockquote) > :global(p) {
          @apply tw-mb-3;
        }

        /* Spacing: titles */
        :global(.dfr-MDXContent--styled) > :global(h1),
        :global(.dfr-MDXContent--styled) > :global(h2),
        :global(.dfr-MDXContent--styled) > :global(h3),
        :global(.dfr-MDXContent--styled) > :global(h4) {
          @apply tw-mt-6;
          @apply tw-mb-3;
        }

        /* Spacing: nested UL lists */
        :global(.dfr-MDXContent--styled) :global(li) > :global(ul) {
          @apply tw-mt-3;
        }

        /* Ordered lists */
        :global(.dfr-MDXContent--styled) :global(ol) {
          @apply tw-pl-9;
          list-style-type: decimal;
        }

        :global(.dfr-MDXContent--styled) :global(ol) > :global(li) {
          @apply tw-mb-6;
        }

        /* Images */
        :global(.dfr-MDXContent--styled) > :global(img),
        :global(.dfr-MDXContent--styled) :global(li) > :global(img) {
          margin-left: auto;
          margin-right: auto;
        }

        /* For music pages (Custom line breaks | Temporary solution) */
        :global(.dfr-MDXContent) :global(br[data-separator]) {
          display: none;
        }
      `}</style>
    </article>
  );
}

MDXContent.variant = E_Variant;

export default safeRender(MDXContent);
