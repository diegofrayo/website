import React, { useState, useRef, Fragment } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import classnames from "classnames";

import { Link, Separator, Image } from "~/components/primitive";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import { useAssets, useOnWindowScroll } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { TypeBreadcumbProps, TypeGenerateSupportedLocales } from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";

type TypeMainLayoutProps = {
  title?: string;
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
        {breadcumb && (
          <Fragment>
            <Breadcumb items={breadcumb} />
            <Separator size={4} />
          </Fragment>
        )}
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

/*
type TypeHeaderProps = {
  locales: TypeGenerateSupportedLocales;
};
*/

const Header = safeRender(function Header(): any {
  /*
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });
  */

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
          <h1 className="tw-text-2xl sm:tw-text-4xl tw-flex-1 tw-font-bold">Diego Rayo</h1>
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
    <header className="tw-flex tw-items-center tw-justify-between" ref={headerRef}>
      <div className="tw-flex-1 tw-mr-4">
        <h1 className="tw-text-2xl sm:tw-text-4xl tw-font-bold">Diego Rayo</h1>
      </div>
      <DarkModeToggle />
      {/*
      <div className="tw-flex tw-flex-shrink-0 tw-self-stretch tw-relative tw-flex-col tw-justify-between tw-items-end">
        <div className="tw-relative tw-top-2">
          <DarkModeToggle />
        </div>
        <Separator size={4} />
        {locales && <LocalesSelector locales={locales} currentLocale={currentLocale} />}
      </div>
      */}
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

/*
type TypeLocalesSelectorProps = {
  locales: TypeGenerateSupportedLocales;
  currentLocale: TypeLocale;
};

function LocalesSelector({ locales, currentLocale }: TypeLocalesSelectorProps): any {
  return null;

  return (
    <div className="tw-text-sm">
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
*/

function Breadcumb({ items }: TypeBreadcumbProps): any {
  const moreThanOneItem = items.length > 1;

  return (
    <ul className="root tw-block tw-text-left tw-pb-1">
      {items.map((item, index) => {
        if (index === items.length - 1 && moreThanOneItem) {
          return (
            <li key={`Breadcumb-li-${generateSlug(item.text)}`} className="tw-inline-block">
              <span className="tw-text-base tw-italic">{item.text}</span>
            </li>
          );
        }

        return (
          <li key={`Breadcumb-li-${generateSlug(item.text)}`} className="tw-inline-block tw-mr-2">
            <Link is={NextLink} href={item.url || "/"} styled={false}>
              <span className="tw-underline tw-font-bold tw-text-base">{item.text}</span>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          .root :global(a:after) {
            @apply tw-ml-1;
            ${moreThanOneItem ? 'content: "‣";' : ""}
          }
        `}
      </style>
    </ul>
  );
}

function Footer() {
  return (
    <footer className="tw-text-right">
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
      className="tw-inline-block dark:dfr-bg-secondary tw-p-1 dark:tw-rounded-md tw-ml-2 tw-mb-1 sm:tw-my-0 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
      styled={false}
    >
      <Image src={icon} alt={`${name} icon`} className="tw-h-5 tw-w-5" />
    </Link>
  );
}
