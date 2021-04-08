import React, { useState, useRef, Fragment } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";

import { Link, Space, Title, Icon, Button } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useOnWindowScroll } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { TypeBreadcumbProps, TypeGenerateSupportedLocales } from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { WebsiteMetadata } from "~/utils/constants";
import { generateSlug } from "~/utils/strings";
import { Routes } from "~/utils/routing";

type TypeMainLayoutProps = {
  title?: string;
  children: any;
  locales?: TypeGenerateSupportedLocales;
  breadcumb?: TypeBreadcumbProps["items"];
};

function MainLayout({ children, locales, breadcumb, title }: TypeMainLayoutProps): JSX.Element {
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

      <Footer />
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`dfr-max-w-base tw-w-full tw-py-4 tw-px-6 tw-mx-auto tw-relative`;

const Body = twcss.div``;

/*
type TypeHeaderProps = {
  locales: TypeGenerateSupportedLocales;
};
*/

const Header = safeRender(function Header(): any {
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

function HeaderContent() {
  return (
    <div className="root tw-flex tw-items-center tw-w-full tw-h-full">
      <div className="tw-flex-1 tw-min-h-0 tw-mr-4">
        <Title is="h1" className="tw-truncate">
          <Link href="/" variant={Link.variant.UNSTYLED} isNextLink>
            Diego <Emoji className="tw-text-2xl">⚡</Emoji>
          </Link>
        </Title>
      </div>
      <DarkModeToggle />

      <style jsx>{`
        .root :global(h1) {
          @apply tw-text-yellow-500;
        }

        :global(.tw-dark) .root :global(h1) {
          @apply tw-text-white;
        }
      `}</style>
    </div>
  );
}

function DarkModeToggle(): any {
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
        <Icon icon={Icon.icon.SUN} wrapperClassName={classNames(isDarkMode && "tw-hidden")} />
        <Icon icon={Icon.icon.MOON} wrapperClassName={classNames(!isDarkMode && "tw-hidden")} />
      </span>
    </Button>
  );
}

/*
type TypeLocalesSelectorProps = {
  locales: TypeGenerateSupportedLocales;
  currentLocale: TypeLocale;
};

function LocalesSelector({ locales, currentLocale }: TypeLocalesSelectorProps): any {
  return null;

  return (
    <div className="tw-text-sm">
      {locales.sort(sortBy([{param: "name", order: "asc"}])).map((locale, index) => {
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

function Breadcumb({ items }: TypeBreadcumbProps): JSX.Element {
  const hasMoreThanOneItem: boolean = items.length > 1;

  return (
    <ul className="root tw-block tw-text-left tw-pb-1">
      {items.map((item, index) => {
        if (index === items.length - 1 && hasMoreThanOneItem) {
          return (
            <li key={`Breadcumb-li-${generateSlug(item.text)}`} className="tw-inline-block">
              <span className="tw-text-base tw-italic">{item.text}</span>
            </li>
          );
        }

        return (
          <li key={`Breadcumb-li-${generateSlug(item.text)}`} className="tw-inline-block tw-mr-2">
            <Link href={item.url || Routes.HOME} variant={Link.variant.SECONDARY} isNextLink>
              <span className="tw-underline tw-font-bold tw-text-base">{item.text}</span>
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

function Footer() {
  return (
    <footer className="tw-flex tw-justify-end tw-items-end tw-h-32">
      <SocialIcons />
    </footer>
  );
}

function SocialIcons(): JSX.Element {
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
    },
  ];

  return (
    <div>
      {SOCIAL_NETWORKS.map(item => {
        return <SocialIcon key={item.name} {...item} />;
      })}
    </div>
  );
}

type TypeSocialIconProps = {
  icon: string;
  url: string;
  name: string;
};

function SocialIcon({ icon, url }: TypeSocialIconProps): any {
  return (
    <Link
      href={url}
      className="tw-inline-block tw-ml-4 dark:tw-ml-2"
      variant={Link.variant.UNSTYLED}
    >
      <Icon icon={icon} size={24} withDarkModeBackground />
    </Link>
  );
}
