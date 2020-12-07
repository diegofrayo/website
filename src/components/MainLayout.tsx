import React, { Fragment } from "react";
import Link from "next/link";

import { getSiteTexts } from "~/i18n";
import twcss from "~/lib/twcss";
import { DEFAULT_LOCALE, Routes } from "~/utils/constants";

import Breadcumb from "./Breadcumb";
import { Separator } from "./";

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
            {blogMetadata && (
              <section className="tw-flex tw-flex-wrap tw-mt-1">
                <BlogMetadataItem className="tw-bg-gray-100 tw-mr-2">
                  🗓️ {blogMetadata.created_at}
                </BlogMetadataItem>
                <BlogMetadataItem className="tw-bg-green-100 tw-mr-2">
                  👨‍🏫 {blogMetadata.author}
                </BlogMetadataItem>
                <BlogMetadataItem
                  is="a"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://raw.githubusercontent.com/diegofrayo/website/master/src/data/blog/posts/${DEFAULT_LOCALE}/${blogMetadata.sourceURL}.mdx`}
                  className="tw-border tw-border-gray-200"
                >
                  <img
                    src="/static/images/icons/source-code.svg"
                    alt="Source code icon"
                    className="tw-inline-block tw-h-4 tw-w-4"
                  />
                </BlogMetadataItem>
              </section>
            )}
            <Separator size={3} />
          </Fragment>
        )}
        {children}
      </section>
    </Main>
  );
}

export default MainLayout;

// --- Components ---

const Main = twcss.main`tw-w-full tw-max-w-screen-md tw-p-6 tw-mx-auto`;

function Header() {
  const SiteTexts = getSiteTexts({ layout: true });

  return (
    <header className="tw-flex tw-border-b tw-border-gray-200 tw-pb-3 tw-relative">
      <Link href={Routes.HOME}>
        <a className="tw-flex tw-items-center tw-justify-center tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-2 sm:tw-border-4 tw-border-blue-500 tw-bg-blue-200 tw-mr-4 tw-rounded-lg tw-text-2xl sm:tw-text-2xl">
          👨‍💻
        </a>
      </Link>
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

const BlogMetadataItem = twcss.span`tw-inline-flex tw-items-center tw-justify-center tw-py-1 tw-px-1 tw-my-1 tw-rounded-md tw-font-bold tw-text-sm tw-h-7`;
