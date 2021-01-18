import * as React from "react";
import classnames from "classnames";

import { UL } from "~/components/primitive";

export { default as ErrorPage } from "./ErrorPage";
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
      <Emoji className="tw-text-xl tw-mr-3 tw-w-6 tw-h-6 tw-flex-shrink-0 tw-overflow-hidden">
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
      <span></span>
      <span></span>
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
    <UL>
      {React.Children.map(children, child => {
        if (child.props["data-completed"]) {
          return (
            <li>
              <span className="tw-font-bold tw-mr-1">☑</span>
              <span className="tw-line-through tw-italic tw-opacity-75">
                {child.props.children}
              </span>
            </li>
          );
        }

        return (
          <li>
            <span className="tw-font-bold tw-mr-1">☒</span>
            <span>{child.props.children}</span>
          </li>
        );
      })}
    </UL>
  );
}
