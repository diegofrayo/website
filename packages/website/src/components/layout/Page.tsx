import React, { Fragment } from "react";
import Head from "next/head";

import { useDidMount, useDocumentTitle } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import { T_GetAssetsParam, T_ReactChildrenProp, T_ReactElement } from "~/types";
import { getAssetsURL } from "~/utils/assets";
import { WEBSITE_METADATA, SEO_METADATA } from "~/utils/constants";
import { isDevelopmentEnvironment, isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { removeEmojiFromString } from "~/utils/strings";

import WindowSize from "./WindowSize";

type T_PageProps = {
  children: T_ReactChildrenProp;
  config: {
    title?: string;
    pathname?: string;
    description?: string;
    noRobots?: boolean;
    assets?: T_GetAssetsParam;
  };
};

function Page({ children, config = {} }: T_PageProps): T_ReactElement {
  const metadata = {
    title: removeEmojiFromString(
      config.title ? `${config.title} - ${SEO_METADATA.title}` : SEO_METADATA.title,
    ),
    url: config.pathname ? `${SEO_METADATA.url}${config.pathname}` : SEO_METADATA.url,
    description: config.description || "",
  };

  useDocumentTitle(metadata.title);

  useDidMount(() => {
    AnalyticsService.trackPageLoaded();
  });

  return (
    <Fragment>
      <Head>
        <title>{metadata.title}</title>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no"
        />
        <meta
          name="google-site-verification"
          content="Gf-6mROjwXEjbtUUtl2rX5NgzWuzWxgxoKYTaGsqvtw"
        />
        {config.noRobots && <meta name="robots" content="noindex,nofollow" />}
        <meta name="description" content={metadata.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:site_name" content={SEO_METADATA.title} />

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href={metadata.url} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/images/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          href={`/static/images/favicon/favicon${
            isDevelopmentEnvironment(WEBSITE_METADATA.url) ? "-dev" : ""
          }.ico?v=1`}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS Feed for ${WEBSITE_METADATA.url.replace("https://", "")}`}
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+atom"
          title={`Atom Feed for ${WEBSITE_METADATA.url.replace("https://", "")}`}
          href="/atom.xml"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;600&display=swap"
          rel="stylesheet"
        />

        {(config.pathname === ROUTES.HOME ||
          config.pathname === ROUTES.RESUME ||
          config.pathname === ROUTES.ABOUT_ME) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "Person",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Armenia",
                  addressRegion: "Quindío",
                },
                email: `mailto:${WEBSITE_METADATA.email}`,
                jobTitle: WEBSITE_METADATA.jobTitle,
                name: WEBSITE_METADATA.fullName,
                url: WEBSITE_METADATA.url,
                sameAs: [
                  WEBSITE_METADATA.social.github,
                  // WEBSITE_METADATA.social.linkedin
                ],
              }),
            }}
          />
        )}
      </Head>
      {children}
      {isUserLoggedIn() && (
        <span className="tw-fixed tw-top-1 tw-left-1 tw-z-50 tw-w-1 tw-h-1 tw-bg-black dark:tw-bg-white" />
      )}
      {isDevelopmentEnvironment() && <WindowSize />}
      <script
        type="application/json"
        id="assets"
        dangerouslySetInnerHTML={{
          __html: getAssetsURL([...(config.assets || [])]),
        }}
      />
    </Fragment>
  );
}

export default Page;
