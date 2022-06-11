import * as React from "react";

import { Input, Block, Title, Image, InlineText, Space, Button } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import type {
  T_ReactElement,
  T_ReactOnChangeEventHandler,
  T_ReactOnClickEventHandler,
  T_ReactRefObject,
} from "~/types";
import { downloadComponentAsImage } from "~/utils/browser";
import { isNotDefined } from "~/utils/validations";

function Thumbnails(): T_ReactElement {
  const {
    // states & refs
    title,
    src,
    thumbnailRef,

    // handlers
    onChangeHandler,
    handleDownloadAsImageClick,
  } = useController();

  return (
    <Block>
      <Block>
        <Input
          id="input-title"
          label="Title"
          value={title}
          onChange={onChangeHandler("title")}
        />
        <Space size={2} />
        <Input
          id="input-thumbnail"
          label="Thumbnail url"
          value={src}
          onChange={onChangeHandler("src")}
        />
      </Block>
      <Space size={8} />

      <Block className="tw-mx-auto tw-max-w-xl tw-text-center">
        <Thumbnail
          src={src}
          title={title}
          thumbnailRef={thumbnailRef}
        />
        <Space size={1} />
        <Button
          variant={Button.variant.DEFAULT}
          onClick={handleDownloadAsImageClick}
        >
          <Emoji className="tw-mr-2">⬇️</Emoji>
          <InlineText>descargar como imagen</InlineText>
        </Button>
      </Block>
    </Block>
  );
}

export default Thumbnails;

// --- Controller ---

type T_UseControllerReturn = {
  title: string;
  src: string;
  thumbnailRef: T_ReactRefObject<HTMLDivElement>;
  onChangeHandler: (inputName: "src" | "title") => T_ReactOnChangeEventHandler<HTMLInputElement>;
  handleDownloadAsImageClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
};

function useController(): T_UseControllerReturn {
  // vars
  const BLOG_POSTS = [
    {
      slug: "connecting-a-firebase-project-with-a-go-daddy-domain",
      title: "Connecting a Firebase project with a Go Daddy domain",
    },
    {
      slug: "my-favorite-music-and-mdx",
      title: "My favorite music and MDX",
    },
    {
      slug: "publishing-a-npm-private-package-to-github-packages-using-github-actions",
      title: "Publishing a npm private package to GitHub pakages using GitHub actions",
    },
  ];
  const CURRENT_BLOG_POST = BLOG_POSTS[1];

  // states & refs
  const [title, setTitle] = React.useState(CURRENT_BLOG_POST.title);
  const [src, setSrc] = React.useState("/static/images/pages/personal/thumbnails/code-1.png");
  const thumbnailRef = React.useRef<HTMLDivElement>(null);

  // handlers
  const onChangeHandler: T_UseControllerReturn["onChangeHandler"] = function onChangeHandler(
    inputName,
  ) {
    return (event) => {
      const { value } = event.currentTarget;

      if (inputName === "title") {
        setTitle(value);
      } else {
        setSrc(value);
      }
    };
  };

  const handleDownloadAsImageClick: T_UseControllerReturn["handleDownloadAsImageClick"] =
    async function handleDownloadAsImageClick(): Promise<void> {
      if (isNotDefined(thumbnailRef.current)) return;

      await downloadComponentAsImage(thumbnailRef.current, CURRENT_BLOG_POST.slug);
    };

  return {
    // states & refs
    title,
    src,
    thumbnailRef,

    // handlers
    onChangeHandler,
    handleDownloadAsImageClick,
  };
}

// --- Components ---

type T_ThumbnailProps = Pick<T_UseControllerReturn, "title" | "src" | "thumbnailRef">;

function Thumbnail({ title, src, thumbnailRef }: T_ThumbnailProps): T_ReactElement {
  return (
    <Block
      className="tw-relative tw-mx-auto tw-flex tw-h-80 tw-flex-col tw-items-center tw-justify-center tw-overflow-auto tw-bg-gradient-to-b tw-from-black tw-to-gray-800 tw-px-4 tw-py-16"
      ref={thumbnailRef}
    >
      <Image
        src={src}
        alt="Blog post thumbnail"
        className="tw-w-24"
      />
      <Title
        is="h1"
        variant={Title.variant.UNSTYLED}
        className="tw-mt-2 tw-max-w-xs tw-text-center tw-font-sans tw-font-thin tw-uppercase tw-text-gray-200"
      >
        {title}
      </Title>
      <InlineText className="tw-absolute tw-bottom-1 tw-right-2 tw-text-right tw-font-mono tw-text-xs tw-font-bold tw-italic tw-text-gray-400">
        diegofrayo.vercel.app
      </InlineText>
    </Block>
  );
}
