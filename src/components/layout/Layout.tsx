import React, { useState, Fragment } from "react";

import { Link, Space, Title, Button } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import { T_BreadcumbProps, T_ReactChildrenProp, T_ReactElement } from "~/types";
import { getScrollPosition, setScrollPosition } from "~/utils/browser";
import { ROUTES } from "~/utils/routing";
import { generateSlug, removeEmojiFromString } from "~/utils/strings";

import { DefaultHeader, HomeHeader } from "./Header";

type T_MainLayoutProps = {
  title?: string;
  children: T_ReactChildrenProp;
  breadcumb?: T_BreadcumbProps["items"];
  showGoToTopButton?: boolean;
};

function MainLayout({
  children,
  breadcumb,
  title = "",
  showGoToTopButton = false,
}: T_MainLayoutProps): T_ReactElement {
  return (
    <Main className="tw-pb-20">
      <DefaultHeader />
      <Space size={8} />

      <Body className="dfr-max-w-base">
        {breadcumb && (
          <Fragment>
            <Breadcumb items={breadcumb} />
            <Space size={4} />
          </Fragment>
        )}
        <div>
          {title && (
            <Title is="h1" className="tw-text-left">
              {title}
            </Title>
          )}
          <Space className="tw-my-5 sm:tw-my-3" />

          {children}
        </div>
      </Body>
      <Space size={2} />

      <Footer showGoToTopButton={showGoToTopButton} />
    </Main>
  );
}

function HomeLayout(): T_ReactElement {
  return (
    <Main className="tw-bg-gradient-to-b tw-from-blue-400 tw-to-blue-600 dark:tw-from-gray-700 dark:tw-to-gray-900 tw-h-screen tw-overflow-auto tw-block sm:tw-flex tw-justify-center tw-items-center">
      <HomeHeader />
    </Main>
  );
}

export { MainLayout, HomeLayout };

// --- Components ---

const Main = twcss.main`tw-relative`;

const Body = twcss.div`tw-w-full tw-mx-auto tw-px-8 sm:tw-px-6`;

function Breadcumb({ items }: T_BreadcumbProps): T_ReactElement {
  const hasMoreThanOneItem = items.length > 1;

  return (
    <ul className="root tw-block tw-text-left tw-pb-1">
      {items.map(({ text, url = ROUTES.HOME, isNextLink = true }, index) => {
        if (index === items.length - 1 && hasMoreThanOneItem) {
          return (
            <li key={generateSlug(text)} className="tw-inline-block">
              <span className="tw-text-base tw-italic">{removeEmojiFromString(text)}</span>
            </li>
          );
        }

        return (
          <li key={generateSlug(text)} className="tw-inline-block tw-mr-2">
            <Link
              href={url}
              variant={Link.variant.SECONDARY}
              isNextLink={isNextLink}
              external={false}
            >
              <span className="tw-font-bold tw-text-base">{text}</span>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          .root :global(a::after) {
            @apply tw-ml-1;
            ${hasMoreThanOneItem ? 'content: "❯";' : ""}
          }
        `}
      </style>
    </ul>
  );
}

function Footer({ showGoToTopButton }): T_ReactElement {
  return (
    <footer className="tw-flex tw-justify-end tw-items-end tw-relative tw-h-16">
      {showGoToTopButton && <GoToTopButton />}
    </footer>
  );
}

function GoToTopButton(): T_ReactElement {
  const [showGoToTopButton, setShowGoToTopButton] = useState<boolean>(false);

  useDidMount(() => {
    // TODO: Isolate this code

    function onScroll() {
      if (getScrollPosition() > 0) {
        setShowGoToTopButton(true);
      } else {
        setShowGoToTopButton(false);
      }
    }

    function onScrollStopped() {
      if (!mounted) return;
      setShowGoToTopButton(false);
    }

    let isScrolling = 0;
    let mounted = true;

    function onScrollCallback() {
      window.clearTimeout(isScrolling);

      onScroll();

      isScrolling = window.setTimeout(() => {
        onScrollStopped();
      }, 3000);
    }

    window.addEventListener("scroll", onScrollCallback, false);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScrollCallback, false);
    };
  });

  if (!showGoToTopButton) return null;

  return (
    <Button
      className="tw-fixed tw-text-2xl tw-bottom-3 sm:tw-bottom-4 tw-right-3 sm:tw-right-4 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-transition-opacity hover:tw-opacity-75"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      onClick={() => {
        setScrollPosition(0);
      }}
    >
      <span className="tw-text-white tw-font-bold tw-relative tw--top-0.5 md:tw-top-0">↑</span>
    </Button>
  );
}
