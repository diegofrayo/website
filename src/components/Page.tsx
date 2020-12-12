import React, { Fragment } from "react";
import Head from "next/head";

import { useDidMount, useDocumentTitle } from "~/hooks";
import { isAnalyticsDisabled, trackPageLoaded } from "~/utils/analytics";
import { isDevelopmentEnvironment } from "~/utils/misc";

function Page({ children, metadata: metadataProp = {} }: Record<string, any>): any {
  const DEFAULT_METADATA = {
    title: "Diego Rayo | Software Developer",
    description:
      "Software Developer, I have over 5 years of experience developing Web Solutions. I usually work using JavaScript, React, Next.js, Tailwind CSS, Node.js, and GraphQL.",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
  };
  const metadata = {
    ...DEFAULT_METADATA,
    ...metadataProp,
    title: metadataProp.title
      ? `${metadataProp.title} - ${DEFAULT_METADATA.title}`
      : DEFAULT_METADATA.title,
    url: metadataProp.url
      ? `${DEFAULT_METADATA.url}${metadataProp.url}`
      : DEFAULT_METADATA.url,
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

        <link rel="canonical" href={DEFAULT_METADATA.url} />
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
        <link rel="manifest" href="/site.webmanifest" />

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
            "email": "mailto:diegofrayo@gmail.com",
            "jobTitle": "Software Developer",
            "name": "Diego Fernando Rayo Zamora",
            "url": "https://www.diegofrayo.vercel.app",
            "sameAs": [
              "https://www.github.com/diegofrayo",
              "https://www.twitter.com/diegofrayo",
              "https://www.linkedin.com/in/diegofrayo"
            ]
          `}
        </script>
      </Head>
      {children}
      {isAnalyticsDisabled && (
        <span className="tw-absolute tw-top-1 tw-left-1 tw-w-1 tw-h-1 tw-bg-black dark:tw-bg-white" />
      )}
    </Fragment>
  );
}

export default Page;
