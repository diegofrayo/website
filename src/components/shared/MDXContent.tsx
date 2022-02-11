import * as React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { Block } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { MDXComponents } from "~/utils/mdx";
import { mirror } from "~/utils/misc";

type T_Variants = "DEFAULT" | "UNSTYLED";
const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]) as Record<T_Variants, T_Variants>;

type T_MDXContentProps = {
  content: MDXRemoteSerializeResult;
  variant?: T_Variants;
};

function MDXContent({ content, variant = VARIANTS.DEFAULT }: T_MDXContentProps): T_ReactElement {
  return (
    <Block is="article" className={`dfr-MDXContent dfr-MDXContent--${variant.toLowerCase()}`}>
      <MDXRemote {...content} components={MDXComponents as any} />

      <style jsx>{`
        /* Spacing: parent components */
        :global(.dfr-MDXContent--default) > :global(blockquote),
        :global(.dfr-MDXContent--default) > :global(hr),
        :global(.dfr-MDXContent--default) > :global(ol),
        :global(.dfr-MDXContent--default) > :global(p),
        :global(.dfr-MDXContent--default) > :global(pre),
        :global(.dfr-MDXContent--default) > :global(ul),
        :global(.dfr-MDXContent--default) > :global(a) > :global(img),
        :global(.dfr-MDXContent--default) :global(*[data-markdown-block]) {
          @apply tw-mb-6;
        }

        :global(.dfr-MDXContent--default) > :global(*):last-child {
          @apply tw-mb-0;
        }

        /* Spacing: nested components */
        :global(.dfr-MDXContent--default) :global(li) > :global(p),
        :global(.dfr-MDXContent--default) :global(li) > :global(pre),
        :global(.dfr-MDXContent--default) :global(li) > :global(blockquote),
        :global(.dfr-MDXContent--default) :global(li) > :global(img),
        :global(.dfr-MDXContent--default) :global(blockquote) > :global(p),
        :global(.dfr-MDXContent--default) :global(li) > :global(a) > :global(img) {
          @apply tw-mb-3;
        }

        /* Spacing: titles */
        :global(.dfr-MDXContent--default) > :global(h1),
        :global(.dfr-MDXContent--default) > :global(h2),
        :global(.dfr-MDXContent--default) > :global(h3),
        :global(.dfr-MDXContent--default) > :global(h4),
        :global(.dfr-MDXContent--default) :global(*[data-markdown-title]) {
          @apply tw-mt-8;
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
        :global(.dfr-MDXContent--default) > :global(a) > :global(img),
        :global(.dfr-MDXContent--default) :global(li) > :global(a) > :global(img) {
          margin-left: auto;
          margin-right: auto;
          @apply tw-rounded-md;
        }
      `}</style>
    </Block>
  );
}

MDXContent.variant = VARIANTS;

export default MDXContent;
