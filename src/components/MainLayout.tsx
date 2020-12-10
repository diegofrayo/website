import React, { Fragment, useState } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";

import { useDidMount } from "~/hooks";
import { getSiteTexts } from "~/i18n";
import twcss from "~/lib/twcss";
import { DEFAULT_LOCALE, Routes } from "~/utils/constants";
import { getDifferenceBetweenDates } from "~/utils/dates";
import {
  copyToClipboard,
  createQueryFromObject,
  getScroll,
  onScrollStoppedListener,
  setScroll,
} from "~/utils/misc";

import Breadcumb from "./Breadcumb";
import { Link, Separator } from "./";

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
      <section className="tw-relative">
        {breadcumb && <Breadcumb items={breadcumb} />}
        <Separator size={4} />
        {title && (
          <Fragment>
            <h1 className="tw-text-left tw-text-3xl tw-font-bold">{title}</h1>
            <Separator size={3} />
          </Fragment>
        )}
        {children}
        {blogMetadata && <BlogPostFooter blogMetadata={blogMetadata} title={title} />}
      </section>
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`tw-w-full tw-max-w-screen-md tw-p-6 tw-mx-auto dark:tw-bg-black dark:bg-black`;

function Header(): any {
  const { theme, setTheme } = useTheme();

  return (
    <header className="tw-flex tw-border-b tw-border-gray-200 tw-pb-3 tw-relative">
      <NextLink href={Routes.HOME}>
        <a className="tw-flex tw-items-center tw-justify-center tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 tw-bg-blue-200 tw-mr-4 tw-rounded-lg tw-text-2xl sm:tw-text-2xl tw-relative tw-top-1">
          👨‍💻
        </a>
      </NextLink>
      <section className="tw-flex-1">
        <h1 className="tw-text-2xl sm:tw-text-4xl tw-pr-10">
          <strong>Diego Rayo</strong>
        </h1>
        <section className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center">
          <p className="tw-text-sm sm:tw-text-base tw-inline-block tw-mr-2">
            {SiteTexts.layout.header.job_title}
          </p>
          <SocialIcons />
        </section>
      </section>

      <button
        className="tw-flex tw-items-center tw-p-1 tw-absolute tw-top-1 tw-right-1"
        onClick={() => {
          const newTheme = theme === "dark" ? "light" : "dark";
          setTheme(newTheme);
          alert(`${newTheme}-mode selected`);
        }}
      >
        {theme === "dark" ? (
          <img
            src="/static/images/icons/sun.svg"
            alt="Sun icon"
            className="tw-h-4 tw-w-4 tw-inline-block"
          />
        ) : (
          <img
            src="/static/images/icons/moon.svg"
            alt="Moon icon"
            className="tw-h-4 tw-w-4 tw-inline-block"
          />
        )}
      </button>

      <a
        href="https://github.com/diegofrayo/website"
        target="_blank"
        rel="noreferrer"
        className="tw-inline-block tw-bottom-1 tw-right-1 tw-absolute tw-p-1"
      >
        <img
          src="/static/images/icons/source-code.svg"
          alt="Source code icon"
          className="tw-h-4 tw-w-4"
        />
      </a>
    </header>
  );
}

function SocialIcons(): any {
  const SOCIAL_NETWORKS = [
    { icon: "github", url: "https://github.com/diegofrayo" },
    { icon: "twitter", url: "https://twitter.com/diegofrayo" },
    {
      icon: "linkedin",
      url: "https://www.linkedin.com/in/diegofrayo",
    },
    {
      icon: "500px",
      url: "https://500px.com/p/diegofrayo?view=photos",
    },
  ];

  return (
    <section className="tw-inline-flex tw-items-center tw-my-1 tw-flex-wrap">
      {SOCIAL_NETWORKS.map(item => {
        return <SocialIcon key={item.icon} {...item} />;
      })}
    </section>
  );
}

function SocialIcon({ icon, url }: Record<string, any>): any {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={url}
      className="tw-inline-block tw-bg-gray-100 hover:tw-bg-gray-200 tw-p-1 tw-border tw-border-gray-200 tw-transition-all tw-rounded-full tw-mr-2 tw-mb-1 sm:tw-mb-0"
    >
      <img
        src={`/static/images/icons/${icon}.svg`}
        alt={`${icon} icon`}
        className="tw-h-4 tw-w-4"
      />
    </a>
  );
}

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
        if (showGoToTopButton === false) return;
        setShowGoToTopButton(false);
      },
      timeout: 3000,
    });
  });

  return (
    <Fragment>
      <Separator size={8} />
      <section className="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-border tw-border-gray-200 tw-p-4">
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/calendar.svg"
              alt="Calendar icon"
            />
            <span className="tw-mr-1">{SiteTexts.page.published_at}</span>
            <strong>{blogMetadata.publishedAt.replace(/-+/g, "/")}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/updated.svg"
              alt="Document updated icon"
            />
            <span className="tw-mr-1">{SiteTexts.page.updated_at}</span>
            <strong>
              {getDifferenceBetweenDates(blogMetadata.updatedAt, new Date())}
            </strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src="/static/images/icons/person.svg"
              alt="Person icon"
            />
            <span className="tw-mr-1">{SiteTexts.page.created_by}</span>
            <Link href="https://twitter.com/diegofrayo">{blogMetadata.author}</Link>
          </BlogPostFooterItem>
        </section>
        <Separator
          size={4}
          className="tw-w-full tw-border-t tw-border-gray-200 tw-block sm:tw-hidden"
        />
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start sm:tw-items-end tw-justify-center tw-flex-col">
          <BlogPostFooterItem
            is="a"
            href={`https://twitter.com/intent/tweet?${createQueryFromObject({
              text: title,
              url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${Routes.BLOG(
                blogMetadata.slug,
              )}`,
              via: blogMetadata.author.substring(1),
            })}`}
            target="_blank"
            rel="noreferrer"
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/twitter.svg"
              alt="Twitter icon"
            />
            <span>{SiteTexts.page.share_blog_post_twitter}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is="button"
            className="clipboard"
            data-clipboard-text={`${title} - ${
              process.env.NEXT_PUBLIC_WEBSITE_URL
            }${Routes.BLOG(blogMetadata.slug)} via @diegofrayo`}
            onClick={copyToClipboard}
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/link.svg"
              alt="Link icon"
            />
            <span>{SiteTexts.page.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is="a"
            href={`https://raw.githubusercontent.com/diegofrayo/website/master/src/data/blog/posts/${DEFAULT_LOCALE}/${
              blogMetadata.publishedAt + "-" + blogMetadata.slug
            }.mdx`}
            target="_blank"
            rel="noreferrer"
          >
            <BlogPostFooterItem.Icon
              src="/static/images/icons/source-code.svg"
              alt="Source code icon"
            />
            <span>{SiteTexts.page.see_publication_source_code}</span>
          </BlogPostFooterItem>
        </section>
      </section>
      {showGoToTopButton && (
        <button
          className="tw-fixed tw-bg-black tw-opacity-50 tw-text-2xl tw-bottom-2 tw-right-2 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold"
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

const BlogPostFooterItem = twcss.p`tw-flex tw-items-center tw-justify-start tw-my-1 tw-text-sm tw-text-left`;

BlogPostFooterItem.Icon = twcss.img`tw-inline-block tw-h-4 tw-w-4 tw-mr-2`;
