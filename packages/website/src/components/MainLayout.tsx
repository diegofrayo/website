import React, { Fragment, useState, useRef } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import classnames from "classnames";

import GITHUB from "~/data/github.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import {
  useAssets,
  useDidMount,
  useInternationalization,
  useOnWindowScroll,
} from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import {
  copyToClipboard,
  createQueryFromObject,
  getScrollPosition,
  onScrollStoppedListener,
  setScrollPosition,
} from "~/utils/misc";

import { Link, Separator, Emoji, Breadcumb, Image } from "./";

function MainLayout({
  children,
  locales,
  breadcumb,
  title,
  blogMetadata,
}: Record<string, any>): any {
  return (
    <Main>
      <Header locales={locales} />
      <Separator size={2} />

      <Body>
        {breadcumb && <Breadcumb items={breadcumb} />}
        <Separator size={4} />
        {title && (
          <Fragment>
            <h1 className="tw-text-left tw-text-3xl tw-font-bold">{title}</h1>
            <Separator className="tw-my-5 sm:tw-my-3" />
          </Fragment>
        )}
        {children}
        {blogMetadata && <BlogPostFooter blogMetadata={blogMetadata} title={title} />}
      </Body>
      <Separator size={8} />

      <Footer />
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`twc-max-w-base tw-w-full tw-py-4 tw-px-6 tw-mx-auto tw-relative`;

const Header = safeRender(function Header({ locales }): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const [fixedHeader, setFixedHeader] = useState(false);
  const headerRef = useRef(null);

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
      <header className="root tw-fixed tw-w-full tw-left-0 tw-top-0 tw-z-30 twc-bg-secondary dark:tw-bg-black tw-shadow-md">
        <section className="tw-p-4 tw-flex twc-max-w-base tw-mx-auto tw-items-center">
          <Link
            is={NextLink}
            href={Routes.HOME}
            className="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-border-2 sm:tw-border-4 tw-border-blue-500 dark:twc-border-color-primary tw-bg-blue-200 dark:tw-bg-gray-300 tw-mr-4 tw-rounded-lg tw-text-xl"
            styled={false}
            role="button"
            aria-label="Go to home page"
          >
            <Emoji>👨‍💻</Emoji>
          </Link>
          <h1 className="tw-text-2xl sm:tw-text-4xl tw-pr-10 tw-flex-1  tw-font-bold">
            Diego Rayo
          </h1>
          <section className="tw-flex tw-flex-col tw-items-end">
            <DarkModeToggle />
          </section>
        </section>

        <style jsx>{`
          :global(.tw-dark) .root :global(.dark-mode-button) {
            @apply value:dark:twc-bg-secondary;
          }
        `}</style>
      </header>
    );
  }

  return (
    <header
      className="twc-border-color-primary tw-border-b tw-pb-4 tw-flex"
      ref={headerRef}
    >
      <Link
        is={NextLink}
        href={Routes.HOME}
        className="tw-flex tw-items-center tw-justify-center tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 dark:twc-border-color-primary tw-bg-blue-200 dark:tw-bg-gray-300 tw-mr-4 tw-rounded-lg tw-text-2xl tw-relative tw-top-1"
        styled={false}
        role="button"
        aria-label="Go to home page"
      >
        <Emoji>👨‍💻</Emoji>
      </Link>
      <section className="tw-flex-1">
        <h1 className="tw-text-2xl sm:tw-text-4xl tw-pr-10 tw-font-bold">Diego Rayo</h1>
        <p className="tw-text-sm sm:tw-text-base">
          {SiteTexts.layout.current_locale.header.job_title}
        </p>
      </section>
      <section className="tw-flex tw-flex-shrink-0 tw-h-full tw-relative tw-flex-col tw-justify-between tw-items-end tw-ml-2">
        <DarkModeToggle />
        <Separator size={2} />
        <LocalesSelector locales={locales} currentLocale={currentLocale} />
      </section>
    </header>
  );
});

