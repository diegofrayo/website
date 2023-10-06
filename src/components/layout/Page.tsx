import * as React from "react";
import Head from "next/head";
import Script from "next/script";

import WEBSITE_METADATA from "~/data/generated/metadata.json";
import { ROUTES, type T_RoutesValues } from "~/features/routing";
import { useDocumentTitle } from "~/hooks";
import { isDevelopmentEnvironment } from "~/utils/app";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

type T_PageProps = {
	children: DR.React.Children;
	config: {
		disableSEO?: boolean;
		title?: string;
		replaceTitle?: boolean;
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
};

function Page({ children, config }: T_PageProps) {
	// --- VARS ---
	const metadata = {
		title: v.isNotEmptyString(config.title)
			? `${config.title}${config.replaceTitle ? "" : ` - ${WEBSITE_METADATA.title}`}`
			: WEBSITE_METADATA.title,
		url: `${WEBSITE_METADATA.url}${config.pathname || ""}`,
		description: config.description || WEBSITE_METADATA.description,
		image: config.image || "/assets/images/meta-og-image.png",
	};

	// --- EFFECTS ---
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
				{config.disableSEO ? (
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
					href="/assets/images/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/assets/images/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/assets/images/favicon/favicon-16x16.png"
				/>
				<link
					rel="icon"
					href={`/assets/images/favicon/favicon${isDevelopmentEnvironment() ? "-dev" : ""}.ico?v=1`}
				/>

				{[ROUTES.HOME, ROUTES.RESUME].includes(config.pathname as T_RoutesValues) ? (
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
									WEBSITE_METADATA.social.linkedin,
									WEBSITE_METADATA.social.twitter,
									WEBSITE_METADATA.social.instagram,
									WEBSITE_METADATA.social.spotify,
								],
							}),
						}}
					/>
				) : null}
			</Head>
			{children}
		</React.Fragment>
	);
}

export default Page;
