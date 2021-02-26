import React from "react";

import { Link, Image } from "~/components/primitive";
import { useAssets } from "~/hooks";
import { generateSlug } from "~/utils/strings";

export * from "./blog-posts/html-semantic-tags";
export * from "./blog-posts/music";
export * from "./blog-posts/my-favorite-music-and-mdx";
export * from "./pages/resume";

export { default as Code } from "./Code";
export { default as Playground } from "./Playground";

type TypeGithubRepoProps = {
  name: string;
  url: string;
  description: string;
};

export function GithubRepo({ name, url, description }: Record<string, any>): any {
  const { BlogPostAssets } = useAssets();

  return (
    <div className="root tw-text-right" data-block>
      <Link
        className="dfr-border-color-primary tw-border dark:tw-border-0 tw-flex sm:tw-inline-flex tw-p-4 dfr-bg-secondary tw-rounded-md tw-items-center tw-relative tw-pr-8"
        href={url}
        styled={false}
      >
        <Image src={BlogPostAssets.GITHUB} alt="Github icon" className="tw-h-8 tw-w-8 tw-mr-3" />
        <div className="tw-flex-1 tw-text-left">
          <h3>{name}</h3>
          <p className="tw-text-sm dfr-text-color-primary">{description}</p>
        </div>

        <Image
          src={BlogPostAssets.LINK}
          alt="Link icon"
          className="tw-absolute tw-top-2 tw-right-2 tw-h-4 tw-w-4"
        />
      </Link>

      <style jsx>{`
        .root :global(img),
        .root h3,
        .root p {
          @apply tw-my-0;
        }

        .root h3 {
          @apply tw-text-base;
          @apply dfr-text-color-secondary;

          @screen sm {
            @apply tw-text-lg;
          }
        }
      `}</style>
    </div>
  );
}

export function Title(Tag: "h1" | "h2" | "h3" | "h4"): any {
  return function TitleComponent({ children }: Record<string, any>): any {
    return <Tag id={generateSlug(children)}>{children}</Tag>;
  };
}
