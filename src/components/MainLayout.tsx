import React, { Fragment } from "react";
import NextLink from "next/link";
import ClipboardJS from "clipboard";

import { useDidMount } from "~/hooks";
import { getSiteTexts } from "~/i18n";
import twcss from "~/lib/twcss";
import { DEFAULT_LOCALE, Routes } from "~/utils/constants";
import { createQueryFromObject } from "~/utils/misc";

import Breadcumb from "./Breadcumb";
import { Separator } from "./";

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
      <section>
        {breadcumb && <Breadcumb items={breadcumb} />}
        <Separator size={4} />
        {title && (
          <Fragment>
            <h1 className="tw-text-left tw-text-3xl tw-font-bold">{title}</h1>
            <Separator size={3} />
          </Fragment>
        )}
        {children}
        <BlogPostFooter blogMetadata={blogMetadata} title={title} />
      </section>
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`tw-w-full tw-max-w-screen-md tw-p-6 tw-mx-auto`;

function Header() {
  return (
    <header className="tw-flex tw-border-b tw-border-gray-200 tw-pb-3 tw-relative">
      <NextLink href={Routes.HOME}>
        <a className="tw-flex tw-items-center tw-justify-center tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 tw-bg-blue-200 tw-mr-4 tw-rounded-lg tw-text-2xl sm:tw-text-2xl">
          👨‍💻
        </a>
      </NextLink>
      <section className="tw-flex-1">
        <h1 className="tw-text-2xl sm:tw-text-4xl">
          <strong>Diego Rayo</strong>
        </h1>
        <section className="tw-flex tw-flex-wrap tw-items-center">
          <p className="tw-text-sm sm:tw-text-base tw-inline-block tw-mr-2">
            {SiteTexts.layout.header.job_title}
          </p>
          <SocialIcons />
        </section>
      </section>

      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/diegofrayo/website"
        className="tw-inline-block tw-top-0 tw-right-0 tw-absolute hover:tw-top-1px tw-transition-all"
      >
        <img
          src="/static/images/icons/source-code.svg"
          alt="Source code icon"
          className="tw-h-6 sm:tw-h-8 tw-w-6 sm:tw-w-8"
        />
      </a>
    </header>
  );
}

function SocialIcons() {
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

function SocialIcon({ icon, url }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={url}
      className="tw-inline-block tw-bg-gray-100 hover:tw-bg-gray-200 tw-p-1 tw-border tw-border-gray-200 tw-transition-all tw-rounded-full tw-mr-2 tw-mb-1 sm:tw-mb-0 tw-relative hover:tw-top-1px"
    >
      <img
        src={`/static/images/icons/${icon}.svg`}
        alt={`${icon} icon`}
        className="tw-h-4 tw-w-4"
      />
    </a>
  );
}

function BlogPostFooter({ blogMetadata, title }) {
  useDidMount(() => {
    if (!blogMetadata) return;
    new ClipboardJS(".clipboard");
  });

  if (!blogMetadata) return null;

  return (
    <Fragment>
      <Separator size={8} />
      <section className="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-border tw-border-gray-200 tw-p-4">
        <section className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <p className="tw-flex tw-items-center tw-justify-start tw-my-1 tw-text-sm">
            <img
              src="/static/images/icons/calendar.svg"
              alt="Calendar icon"
              className="tw-inline-block tw-h-4 tw-w-4 tw-mr-2"
            />
            <span className="tw-mr-1">{SiteTexts.page.published_at}</span>
            <strong>{blogMetadata.publishedAt.replace(/-+/g, "/")}</strong>
          </p>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://raw.githubusercontent.com/diegofrayo/website/master/src/data/blog/posts/${DEFAULT_LOCALE}/${
              blogMetadata.publishedAt + "-" + blogMetadata.slug
            }.mdx`}
            className="tw-flex tw-items-center tw-justify-start tw-my-1 tw-text-sm tw-transition-opacity hover:tw-opacity-75"
          >
            <img
              src="/static/images/icons/source-code.svg"
              alt="Source code icon"
              className="tw-inline-block tw-h-4 tw-w-4 tw-mr-2"
            />
            <span>{SiteTexts.page.see_publication_source_code}</span>
          </a>
        </section>
        <Separator
          size={5}
          className="tw-w-full tw-border-t tw-border-gray-200 tw-block sm:tw-hidden"
        />
        <section className="tw-w-full sm:tw-w-1/2">
          <h3 className="tw-mb-3">{SiteTexts.page.share_blog_post}</h3>
          <a
            href={`https://twitter.com/intent/tweet?${createQueryFromObject({
              text: title,
              url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${Routes.BLOG(
                blogMetadata.slug,
              )}`,
              via: blogMetadata.author.substring(1),
            })}`}
            className="tw-inline-flex tw-items-center tw-flex-no-wrap tw-mr-6 tw-transition-opacity hover:tw-opacity-75"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/static/images/icons/twitter.svg"
              alt="Twitter icon"
              className="tw-inline-block tw-h-4 tw-w-4 tw-mr-2 sm:tw-mr-1"
            />
            <span className="tw-text-sm tw-text-left">Twitter</span>
          </a>
          <button
            data-clipboard-text={`${title} - ${
              process.env.NEXT_PUBLIC_WEBSITE_URL
            }${Routes.BLOG(blogMetadata.slug)} via @diegofrayo`}
            className="clipboard tw-inline-flex tw-items-center tw-flex-no-wrap tw-transition-opacity hover:tw-opacity-75"
          >
            <img
              src="/static/images/icons/link.svg"
              alt="Link icon"
              className="tw-inline-block tw-h-4 tw-w-4 tw-mr-2 sm:tw-mr-1"
            />
            <span className="tw-text-sm tw-text-left">
              {SiteTexts.page.copy_url_to_clipboard}
            </span>
          </button>
        </section>
      </section>
    </Fragment>
  );
}
