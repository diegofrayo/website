import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import {
	Kaushan_Script as FontSpecial,
	Bitter as FontTexts,
	Domine as FontTitles,
} from "next/font/google";
import Script from "next/script";

import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { FAVICON_PATH, WEBSITE_METADATA } from "~/constants";

import Providers from "./providers";

// --- METADATA ---

export const metadata: Metadata = {
	metadataBase: new URL(WEBSITE_METADATA.url),
	title: { default: WEBSITE_METADATA.title, template: `%s - ${WEBSITE_METADATA.title}` },
	description: WEBSITE_METADATA.description,
	verification: { google: "fLKb-EbTxZ9s9_1_TZvTWamJhMrEmoiNa4LVU5jnVyc" },
	manifest: "/site.webmanifest",
	icons: {
		apple: `${FAVICON_PATH}/apple-touch-icon.png`,
		icon: [
			{ url: `${FAVICON_PATH}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
			{ url: `${FAVICON_PATH}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
			{ url: `${FAVICON_PATH}/favicon${isDevelopmentEnvironment() ? "-dev" : ""}.ico?v=2` },
		],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
};

// --- COMPONENT DEFINITION ---

function RootLayout({ children }: { children: ReactTypes.Children }) {
	// --- STYLES ---
	const fontsConfig = `
    html {
      --font-titles: ${fontTitles.style.fontFamily};
      --font-texts: ${fontTexts.style.fontFamily};
      --font-special: ${fontSpecial.style.fontFamily};
    }`;

	return (
		<html lang="en">
			<head>
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="white"
				/>
				<Script
					src="https://app.rybbit.io/api/script.js"
					data-site-id="7533"
					strategy="beforeInteractive"
					defer={false}
				/>
			</head>
			<body>
				<style dangerouslySetInnerHTML={{ __html: fontsConfig }} />

				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export default RootLayout;

// --- FONTS ---

const fontSpecial = FontSpecial({
	display: "swap",
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-special",
});

const fontTitles = FontTitles({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-titles",
});

const fontTexts = FontTexts({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-texts",
});
