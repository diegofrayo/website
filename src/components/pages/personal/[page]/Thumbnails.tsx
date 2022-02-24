import * as React from "react";

import { Input, Block, Title, Image, InlineText, Space, Button } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import type { T_ReactElement } from "~/types";
import { downloadComponentAsImage } from "~/utils/browser";

function Thumbnails(): T_ReactElement {
  const {
    // states
    title,
    src,

    // refs
    thumbnailRef,

    // handlers
    onChange,
    handleDownloadAsImage,
  } = useController();

  return (
    <Block>
      <Block>
        <Input id="input-title" label="Title" value={title} onChange={onChange("title")} />
        <Space size={2} />
        <Input id="input-thumbnail" label="Thumbnail url" value={src} onChange={onChange("src")} />
      </Block>
      <Space size={8} />

      <Block className="tw-mx-auto tw-max-w-xl tw-text-center">
        <Thumbnail src={src} title={title} containerRef={thumbnailRef} />
        <Space size={1} />
        <Button variant={Button.variant.DEFAULT} onClick={handleDownloadAsImage}>
          <Emoji className="tw-mr-2">⬇️</Emoji>
          <InlineText>descargar como imagen</InlineText>
        </Button>
      </Block>
    </Block>
  );
}

export default Thumbnails;

// --- Controller ---

function useController() {
  const BLOG_POSTS = [
    {
      slug: "publishing-a-npm-private-package-to-github-packages-using-github-actions",
      title: "Publishing a npm private package to GitHub pakages using GitHub actions",
    },
    {
      slug: "my-favorite-music-and-mdx",
      title: "My favorite music and MDX",
    },
    {
      slug: "connecting-a-firebase-project-with-a-go-daddy-domain",
      title: "Connecting a Firebase project with a Go Daddy domain",
    },
  ];
  const CURRENT_BLOG_POST = BLOG_POSTS[0];

  const thumbnailRef = React.useRef<HTMLDivElement>(null);
  const [title, setTitle] = React.useState(CURRENT_BLOG_POST.title);
  const [src, setSrc] = React.useState(
    `/static/images/personal/thumbnails/${CURRENT_BLOG_POST.slug}.png`,
  );

  function onChange(input) {
    return (e) => {
      const value = e.currentTarget.value;

      if (input === "title") {
        setTitle(value);
      } else {
        setSrc(value);
      }
    };
  }

  async function handleDownloadAsImage(): Promise<void> {
    await downloadComponentAsImage(thumbnailRef.current, CURRENT_BLOG_POST.slug);
  }

  return {
    // states
    title,
    src,

    // refs
    thumbnailRef,

    // handlers
    onChange,
    handleDownloadAsImage,
  };
}

// --- Components ---

function Thumbnail({ title, src, containerRef }) {
  return (
    <div
      className="root tw-relative tw-mx-auto tw-flex tw-flex-col tw-items-center tw-justify-center tw-overflow-auto tw-border-8 tw-px-4 tw-py-16 dfr-border-color-dark-strong dfr-bg-color-light-strong"
      ref={containerRef}
    >
      <Image src={src} alt="Blog post thumbnail" />
      <Title
        is="h1"
        variant={Title.variant.UNSTYLED}
        className="tw-max-w-xs tw-text-center tw-font-sans tw-font-thin tw-uppercase dfr-text-color-dark-strong"
      >
        {title}
      </Title>
      <InlineText className="tw-absolute tw-bottom-1 tw-right-1 tw-text-right tw-font-mono tw-text-sm tw-font-bold dfr-text-color-dark-strong">
        {"diegofrayo.vercel.app"}
      </InlineText>
    </div>
  );
}
