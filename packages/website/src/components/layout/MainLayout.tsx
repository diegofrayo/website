import React, { useState, useRef, Fragment } from "react";
import { useTheme } from "next-themes";
import classnames from "classnames";

import { Link, Space, Title, Icon } from "~/components/primitive";
import { useOnWindowScroll } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { TypeBreadcumbProps, TypeGenerateSupportedLocales } from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { WebsiteMetadata } from "~/utils/constants";
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
      <Space size={2} />

      <Body>
        {breadcumb && (
          <Fragment>
            <Breadcumb items={breadcumb} />
            <Space size={4} />
          </Fragment>
        )}
        <div>
          <h1 className="tw-text-left tw-text-3xl tw-font-bold">{title}</h1>
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
    <header className={classnames("tw-h-32", fixedHeader && "root--fixed")} ref={headerRef}>
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
            Diego Rayo
          </Link>
        </Title>
      </div>
      <DarkModeToggle />

      <style jsx>{`
        .root :global(h1) {
          color: black;
        }

        :global(.tw-dark) .root :global(h1) {
          color: white;
        }

        :global(.tw-dark) .root :global(.DarkModeToggle) {
          @apply value:dark:dfr-bg-secondary;
        }
      `}</style>
    </div>
  );
}

function DarkModeToggle(): any {
  const { theme, setTheme } = useTheme();

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
        <Icon
          icon={Icon.icon.SUN}
          className={classnames("tw-h-3 tw-w-3", isDarkMode && "tw-hidden")}
        />
        <Icon
          icon={Icon.icon.MOON}
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
            <Link isNextLink href={item.url || "/"} variant={Link.variant.UNSTYLED}>
              <span className="tw-underline tw-font-bold tw-text-base tw-text-black dark:tw-text-white">
                {item.text}
              </span>
            </Link>
          </li>
        );
      })}

      <style jsx>
        {`
          .root :global(a:after) {
            @apply tw-ml-1;
            color: black;
            ${moreThanOneItem ? 'content: "‣";' : ""}
          }

          :global(.tw-dark) .root :global(a:after) {
            color: white;
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
      icon: Icon.icon.EMAIL,
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
      className="tw-inline-block dark:dfr-bg-secondary tw-p-1 dark:tw-rounded-md tw-ml-2 tw-mb-1 sm:tw-my-0 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
      variant={Link.variant.UNSTYLED}
    >
      <Icon icon={icon} className="tw-h-5 tw-w-5" />
    </Link>
  );
}
