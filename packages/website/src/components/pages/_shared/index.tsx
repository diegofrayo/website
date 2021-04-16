import React from "react";
import classNames from "classnames";

import { Link, Icon, Title as TitlePrimitive } from "~/components/primitive";
import {
  T_HTML_Attributes,
  T_Object,
  T_ReactChildrenProp,
  T_ReactElement,
  T_ReactFunctionComponent,
} from "~/types";

export { default as Code } from "./Code";
export { default as Playground } from "./Playground";
export { default as MDXContent } from "./MDXContent";

export function Emoji({ children, className }: T_HTML_Attributes["span"]): T_ReactElement {
  return <span className={classNames("emoji", className)}>{children}</span>;
}

type T_TextWithEmojiProps = {
  emoji: string;
  children: T_ReactChildrenProp;
};

export function TextWithEmoji({ emoji, children }: T_TextWithEmojiProps): T_ReactElement {
  return (
    <div className="tw-flex tw-flex-nowrap tw-mb-3">
      <Emoji className="tw-text-xl tw-mr-3 tw-w-6 tw-h-6 tw-flex-shrink-0 tw-overflow-hidden tw-relative tw--top-0.5">
        {emoji}
      </Emoji>
      <p className="tw-flex-1">{children}</p>
    </div>
  );
}

export function Render({
  isLoading,
  error,
  data,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  data: unknown;
  children: (data: unknown) => T_ReactElement;
}): T_ReactElement {
  if (isLoading) {
    return (
      <div className="tw-p-2 tw-text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="tw-p-2 tw-text-center tw-text-red-700 tw-text-sm tw-font-mono">
        😵 {(error as T_Object)?.message}
      </p>
    );
  }

  return children(data);
}

function Loader() {
  return (
    <div className="root">
      <div />
      <div />

      <style jsx>{`
        .root {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }

        .root div {
          @apply dfr-border-color-primary;
          position: absolute;
          border: 4px solid;
          opacity: 1;
          border-radius: 50%;
          animation: root 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }

        .root div:nth-child(2) {
          animation-delay: -0.5s;
        }

        @keyframes root {
          0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

type T_GithubRepoProps = {
  name: string;
  url: string;
  description: string;
};

export function GithubRepo({ name, url, description }: T_GithubRepoProps): T_ReactElement {
  return (
    <div className="tw-text-right" data-markdown-block>
      <Link
        className="tw-flex sm:tw-inline-flex tw-p-4 dfr-bg-secondary dark:dfr-bg-secondary tw-rounded-md tw-items-center tw-relative tw-pr-8 tw-border dfr-border-color-primary dark:dfr-border-color-primary"
        href={url}
        variant={Link.variant.SIMPLE}
      >
        <Icon icon={Icon.icon.GITHUB} wrapperClassName="tw-mr-3" size={32} />

        <div className="tw-flex-1 tw-text-left">
          <TitlePrimitive
            is="h3"
            className="tw-text-black tw-text-base sm:tw-text-lg"
            variant={TitlePrimitive.variant.UNSTYLED}
          >
            {name}
          </TitlePrimitive>
          <p className="tw-text-sm">{description}</p>
        </div>

        <Icon
          icon={Icon.icon.LINK}
          wrapperClassName="tw-absolute tw-top-2 tw-right-2"
          iconClassName="tw-text-black"
        />
      </Link>
    </div>
  );
}

export function Title(
  Tag: "h1" | "h2" | "h3" | "h4",
  props: T_Object,
): T_ReactFunctionComponent<{ children: T_ReactChildrenProp }> {
  return function TitleComponent({ children }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <TitlePrimitive is={Tag} {...props}>
        {children}
      </TitlePrimitive>
    );
  };
}
