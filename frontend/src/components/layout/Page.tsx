import * as React from "react";
import Head from "next/head";
import Script from "next/script";

import { AnalyticsService } from "~/@legacy/src/features/analytics";
import { DevelopmentTools } from "~/@legacy/src/features/development-tools";
import { I18nService, T_Locale } from "~/@legacy/src/features/i18n";
import { useDidMount, useDocumentTitle } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { useStoreSelector } from "~/@legacy/src/stores";
import {
	selectWebsiteMetadata,
	selectSEOMetadata,
	T_SEOMetadata,
	T_WebsiteMetadata,
} from "~/@legacy/src/stores/modules/metadata";
import { selectPageConfig, T_PageConfig } from "~/@legacy/src/stores/modules/page-config";
import { isDevelopmentEnvironment } from "~/@legacy/src/utils/app";
import { ROUTES, T_RoutesValues } from "~/@legacy/src/features/routing";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type { T_ReactChildren, T_ReactElement } from "~/@legacy/src/types";

type T_PageProps = {
	children: T_ReactChildren;
	config: {
		title?: string;
		pathname?: string;
		description?: string;
		image?: string;
		scripts?: {
			element: "link";
			props: {
				href: string;
				rel: string;
				as: string;
			};
		}[];
		fullTitle?: boolean;
		enableSEO?: boolean;
	};
};

function Page({ children, config }: T_PageProps): T_ReactElement {
	// hooks
	const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
	const SEO_METADATA = useStoreSelector<T_SEOMetadata>(selectSEOMetadata);
	const { locales } = useStoreSelector<T_PageConfig>(selectPageConfig);

	// vars
	const metadata = {
		title: v.isNotEmptyString(config.title)
			? `${config.title}${config.replaceTitle ? "" : ` - ${SEO_METADATA.title}`}`
			: SEO_METADATA.title,
		url: `${WEBSITE_METADATA.url}${config.pathname || ""}`,
		description: config.description || SEO_METADATA.description,
		image: config.image || "/@legacy/static/images/meta-og-image.png",
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
				{v.isTrue(config.disableSEO) ? (
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
					href="/@legacy/site.webmanifest"
				/>
				<link
					rel="canonical"
					href={metadata.url}
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/@legacy/static/images/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/@legacy/static/images/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/@legacy/static/images/favicon/favicon-16x16.png"
				/>
				<link
					rel="icon"
					href={`/@legacy/static/images/favicon/favicon${
						isDevelopmentEnvironment() ? "-dev" : ""
					}.ico?v=3`}
				/>
				<link
					rel="alternate"
					type="application/rss+xml"
					title={`RSS Feed for ${WEBSITE_METADATA.url.replace("https://", "")}`}
					href="/@legacy/rss.xml"
				/>
				<link
					rel="alternate"
					type="application/rss+atom"
					title={`Atom Feed for ${WEBSITE_METADATA.url.replace("https://", "")}`}
					href="/@legacy/atom.xml"
				/>

				{[ROUTES.HOME, ROUTES.ABOUT_ME, ROUTES.RESUME].includes(
					config.pathname as T_RoutesValues,
				) ? (
					<Script
						id="application/ld+json"
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
