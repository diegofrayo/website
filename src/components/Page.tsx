import React, { Fragment } from "react";
import Head from "next/head";

import { useDidMount, useDocumentTitle } from "~/hooks";
import { trackPageLoaded } from "~/utils/analytics";

function Page({ children, metadata: metadataProp = {} }: Record<string, any>): any {
  const DEFAULT_METADATA = {
    description:
      "Software Developer, I have over 5 years of experience developing Web Solutions. I work mainly with JavaScript, React, Next.js, Tailwind CSS, Node.js, and GraphQL.",
    title: "Diego Rayo | Software Developer",
    url: "https://diegofrayo.vercel.app",
  };
  const metadata = {
    ...DEFAULT_METADATA,
    ...metadataProp,
    url: metadataProp.url
      ? `${DEFAULT_METADATA.url}/${metadataProp.url}`
      : DEFAULT_METADATA.url,
    title: metadataProp.title
      ? `${metadataProp.title} - ${DEFAULT_METADATA.title}`
      : DEFAULT_METADATA.title,
    description: metadataProp.description || DEFAULT_METADATA.description,
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
        <meta name="robots" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:site_name" content={metadata.title} />

        <link rel="canonical" href="https://diegofrayo.vercel.app" />
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
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
    </Fragment>
  );
}

export default Page;
