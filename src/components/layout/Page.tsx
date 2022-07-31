import * as React from "react";
import Head from "next/head";
import Script from "next/script";

import { AnalyticsService } from "~/features/analytics";
import { DevelopmentTools } from "~/features/development-tools";
import { I18nService, T_Locale } from "~/features/i18n";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { useStoreSelector } from "~/stores";
import {
	selectWebsiteMetadata,
	selectSEOMetadata,
	T_SEOMetadata,
	T_WebsiteMetadata,
} from "~/stores/modules/metadata";
import { selectPageConfig, T_PageConfig } from "~/stores/modules/page-config";
import { isDevelopmentEnvironment } from "~/utils/app";
import { ROUTES, T_RoutesValues } from "~/features/routing";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString, isTrue } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement } from "~/types";

type T_PageProps = {
	children: T_ReactChildren;
	config: {
		title?: string;
		replaceTitle?: boolean;
		pathname?: string;
		description?: string;
		image?: string;
		disableSEO?: boolean;
		scripts?: {
			element: "link";
			props: {
				href: string;
				rel: string;
				as: string;
			};
		}[];
	};
};

function Page({ children, config = {} }: T_PageProps): T_ReactElement {
	// hooks
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
	const SEO_METADATA = useStoreSelector<T_SEOMetadata>(selectSEOMetadata);
	const { locales } = useStoreSelector<T_PageConfig>(selectPageConfig);

	// vars
	const metadata = {
		title: isNotEmptyString(config.title)
			? `${config.title}${config.replaceTitle ? "" : ` - ${SEO_METADATA.title}`}`
			: SEO_METADATA.title,
		url: `${WEBSITE_METADATA.url}${config.pathname || ""}`,
		description: config.description || SEO_METADATA.description,
		image: config.image || "/static/images/meta-og-image.png",
	};

	// effects
	useDidMount(() => {
		AnalyticsService.trackPageLoaded();
	});

	useDocumentTitle(metadata.title);

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
				{isTrue(config.disableSEO) ? (
					<meta
						name="robots"
						content="noindex,nofollow"
					/>
				) : null}
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
				<meta
					property="og:image"
					content={metadata.image}
				/>
				<meta
					property="og:site_name"
					content={SEO_METADATA.title}
				/>

				{(config.scripts || []).map((script) => {
					const Tag = script.element;

					return (
						<Tag
							key={generateSlug(script.props.href)}
							href={script.props.href}
							rel={script.props.rel}
							as={script.props.as}
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
			<DevelopmentTools />
		</React.Fragment>
	);
}

export default Page;
