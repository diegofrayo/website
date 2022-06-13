import * as React from "react";
import Head from "next/head";
import classNames from "classnames";
import Script from "next/script";

import { InlineText } from "~/components/primitive";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { withAuthenticationRequired } from "~/hocs";
import { I18nService, T_Locale } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import { useStoreSelector } from "~/state";
import {
  selectWebsiteMetadata,
  selectSEOMetadata,
  T_SEOMetadata,
  T_WebsiteMetadata,
} from "~/state/modules/metadata";
import { selectPageConfig, T_PageConfig } from "~/state/modules/page-config";
import { isDevelopmentEnvironment } from "~/utils/app";
import { ROUTES, T_RoutesValues } from "~/utils/routing";
import type {
  T_ReactChildren,
  T_ReactElement,
  T_ReactElementNullable,
  T_UnknownObject,
} from "~/types";
import { isNotEmptyString } from "~/utils/validations";

type T_PageProps = {
  children: T_ReactChildren;
  config: {
    title?: string;
    replaceTitle?: boolean;
    pathname?: string;
    description?: string;
    image?: string;
    disableSEO?: boolean;
    scripts?: { element: "link"; props: T_UnknownObject }[];
  };
};

function Page({ children, config = {} }: T_PageProps): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
  const SEO_METADATA = useStoreSelector<T_SEOMetadata>(selectSEOMetadata);
  const { locales } = useStoreSelector<T_PageConfig>(selectPageConfig);

  const metadata = {
    title: isNotEmptyString(config.title)
      ? `${config.title}${config.replaceTitle ? "" : ` - ${SEO_METADATA.title}`}`
      : SEO_METADATA.title,
    url: `${WEBSITE_METADATA.url}${config.pathname || ""}`,
    description: config.description || SEO_METADATA.description,
    image: config.image || "",
  };

  useDocumentTitle(metadata.title);

  useDidMount(() => {
    AnalyticsService.trackPageLoaded();
  });

  return (
    <React.Fragment>
      <Head>
        <title>{metadata.title}</title>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black"
        />
        <meta
          name="google-site-verification"
          content="Gf-6mROjwXEjbtUUtl2rX5NgzWuzWxgxoKYTaGsqvtw"
        />
        {config.disableSEO && (
          <meta
            name="robots"
            content="noindex,nofollow"
          />
        )}
        <meta
          name="description"
          content={metadata.description}
        />
        <meta
          property="og:type"
          content="article"
        />
        <meta
          property="og:title"
          content={metadata.title}
        />
        <meta
          property="og:description"
          content={metadata.description}
        />
        <meta
          property="og:url"
          content={metadata.url}
        />
        {metadata.image && (
          <meta
            property="og:image"
            content={metadata.image}
          />
        )}
        <meta
          property="og:site_name"
          content={SEO_METADATA.title}
        />

        {config.scripts?.map((script, index) => {
          const Tag = script.element;
          return (
            <Tag
              key={`Page-script-${index}`}
              {...script.props}
            />
          );
        })}
        {locales.map((locale: T_Locale) => {
          if (locale === I18nService.getDefaultLocale()) {
            return (
              <link
                key={locale}
                rel="alternate"
                hrefLang="x-default"
                href={metadata.url}
              />
            );
          }

          return (
            <link
              key={locale}
              rel="alternate"
              hrefLang={locale}
              href={`${WEBSITE_METADATA.url}/${locale}${config.pathname}`}
            />
          );
        })}
        <link
          rel="manifest"
          href="/site.webmanifest"
        />
        <link
          rel="canonical"
          href={metadata.url}
        />
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
          href={`/static/images/favicon/favicon${isDevelopmentEnvironment() ? "-dev" : ""}.ico?v=3`}
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

        {[ROUTES.HOME, ROUTES.ABOUT_ME, ROUTES.RESUME].includes(
          config.pathname as T_RoutesValues,
        ) ? (
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "Person",
                name: WEBSITE_METADATA.fullName,
                email: WEBSITE_METADATA.email,
                jobTitle: WEBSITE_METADATA.jobTitle,
                url: WEBSITE_METADATA.url,
                address: WEBSITE_METADATA.address,
                sameAs: [WEBSITE_METADATA.social.github, WEBSITE_METADATA.social.linkedin],
              }),
            }}
          />
        ) : null}
      </Head>
      {children}

      <UserLoggedInFlag />
      <AnalyticsDisabledFlag />
    </React.Fragment>
  );
}

export default Page;

// --- Components ---

const UserLoggedInFlag = withAuthenticationRequired(function UserLoggedInFlag(): T_ReactElement {
  return (
    <Flag
      className="tw-z-50"
      color="dfr-bg-color-dark-strong dark:dfr-bg-color-light-strong"
    />
  );
});

function AnalyticsDisabledFlag(): T_ReactElementNullable {
  // hooks
  const [isAnalyticsDisabled, setIsAnalyticsDisabled] = React.useState(false);

  // effects
  useDidMount(() => {
    setIsAnalyticsDisabled(AnalyticsService.isAnalyticsDisabled());
  });

  // render
  if (isAnalyticsDisabled) {
    return (
      <Flag
        className="tw-z-40"
        color="dfr-bg-colorful-primary-100"
      />
    );
  }

  return null;
}

type T_FlagProps = {
  className: string;
  color: string;
};

function Flag({ className, color }: T_FlagProps): T_ReactElement {
  return (
    <InlineText
      className={classNames("tw-fixed tw-top-1 tw-left-1 tw-h-1 tw-w-1", className, color)}
    />
  );
}