function DarkModeToggle(): any {
  const { theme, setTheme } = useTheme();
  const { HeaderAssets } = useAssets();

  const isDarkMode = theme === "dark";

  return (
    <button
      className="dark-mode-button tw-flex tw-h-6 tw-w-12 tw-relative tw-rounded-xl tw-shadow-md tw-bg-black"
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

function LocalesSelector({ locales, currentLocale }): any {
  if (!locales) return null;

  return (
    <section className="tw-border tw-py-1 tw-px-2 tw-text-sm twc-border-color-primary dark:twc-border-color-primary">
      {locales.map((locale, index) => {
        return (
          <Fragment key={`LocaleToggle-${locale.name}`}>
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
    </section>
  );
}

const Body = twcss.section``;

function BlogPostFooter({ blogMetadata, title }: Record<string, any>): any {
  const { BlogPostAssets } = useAssets();
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const [showGoToTopButton, setShowGoToTopButton] = useState(false);

  useDidMount(() => {
    onScrollStoppedListener({
      onScroll: () => {
        if (getScrollPosition() > 0) {
          setShowGoToTopButton(true);
        } else {
          setShowGoToTopButton(false);
        }
      },
      onScrollStopped: () => {
        setShowGoToTopButton(false);
      },
      timeout: 3000,
    });
  });

  function generateBlogPostRawContentLink() {
    return GITHUB.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", currentLocale)
      .replace("FILE_NAME", `${blogMetadata.createdAt}-${blogMetadata.slug}`);
  }

  return (
    <Fragment>
      <Separator size={8} />

      {/*
      <section className="tw-mb-4 tw-flex-1 tw-flex tw-items-center tw-text-sm">
        <p className="tw-mr-4 tw-italic">
          {SiteTexts.page.current_locale.like_blog_post}
        </p>
        <button
          className="tw-border twc-border-color-primary dark:twc-border-color-primary twc-bg-secondary dark:twc-bg-secondary tw-flex tw-items-center tw-flex-shrink-0 tw-rounded-md tw-text-sm"
          onClick={() => {
            alert("En progreso...");
          }}
        >
          <Emoji className="tw-px-2">👍</Emoji>
          <section className="tw-border-l twc-border-color-primary dark:twc-border-color-primary tw-flex tw-items-center tw-px-2 tw-py-1 tw-h-full">
            <span className="tw-relative tw--top-2px tw-font-bold">0</span>
          </section>
        </button>
      </section>
      */}

      <section className="twc-border-color-primary tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-border tw-p-4">
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src={BlogPostAssets.CALENDAR}
              alt="Calendar icon"
              tw-variant="withoutDarkMode"
            />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{formatDate(blogMetadata.publishedAt)}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src={BlogPostAssets.UPDATED}
              alt="Document updated icon"
            />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>
              {getDifferenceBetweenDates(blogMetadata.updatedAt, new Date())}
            </strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon src={BlogPostAssets.PERSON} alt="Person icon" />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.created_by}</span>
            <Link href={WEBSITE_METADATA.social.twitter}>{blogMetadata.author}</Link>
          </BlogPostFooterItem>
        </section>
        <Separator
          size={4}
          className="tw-w-full tw-border-t twc-border-color-primary dark:twc-border-color-primary tw-block sm:tw-hidden"
        />
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start sm:tw-items-end tw-justify-center tw-flex-col">
          <BlogPostFooterItem
            is={Link}
            href={`https://twitter.com/intent/tweet?${createQueryFromObject({
              text: title,
              url: `${WEBSITE_METADATA.url}${Routes.BLOG_POSTS[blogMetadata.slug]}`,
              via: WEBSITE_METADATA.username,
            })}`}
            styled={false}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon src={BlogPostAssets.TWITTER} alt="Twitter icon" />
            <span>{SiteTexts.page.current_locale.share_blog_post_twitter}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is="button"
            className="clipboard"
            tw-variant="withHover"
            data-clipboard-text={`${title} - ${WEBSITE_METADATA.url}${
              Routes.BLOG_POSTS[blogMetadata.slug]
            } via @${WEBSITE_METADATA.username}`}
            onClick={copyToClipboard}
          >
            <BlogPostFooterItem.Icon src={BlogPostAssets.LINK} alt="Link icon" />
            <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is={Link}
            href={generateBlogPostRawContentLink()}
            styled={false}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon
              src={BlogPostAssets.SOURCE_CODE}
              alt="Source code icon"
            />
            <span>{SiteTexts.page.current_locale.see_publication_source_code}</span>
          </BlogPostFooterItem>
        </section>
      </section>
      {showGoToTopButton && (
        <button
          className="tw-fixed tw-bg-black tw-opacity-50 tw-text-2xl tw-bottom-2 tw-right-2 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-transition-opacity hover:tw-opacity-75"
          onClick={() => {
            setScrollPosition(0);
          }}
        >
          ↑
        </button>
      )}
    </Fragment>
  );
}

const BlogPostFooterItem = twcss.section({
  __base: `tw-flex tw-items-center tw-justify-start tw-my-1 tw-text-sm tw-text-left`,
  withHover: "tw-transition-opacity hover:tw-opacity-75",
});

BlogPostFooterItem.Icon = twcss(Image)(
  {
    __base: "tw-inline-block tw-h-4 tw-w-4 tw-mr-2",
    withDarkMode: "dark:tw-rounded-md dark:twc-bg-secondary dark:tw-p-1",
    withoutDarkMode: "",
  },
  {
    "tw-variant": "withDarkMode",
  },
);

function Footer() {
  return (
    <footer className="twc-border-color-primary tw-border-t tw-pt-4 tw-text-center">
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
    <section>
      {SOCIAL_NETWORKS.map(item => {
        return <SocialIcon key={item.name} {...item} />;
      })}
    </section>
  );
}

function SocialIcon({ icon, url, name }: Record<string, any>): any {
  return (
    <Link
      href={url}
      className="tw-inline-block dark:twc-bg-secondary tw-p-1 dark:tw-rounded-md tw-mx-1 tw-my-1 sm:tw-my-0 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
      styled={false}
    >
      <Image src={icon} alt={`${name} icon`} className="tw-h-5 tw-w-5" />
    </Link>
  );
}
