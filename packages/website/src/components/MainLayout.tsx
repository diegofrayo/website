import React, { Fragment, useState } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import classnames from "classnames";

import GITHUB from "~/data/github.json";
import { WEBSITE_METADATA } from "~/data/metadata";
import { useDidMount } from "~/hooks";
import { safeRender } from "~/hocs";
import twcss from "~/lib/twcss";
import { CURRENT_LOCALE, Routes } from "~/utils/constants";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { getSiteTexts } from "~/utils/i18n";
import {
  copyToClipboard,
  createQueryFromObject,
  getScroll,
  onScrollStoppedListener,
  setScroll,
} from "~/utils/misc";

import Breadcumb from "./Breadcumb";
import { Link, Separator, Emoji } from "./";

const SiteTexts = getSiteTexts({ layout: true, page: Routes.BLOG() });

function MainLayout({
  children,
  breadcumb,
  title,
  blogMetadata,
}: Record<string, any>): any {
  return (
    <Main>
      <Header />
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

const Main = twcss.main`twc-max-w-base tw-w-full tw-py-4 tw-px-6 tw-mx-auto`;

const Header = safeRender(function Header(): any {
  return (
    <header className="twc-border-color-primary tw-border-b tw-pb-4 tw-flex tw-relative">
      <NextLink href={Routes.HOME}>
        <a className="tw-flex tw-items-center tw-justify-center tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 dark:twc-border-color-primary tw-bg-blue-200 dark:tw-bg-gray-300 tw-mr-4 tw-rounded-lg tw-text-2xl tw-relative tw-top-1 tw-transition-opacity hover:tw-opacity-75">
          <Emoji>👨‍💻</Emoji>
        </a>
      </NextLink>
      <section className="tw-flex-1">
        <h1 className="tw-text-2xl sm:tw-text-4xl tw-pr-10">
          <strong>Diego Rayo</strong>
        </h1>
        <section className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center">
          <p className="tw-text-sm sm:tw-text-base tw-inline-block tw-mr-2">
            {SiteTexts.layout.current_locale.header.job_title}
          </p>
        </section>
      </section>

      <span className="tw-absolute tw-top-1 tw-right-0">
        <DarkModeToggle />
      </span>
    </header>
  );
});

function DarkModeToggle(): any {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="tw-flex tw-h-6 tw-w-12 tw-relative tw-rounded-xl tw-shadow-md twc-bg-secondary dark:twc-bg-secondary"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      <span
        className={classnames(
          "tw-rounded-full tw-p-1 tw-w-7 tw-h-7 tw-absolute tw--top-0.5 tw-flex tw-items-center tw-justify-center tw-bg-black dark:tw-bg-white tw-shadow-md tw-border tw-border-black dark:tw-border-white",
          theme === "dark" ? "tw--left-0.5" : "tw--right-0.5",
        )}
      >
        <img
          src={`/static/images/icons/${theme === "light" ? "sun" : "moon"}.svg`}
          alt="Switch mode icon"
          className="tw-h-3 tw-w-3"
        />
      </span>
    </button>
  );
}

const Body = twcss.section``;

function BlogPostFooter({ blogMetadata, title }: Record<string, any>): any {
  const [showGoToTopButton, setShowGoToTopButton] = useState(false);

  useDidMount(() => {
    onScrollStoppedListener({
      onScroll: () => {
        if (getScroll() > 0) {
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

  function generateBlogPostRawContent() {
    return GITHUB.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", CURRENT_LOCALE)
      .replace("FILE_NAME", `${blogMetadata.published_at}-${blogMetadata.slug}`);
  }

  return (
    <Fragment>
      <Separator size={8} />
      <section className="twc-border-color-primary tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-border tw-p-4">
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/calendar.svg"
              alt="Calendar icon"
              tw-variant="withoutDarkMode"
            />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{blogMetadata.publishedAt.replace(/-+/g, "/")}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/updated.svg"
              alt="Document updated icon"
            />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>
              {getDifferenceBetweenDates(blogMetadata.updatedAt, new Date())}
            </strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/person.svg"
              alt="Person icon"
            />
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
              url: `${WEBSITE_METADATA.url}${Routes.BLOG(blogMetadata.slug)}`,
              via: WEBSITE_METADATA.username,
            })}`}
            styled={false}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/twitter.svg"
              alt="Twitter icon"
            />
            <span>{SiteTexts.page.current_locale.share_blog_post_twitter}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is="button"
            className="clipboard"
            tw-variant="withHover"
            data-clipboard-text={`${title} - ${WEBSITE_METADATA.url}${Routes.BLOG(
              blogMetadata.slug,
            )} via @${WEBSITE_METADATA.username}`}
            onClick={copyToClipboard}
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/link.svg"
              alt="Link icon"
            />
            <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is={Link}
            href={generateBlogPostRawContent()}
            styled={false}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/source-code.svg"
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
            setScroll(0);
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

BlogPostFooterItem.Icon = twcss.img(
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
  const SOCIAL_NETWORKS = [
    { icon: "github", url: WEBSITE_METADATA.social.github },
    { icon: "twitter-colorful", url: WEBSITE_METADATA.social.twitter },
    {
      icon: "linkedin-colorful",
      url: WEBSITE_METADATA.social.linkedin,
    },
    {
      icon: "email-colorful",
      url: `mailto:${WEBSITE_METADATA.email}`,
    },
    {
      icon: "spotify-colorful",
      url: WEBSITE_METADATA.social.spotify,
    },
    {
      icon: "500px",
      url: WEBSITE_METADATA.social["500px"],
    },
  ];

  return (
    <section>
      {SOCIAL_NETWORKS.map(item => {
        return <SocialIcon key={item.icon} {...item} />;
      })}
    </section>
  );
}

function SocialIcon({ icon, url }: Record<string, any>): any {
  return (
    <Link
      href={url}
      className="tw-inline-block dark:twc-bg-secondary tw-p-1 dark:tw-rounded-md tw-mx-1 tw-my-1 sm:tw-my-0 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
      styled={false}
    >
      <img
        src={`/static/images/icons/${icon}.svg`}
        alt={`${icon} icon`}
        className="tw-h-5 tw-w-5"
      />
    </Link>
  );
}
