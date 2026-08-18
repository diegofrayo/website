import Head from "next/head";
import Script from "next/script";

import { useDidMount, useDocumentTitle } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";
import { is } from "@diegofrayo-pkg/utilities/fp";
import { isBoolean, isEmptyString } from "@diegofrayo-pkg/validator";

import { ASSETS_ROOT_PATH, EnvVars, FAVICON_PATH, WEBSITE_METADATA } from "~/constants";
import AnalyticsService from "~/features/analytics";
import AuthService from "~/features/auth";
import DevTools from "~/features/dev-tools";
import { Routes } from "~/features/routing";

type PageProps = {
	children: ReactTypes.Children;
	config: PageMetadata;
};

function Page({ children, config }: PageProps) {
	// --- COMPUTED STATES ---
	const defaultConfig = {
		isSEOEnabled: isBoolean(config.isSEOEnabled) ? config.isSEOEnabled : false,
		shouldAppendWebsiteNameInTitle: isBoolean(config.shouldAppendWebsiteNameInTitle)
			? config.shouldAppendWebsiteNameInTitle
			: true,
		title: config.title || "",
		description: config.description || "",
		pathname: config.pathname || "",
		image: config.image || "",
	};
	const metadata = {
		title: composeTitle(defaultConfig.title, defaultConfig.shouldAppendWebsiteNameInTitle),
		url: `${WEBSITE_METADATA.url}${config.pathname || ""}`,
		description: defaultConfig.description || WEBSITE_METADATA.description,
		image: defaultConfig.image || `${ASSETS_ROOT_PATH}/meta-og-image.png`,
		isSEOEnabled: defaultConfig.isSEOEnabled,
	};
	const isHomeOrResumePage = is(config.pathname, [Routes.INDEX, Routes.RESUME]);

	// --- EFFECTS ---
	useDidMount(() => {
		AuthService.onSessionLoad(() => {
			AnalyticsService.trackPageLoaded();
		});
	});

	useDocumentTitle(metadata.title);

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no"
				/>
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="white"
				/>
				<meta
					name="google-site-verification"
					content="fLKb-EbTxZ9s9_1_TZvTWamJhMrEmoiNa4LVU5jnVyc"
				/>
				{!metadata.isSEOEnabled && (
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
				<meta
					property="og:image"
					content={metadata.image}
				/>
				<meta
					property="og:site_name"
					content={WEBSITE_METADATA.title}
				/>

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
					href={`${FAVICON_PATH}/apple-touch-icon.png`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href={`${FAVICON_PATH}/favicon-32x32.png`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href={`${FAVICON_PATH}/favicon-16x16.png`}
				/>
				<link
					rel="icon"
					href={`${FAVICON_PATH}/favicon${isDevelopmentEnvironment() ? "-dev" : ""}.ico?v=2`}
				/>

				{isHomeOrResumePage && (
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
								sameAs: [
									WEBSITE_METADATA.social.github,
									WEBSITE_METADATA.social.instagram,
									WEBSITE_METADATA.social.linkedin,
									WEBSITE_METADATA.social.x,
								],
							}),
						}}
					/>
				)}
			</Head>

			{children}

			<DevTools
				devURL={EnvVars.NEXT_PUBLIC_WEBSITE_URL_DEV}
				productionURL={EnvVars.NEXT_PUBLIC_WEBSITE_URL_PROD}
			/>
		</>
	);
}

export default Page;

// --- TYPES ---

export type PageMetadata = {
	isSEOEnabled?: boolean;
	shouldAppendWebsiteNameInTitle?: boolean;
	title: string;
	description?: string;
	pathname?: string;
	image?: string;
	scripts?: {
		element: "link";
		props: {
			href: string;
			rel: string;
			as: string;
		};
	}[];
};

// --- UTILS ---

function composeTitle(title: string, shouldAppendWebsiteNameInTitle: boolean) {
	if (isEmptyString(title)) {
		return WEBSITE_METADATA.title;
	}

	if (shouldAppendWebsiteNameInTitle) {
		return `${title} - ${WEBSITE_METADATA.title}`;
	}

	return title;
}
