import React, { useState, useRef, Fragment } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";

import { Title, Icon, Button, Link } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useOnWindowScroll, useTranslation } from "~/hooks";
import { T_ReactElement } from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { safeRender } from "~/hocs";

function DefaultHeader(): T_ReactElement {
  const [isHeaderFixed, setIsFixedHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useOnWindowScroll(() => {
    if (!headerRef.current) return;

    const scrollPosition = getScrollPosition();

    if (scrollPosition > headerRef.current.offsetHeight) {
      setIsFixedHeader(true);
    } else if (isHeaderFixed && scrollPosition <= headerRef.current.offsetHeight) {
      setIsFixedHeader(false);
    }
  });

  return (
    <header
      className={classNames(
        "root tw-h-96",
        isHeaderFixed ? "root--fixed" : "tw-bg-blue-500 dark:tw-bg-black tw-text-center",
      )}
      ref={headerRef}
    >
      {isHeaderFixed ? (
        <div className="tw-w-full tw-fixed tw-left-0 tw-top-0 tw-z-30 tw-shadow-sm dark:tw-shadow-none dark:tw-border-b dark:tw-border-gray-700">
          <div className="tw-max-w-screen-md tw-mx-auto tw-py-4 tw-px-6">
            <DefaultHeaderContent isHeaderFixed={isHeaderFixed} />
          </div>
        </div>
      ) : (
        <DefaultHeaderContent />
      )}

      <style jsx>{`
        .root--fixed > div {
          background-color: rgba(255, 255, 255, 0.95);
        }

        :global(.tw-dark) .root--fixed > div {
          background-color: rgba(40, 44, 52, 0.95);
        }
      `}</style>
    </header>
  );
}

function HomeHeader(): T_ReactElement {
  return (
    <header className="tw-text-center tw-relative">
      <HomeHeaderContent />
    </header>
  );
}

export { DefaultHeader, HomeHeader };

// --- Components ---

function HomeHeaderContent() {
  return (
    <Fragment>
      <div className="tw-pt-4 tw-mb-16">
        <DarkModeToggle />
      </div>
      <HeaderLogo className="tw-w-32 tw-h-32 tw-mx-auto tw-mb-4 tw-border-black" />
      <HeaderTitle className="tw-text-black dark:dfr-text-color-secondary" />
      <HeaderSubtitle className="tw-text-white tw-pb-16" />
    </Fragment>
  );
}

function DefaultHeaderContent({ isHeaderFixed = false }): T_ReactElement {
  return isHeaderFixed ? (
    <div className="tw-flex tw-items-center tw-w-full tw-h-full tw-min-h-0">
      <HeaderLogo
        className="tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-black dark:tw-border-gray-700"
        border="tw-border-0 tw-p-0"
      />
      <div className="tw-mx-4 tw-flex-1">
        <HeaderTitle className="tw-text-black dark:dfr-text-color-secondary" />
        <HeaderSubtitle className="tw-hidden sm:tw-block" />
      </div>
      <DarkModeToggle />
    </div>
  ) : (
    <HomeHeaderContent />
  );
}

function HeaderLogo({ className = "", border = "tw-border-4 tw-p-0.5" }) {
  return (
    <Link href="/" variant={Link.variant.SIMPLE} className="tw-inline-block" isNextLink>
      <img
        src="/static/images/misc/avatar.png"
        alt="Profile picture"
        className={classNames("tw-rounded-full tw-shadow-md", className, border)}
      />
    </Link>
  );
}

function HeaderTitle({ className = "" }) {
  return (
    <Link href="/" variant={Link.variant.SIMPLE} className="tw-block" isNextLink>
      <Title is="h1" className={className} size={Title.size.XL} variant={Title.variant.UNSTYLED}>
        Diego <Emoji className="tw-text-2xl">⚡</Emoji>
      </Title>
    </Link>
  );
}

function HeaderSubtitle({ className = "" }) {
  const { t } = useTranslation({
    layout: true,
  });

  return (
    <p
      className={classNames("tw-text-sm tw-mt-1 tw-font-mono", className)}
      dangerouslySetInnerHTML={{ __html: t("layout:header:role") }}
    />
  );
}

const DarkModeToggle = safeRender(function DarkModeToggle(): T_ReactElement {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <Button
      className="tw-relative tw-inline-flex tw-h-6 tw-w-12 tw-rounded-xl tw-shadow-md dfr-bg-secondary dark:dfr-bg-secondary"
      onClick={() => {
        setTheme(isDarkMode ? "light" : "dark");
      }}
    >
      <span
        className={classNames(
          "tw-rounded-full tw-p-1 tw-w-7 tw-h-7 tw-absolute tw--top-0.5 tw-flex tw-items-center tw-justify-center tw-bg-white tw-shadow-md tw-border-t tw-border-l dfr-border-color-primary dark:tw-border-0",
          isDarkMode ? "tw--right-0.5" : "tw--left-0.5",
        )}
      >
        <Icon
          icon={Icon.icon.SUN}
          wrapperClassName={classNames("tw-relative tw--left-1px", isDarkMode && "tw-hidden")}
        />
        <Icon icon={Icon.icon.MOON} wrapperClassName={classNames(!isDarkMode && "tw-hidden")} />
      </span>
    </Button>
  );
});
