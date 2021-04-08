import * as React from "react";
import classnames from "classnames";

import { Link, Icon, Title as TitlePrimitive, List } from "~/components/primitive";

export { default as Code } from "./Code";
export { default as Playground } from "./Playground";
export { default as MDXContent } from "./MDXContent";

type TypeEmojiProps = {
  className?: string;
  children: string;
};

export function Emoji({ children, className }: TypeEmojiProps): any {
  return <span className={classnames("emoji", className)}>{children}</span>;
}

type TypeTextWithEmojiProps = {
  emoji: string;
  children: any;
};

export function TextWithEmoji({ emoji, children }: TypeTextWithEmojiProps): any {
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
  error: any;
  data: any;
  children: any;
}) {
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
        😵 {error.message}
      </p>
    );
  }

  return children(data);
}

function Loader() {
  return (
    <div className="root">
      <span />
      <span />
      <style jsx>{`
        .root {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }

        .root span {
          @apply dfr-border-color-primary;
          position: absolute;
          border: 4px solid;
          opacity: 1;
          border-radius: 50%;
          animation: root 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }

        .root span:nth-child(2) {
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

export function ToDoList({ children }) {
  return (
    <List>
      {React.Children.map(children, child => {
        if (child.props["data-completed"]) {
          return (
            <li>
              <span className="tw-mr-2">☑</span>
              <span className="tw-line-through tw-italic tw-opacity-75">
                {child.props.children}
              </span>
            </li>
          );
        }

        return (
          <li>
            <span className="tw-mr-2">☒</span>
            <span>{child.props.children}</span>
          </li>
        );
      })}
    </List>
  );
}

type TypeGithubRepoProps = {
  name: string;
  url: string;
  description: string;
};

export function GithubRepo({ name, url, description }: TypeGithubRepoProps): any {
  return (
    <div className="root tw-text-right" data-markdown-block>
      <Link
        className="tw-flex sm:tw-inline-flex tw-p-4 dfr-bg-secondary tw-rounded-md tw-items-center tw-relative tw-pr-8"
        href={url}
        variant={Link.variant.UNSTYLED}
      >
        <Icon icon={Icon.icon.GITHUB} wrapperClassName="tw-mr-3" size={32} />
        <div className="tw-flex-1 tw-text-left">
          <h3>{name}</h3>
          <p className="tw-text-sm dfr-text-color-primary">{description}</p>
        </div>

        <Icon icon={Icon.icon.LINK} wrapperClassName="tw-absolute tw-top-2 tw-right-2" />
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
    return <TitlePrimitive is={Tag}>{children}</TitlePrimitive>;
  };
}
