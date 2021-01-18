import React, { Fragment, useState, useRef } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import classnames from "classnames";

import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useAssets, useInternationalization, useOnWindowScroll } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import {
  TypeBreadcumbProps,
  TypeGenerateSupportedLocales,
  TypeLocale,
  TypePagesRoutes,
} from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { sortBy } from "~/utils/misc";

import { Link, Separator, Emoji, Breadcumb, Image } from "./";

type TypeMainLayoutProps = {
  title: string;
  children: any;
  locales?: TypeGenerateSupportedLocales;
  breadcumb?: TypeBreadcumbProps["items"];
};

function MainLayout({ children, locales, breadcumb, title }: TypeMainLayoutProps): any {
  return (
    <Main>
      <Header locales={locales} />
      <Separator size={2} />

      <Body>
        {breadcumb && <Breadcumb items={breadcumb} />}
        <Separator size={4} />

        <div>
          <h1 className="tw-text-left tw-text-3xl tw-font-bold">{title}</h1>
          <Separator className="tw-my-5 sm:tw-my-3" />

          {children}
        </div>
      </Body>
      <Separator size={8} />

      <Footer />
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`dfr-max-w-base tw-w-full tw-py-4 tw-px-6 tw-mx-auto tw-relative`;

const Body = twcss.div``;

type TypeHeaderProps = {
  locales: TypeGenerateSupportedLocales;
};

const Header = safeRender(function Header({ locales }: TypeHeaderProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const [fixedHeader, setFixedHeader] = useState(false);
  const headerRef: { current: undefined | any } = useRef(undefined);

  useOnWindowScroll(() => {
    const scrollPosition = getScrollPosition();

    if (headerRef.current && scrollPosition > headerRef.current.offsetHeight) {
      setFixedHeader(true);
    } else if (scrollPosition === 0) {
      setFixedHeader(false);
    }
  });

  if (fixedHeader) {
    return (
      <header className="root tw-fixed tw-w-full tw-left-0 tw-top-0 tw-z-30 dfr-bg-secondary dark:tw-bg-black tw-shadow-md">
        <div className="tw-p-4 tw-flex dfr-max-w-base tw-mx-auto tw-items-center">
          <Link
            is={NextLink}
            href={Routes.HOME}
            className="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-border-2 sm:tw-border-4 tw-border-blue-500 dark:dfr-border-color-primary tw-bg-blue-200 dark:tw-bg-gray-300 tw-mr-4 tw-rounded-lg tw-text-xl"
            styled={false}
            role="button"
            aria-label="Go to home page"
          >
            <Emoji>👨‍💻</Emoji>
          </Link>
          <h1 className="tw-text-2xl sm:tw-text-4xl tw-flex-1 tw-font-bold">
            Diego Rayo
          </h1>
          <DarkModeToggle />
        </div>

        <style jsx>{`
          :global(.tw-dark) .root :global(.DarkModeToggle) {
            @apply value:dark:dfr-bg-secondary;
          }
        `}</style>
      </header>
    );
  }

  return (
    <header
      className="dfr-border-color-primary tw-border-b tw-pb-4 tw-flex tw-items-center sm:tw-items-start"
      ref={headerRef}
    >
      <Link
        is={NextLink}
        href={Routes.HOME}
        className="tw-flex tw-items-center tw-justify-center tw-w-10 sm:tw-w-16 tw-h-10 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 dark:dfr-border-color-primary tw-bg-blue-200 dark:tw-bg-gray-300 tw-rounded-lg tw-text-2xl tw-relative sm:tw-top-1"
        styled={false}
        role="button"
        aria-label="Go to home page"
      >
        <Emoji>👨‍💻</Emoji>
      </Link>
      <div className="tw-flex-1 tw-mx-4">
        <h1 className="tw-text-2xl sm:tw-text-4xl tw-font-bold">Diego Rayo</h1>
        <p className="tw-text-sm sm:tw-text-base">
          {SiteTexts.layout.current_locale.header.job_title}
        </p>
      </div>
      <div className="tw-flex tw-flex-shrink-0 tw-self-stretch tw-relative tw-flex-col tw-justify-between tw-items-end">
        <div className="tw-relative tw-top-2">
          <DarkModeToggle />
        </div>
        <Separator size={3} />
        {locales && <LocalesSelector locales={locales} currentLocale={currentLocale} />}
      </div>
    </header>
  );
});

function DarkModeToggle(): any {
  const { theme, setTheme } = useTheme();
  const { HeaderAssets } = useAssets();

  const isDarkMode = theme === "dark";

  return (
    <button
      className={
        "DarkModeToggle tw-flex tw-h-6 tw-w-12 tw-relative tw-rounded-xl tw-shadow-md tw-bg-black"
      }
      onClick={() => {
        setTheme(isDarkMode ? "light" : "dark");
      }}
    >
      <span
        className={classnames(
          "tw-rounded-full tw-p-1 tw-w-7 tw-h-7 tw-absolute tw--top-0.5 tw-flex tw-items-center tw-justify-center tw-bg-white tw-border tw-border-black dark:tw-border-white",
          isDarkMode ? "tw--right-0.5" : "tw--left-0.5",
        )}
      >
        <Image
          src={HeaderAssets.SUN}
          alt="Sun icon"
          className={classnames("tw-h-3 tw-w-3", isDarkMode && "tw-hidden")}
        />
        <Image
          src={HeaderAssets.MOON}
          alt="Moon icon"
          className={classnames("tw-h-3 tw-w-3", !isDarkMode && "tw-hidden")}
        />
      </span>
    </button>
  );
}

type TypeLocalesSelectorProps = {
  locales: TypeGenerateSupportedLocales;
  currentLocale: TypeLocale;
};

function LocalesSelector({ locales, currentLocale }: TypeLocalesSelectorProps): any {
  return (
    <div className="tw-border tw-py-1 tw-px-2 tw-text-sm dfr-border-color-primary dark:dfr-border-color-primary">
      {locales.sort(sortBy("name", "asc")).map((locale, index) => {
        return (
          <Fragment key={`LocalesSelector-${locale.name}`}>
            {currentLocale === locale.name ? (
              <span className="tw-font-bold">{locale.name}</span>
            ) : (
              <Link is={NextLink} href={locale.route} locale={locale.name}>
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

function Footer() {
  return (
    <footer className="dfr-border-color-primary tw-border-t tw-pt-4 tw-text-center">
      <SocialIcons />
    </footer>
  );
}

function SocialIcons(): any {
  const { FooterAssets } = useAssets();

  const SOCIAL_NETWORKS = [
    {
      name: "github",
      icon: FooterAssets.GITHUB,
      url: WEBSITE_METADATA.social.github,
    },
    {
      name: "twitter",
      icon: FooterAssets.TWITTER_COLORFUL,
      url: WEBSITE_METADATA.social.twitter,
    },
    {
      name: "linkedin",
      icon: FooterAssets.LINKEDIN,
      url: WEBSITE_METADATA.social.linkedin,
    },
    {
      name: "email",
      icon: FooterAssets.EMAIL,
      url: `mailto:${WEBSITE_METADATA.email}`,
    },
    {
      name: "spotify",
      icon: FooterAssets.SPOTIFY,
      url: WEBSITE_METADATA.social.spotify,
    },
    {
      name: "500px",
      icon: FooterAssets["500_PX"],
      url: WEBSITE_METADATA.social["500px"],
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

function SocialIcon({ icon, url, name }: TypeSocialIconProps): any {
  return (
    <Link
      href={url}
      className="tw-inline-block dark:dfr-bg-secondary tw-p-1 dark:tw-rounded-md tw-mx-2 tw-my-1 sm:tw-my-0 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
      styled={false}
    >
      <Image src={icon} alt={`${name} icon`} className="tw-h-5 tw-w-5" />
    </Link>
  );
}
