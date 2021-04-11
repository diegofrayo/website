import React, { useState, useRef, Fragment } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";

import { Link, Space, Title, Icon, Button } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useDidMount, useOnWindowScroll } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { E_Icons, T_BreadcumbProps, T_GenerateSupportedLocales, T_ReactElement } from "~/types";
import { getScrollPosition, setScrollPosition } from "~/utils/browser";
import { WebsiteMetadata } from "~/utils/constants";
import { generateSlug } from "~/utils/strings";
import { Routes } from "~/utils/routing";

type T_MainLayoutProps = {
  title?: string;
  children: any;
  locales?: T_GenerateSupportedLocales;
  breadcumb?: T_BreadcumbProps["items"];
  showGoToTopButton?: boolean;
};

function MainLayout({
  children,
  locales,
  breadcumb,
  title = "",
  showGoToTopButton = false,
}: T_MainLayoutProps): T_ReactElement {
  return (
    <Main>
      <Header locales={locales} />
      <Space size={2} />

      <Body>
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

export default MainLayout;

// --- Components ---

const Main = twcss.main`dfr-max-w-base tw-w-full tw-py-4 tw-px-8 sm:tw-px-6 tw-mx-auto tw-relative`;

const Body = twcss.div``;

/*
type T_HeaderProps = {
  locales: T_GenerateSupportedLocales;
};
*/

const Header = safeRender(function Header(): T_ReactElement {
  /*
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });
  */

  const [fixedHeader, setFixedHeader] = useState(false);
  const headerRef: { current: undefined | any } = useRef(undefined);

  useOnWindowScroll(() => {
    const scrollPosition = getScrollPosition();

    if (headerRef.current && scrollPosition > headerRef.current.offsetHeight) {
      setFixedHeader(true);
    } else if (scrollPosition <= 0) {
      setFixedHeader(false);
    }
  });

  return (
    <header className={classNames("tw-h-32", fixedHeader && "root--fixed")} ref={headerRef}>
      {fixedHeader ? (
        <div className="tw-w-full tw-fixed tw-left-0 tw-top-0 tw-z-30">
          <div className="dfr-max-w-base tw-py-4 tw-px-6 tw-mx-auto">
            <HeaderContent />
          </div>
        </div>
      ) : (
        <HeaderContent />
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
});

function HeaderContent(): T_ReactElement {
  return (
    <div className="root tw-flex tw-items-center tw-w-full tw-h-full">
      <div className="tw-flex-1 tw-min-h-0 tw-mr-4">
        <Title
          is="h1"
          variant={Title.variant.UNSTYLED}
          size={Title.size.XL}
          className="tw-truncate tw-text-yellow-500 dark:tw-text-white"
        >
          <Link href="/" variant={Link.variant.UNSTYLED} isNextLink>
            Diego <Emoji className="tw-text-2xl">⚡</Emoji>
          </Link>
        </Title>
      </div>
      <DarkModeToggle />
    </div>
  );
}

function DarkModeToggle(): T_ReactElement {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <Button
      className="tw-flex tw-h-6 tw-w-12 tw-relative tw-rounded-xl tw-shadow-md dfr-bg-secondary dark:dfr-bg-secondary"
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
}

/*
type T_LocalesSelectorProps = {
  locales: T_GenerateSupportedLocales;
  currentLocale: T_Locale;
};

function LocalesSelector({ locales, currentLocale }: T_LocalesSelectorProps): T_ReactElement {
  return null;

  return (
    <div className="tw-text-sm">
      {locales.sort(sortBy([{ param: "name", order: "asc" }])).map((locale, index) => {
        return (
          <Fragment key={`LocalesSelector-${locale.name}`}>
            {currentLocale === locale.name ? (
              <span className="tw-font-bold">{locale.name}</span>
            ) : (
              <Link isNextLink href={locale.route} locale={locale.name}>
                {locale.name}
              </Link>
            )}

            {index !== locales.length - 1 && <span className="tw-mx-1">|</span>}
          </Fragment>
        );
      })}
    </div>
  );
}
*/

function Breadcumb({ items }: T_BreadcumbProps): T_ReactElement {
  const hasMoreThanOneItem: boolean = items.length > 1;

  return (
    <ul className="root tw-block tw-text-left tw-pb-1">
      {items.map(({ text, url = Routes.HOME, isNextLink = true }, index) => {
        if (index === items.length - 1 && hasMoreThanOneItem) {
          return (
            <li key={`Breadcumb-li-${generateSlug(text)}`} className="tw-inline-block">
              <span className="tw-text-base tw-italic">{text}</span>
            </li>
          );
        }

        return (
          <li key={`Breadcumb-li-${generateSlug(text)}`} className="tw-inline-block tw-mr-2">
            <Link
              href={url}
              variant={Link.variant.SECONDARY}
              isNextLink={isNextLink}
              external={false}
            >
              <span className="tw-underline tw-font-bold tw-text-base">{text}</span>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          .root :global(a:after) {
            @apply tw-ml-1;
            ${hasMoreThanOneItem ? 'content: "‣";' : ""}
          }
        `}
      </style>
    </ul>
  );
}

function Footer({ showGoToTopButton }): T_ReactElement {
  return (
    <footer className="tw-flex tw-justify-end tw-items-end tw-h-32">
      <SocialIcons />
      {showGoToTopButton && <GoToTopButton />}
    </footer>
  );
}

function SocialIcons(): T_ReactElement {
  const SOCIAL_NETWORKS = [
    {
      name: "email",
      icon: Icon.icon.GMAIL,
      url: `mailto:${WebsiteMetadata.email}`,
    },
    {
      name: "github",
      icon: Icon.icon.GITHUB,
      url: WebsiteMetadata.social.github,
      withDarkModeBackground: true,
    },
    {
      name: "spotify",
      icon: Icon.icon.SPOTIFY,
      url: WebsiteMetadata.social.spotify,
    },
    {
      name: "500px",
      icon: Icon.icon["500_PX"],
      url: WebsiteMetadata.social["500px"],
      withDarkModeBackground: true,
    },
  ];

  return (
    <div>
      {SOCIAL_NETWORKS.map((item) => {
        return <SocialIcon key={item.name} {...item} />;
      })}
    </div>
  );
}

type T_SocialIconProps = {
  icon: E_Icons;
  url: string;
  name: string;
  withDarkModeBackground?: boolean;
};

function SocialIcon({ icon, url, withDarkModeBackground }: T_SocialIconProps): T_ReactElement {
  return (
    <Link href={url} className="tw-inline-block tw-ml-4" variant={Link.variant.UNSTYLED}>
      <Icon icon={icon} size={24} withDarkModeBackground={withDarkModeBackground} />
    </Link>
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
      className="root tw-fixed tw-text-2xl tw-bottom-3 sm:tw-bottom-4 tw-right-3 sm:tw-right-4 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-transition-opacity hover:tw-opacity-75"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      onClick={() => {
        setScrollPosition(0);
      }}
    >
      <span className="tw-relative tw--top-0.5 tw-text-white tw-font-bold">↑</span>
    </Button>
  );
}
