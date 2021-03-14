import React, { Fragment } from "react";
import Head from "next/head";

import { SEO_METADATA, WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { TypeGetAssetsParam } from "~/types";
import { trackPageLoaded } from "~/utils/analytics";
import { getAssets } from "~/utils/assets";
import { isDevelopmentEnvironment, isUserLoggedIn } from "~/utils/misc";

type TypePageProps = {
  children: any;
  config: {
    title?: string;
    pathname?: string;
    description?: string;
    noRobots?: boolean;
    assets?: TypeGetAssetsParam;
  };
};

function Page({ children, config = {} }: TypePageProps): any {
  const metadata = {
    title: config.title ? `${config.title} - ${SEO_METADATA.title}` : SEO_METADATA.title,
    url: config.pathname ? `${SEO_METADATA.url}${config.pathname}` : SEO_METADATA.url,
    description: config.description || "",
  };

  useDocumentTitle(metadata.title);

  useDidMount(() => {
    trackPageLoaded();
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

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          `,
          }}
        />
        {(config.pathname === Routes.HOME ||
          config.pathname === Routes.RESUME ||
          config.pathname === Routes.ABOUT_ME) && (
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
                  WEBSITE_METADATA.social.twitter,
                  WEBSITE_METADATA.social.linkedin,
                ],
              }),
            }}
          />
        )}
      </Head>
      {children}
      {isUserLoggedIn() && (
        <span className="tw-absolute tw-top-1 tw-left-1 tw-w-1 tw-h-1 tw-bg-black dark:tw-bg-white" />
      )}
      <script
        type="application/json"
        id="assets"
        dangerouslySetInnerHTML={{
          __html: getAssets(["header", "footer", ...(config.assets || [])]),
        }}
      />
    </Fragment>
  );
}

export default Page;
