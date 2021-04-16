import React from "react";

import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variants = "DEFAULT" | "UNSTYLED";
const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]) as Record<T_Variants, T_Variants>;

type T_MDXContentProps = {
  content: T_ReactChildrenProp;
  variant?: T_Variants;
};

function MDXContent({ content, variant = VARIANTS.DEFAULT }: T_MDXContentProps): T_ReactElement {
  return (
    <article className={`dfr-MDXContent dfr-MDXContent--${variant.toLowerCase()}`}>
      {content}

      <style jsx>{`
        /* Spacing: parent components */
        :global(.dfr-MDXContent--default) > :global(blockquote),
        :global(.dfr-MDXContent--default) > :global(hr),
        :global(.dfr-MDXContent--default) > :global(img),
        :global(.dfr-MDXContent--default) > :global(ol),
        :global(.dfr-MDXContent--default) > :global(p),
        :global(.dfr-MDXContent--default) > :global(pre),
        :global(.dfr-MDXContent--default) > :global(ul),
        :global(.dfr-MDXContent--default) :global(*[data-markdown-block]) {
          @apply tw-mb-6;
        }

        /* Spacing: nested components */
        :global(.dfr-MDXContent--default) :global(li) > :global(p),
        :global(.dfr-MDXContent--default) :global(li) > :global(pre),
        :global(.dfr-MDXContent--default) :global(li) > :global(blockquote),
        :global(.dfr-MDXContent--default) :global(li) > :global(img),
        :global(.dfr-MDXContent--default) :global(blockquote) > :global(p) {
          @apply tw-mb-3;
        }

        /* Spacing: titles */
        :global(.dfr-MDXContent--default) > :global(h1),
        :global(.dfr-MDXContent--default) > :global(h2),
        :global(.dfr-MDXContent--default) > :global(h3),
        :global(.dfr-MDXContent--default) > :global(h4) {
          @apply tw-mt-6;
          @apply tw-mb-3;
        }

        /* Spacing: nested UL lists */
        :global(.dfr-MDXContent--default) :global(li) > :global(ul) {
          @apply tw-mt-3;
        }

        /* Ordered lists */
        :global(.dfr-MDXContent--default) :global(ol) {
          @apply tw-pl-9;
          list-style-type: decimal;
        }

        :global(.dfr-MDXContent--default) :global(ol) > :global(li) {
          @apply tw-mb-6;
        }

        /* Images */
        :global(.dfr-MDXContent--default) > :global(img),
        :global(.dfr-MDXContent--default) :global(li) > :global(img) {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </article>
  );
}

MDXContent.variant = VARIANTS;

export default MDXContent;
