import React, { Fragment } from "react";
import Head from "next/head";

import { SEO_METADATA, WEBSITE_METADATA } from "~/data/metadata";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { trackPageLoaded } from "~/utils/analytics";
import { isDevelopmentEnvironment, isUserLoggedIn } from "~/utils/misc";

function Page({ children, metadata: metadataProp = {} }: Record<string, any>): any {
  const metadata = {
    ...SEO_METADATA,
    ...metadataProp,
    title: metadataProp.title
      ? `${metadataProp.title} - ${SEO_METADATA.title}`
      : SEO_METADATA.title,
    url: metadataProp.url ? `${SEO_METADATA.url}${metadataProp.url}` : SEO_METADATA.url,
  };

  useDocumentTitle(metadata.title);

  useDidMount(() => {
    trackPageLoaded();
  });

  return (
    <Fragment>
      <Head>
        <title>{metadata.title}</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1, maximum-scale=1"
        />
        {metadata.noRobots ? (
          <Fragment>
            <meta name="googlebot" content="noindex,nofollow" />
            <meta name="robots" content="noindex,nofollow" />
          </Fragment>
        ) : (
          <Fragment>
            <meta name="robots" content="index,follow" />
            <meta name="google" content="notranslate" />
          </Fragment>
        )}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:site_name" content={metadata.title} />

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href={SEO_METADATA.url} />
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
            isDevelopmentEnvironment() ? "-dev" : ""
          }.ico?v=1`}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS Feed for ${WEBSITE_METADATA.urlProd.replace("https://", "")}`}
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+atom"
          title={`Atom Feed for ${WEBSITE_METADATA.urlProd.replace("https://", "")}`}
          href="/atom.xml"
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
        <script type="application/ld+json">
          {`
            "@context": "http://schema.org",
            "@type": "Person",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Armenia",
              "addressRegion": "Quindío"
            },
            "email": "mailto:${WEBSITE_METADATA.email}",
            "jobTitle": "${WEBSITE_METADATA.jobTitle}",
            "name": "${WEBSITE_METADATA.fullName}",
            "url": "${WEBSITE_METADATA.url}",
            "sameAs": [
              "${WEBSITE_METADATA.social.github}",
              "${WEBSITE_METADATA.social.twitter}",
              "${WEBSITE_METADATA.social.linkedin}",
            ]
          `}
        </script>
      </Head>
      {children}
      {isUserLoggedIn() && (
        <span className="tw-absolute tw-top-1 tw-left-1 tw-w-1 tw-h-1 tw-bg-black dark:tw-bg-white" />
      )}
    </Fragment>
  );
}

export default Page;
