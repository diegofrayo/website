import "~/styles/globals.css";

import * as React from "react";
import classNames from "classnames";
import { Poppins, Handlee } from "@next/font/google";

import { Header, Footer } from "~/components/layout";

const baseFont = Poppins({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-base",
	display: "optional",
});

const titlesFont = Handlee({
	weight: ["400"],
	subsets: ["latin"],
	variable: "--font-titles",
	display: "optional",
});

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={classNames("tw-bg-gray-800 tw-py-4", baseFont.variable, titlesFont.variable)}
		>
			<head />
			<body className="tw-mx-auto tw-max-w-screen-lg tw-rounded-md tw-border-8 tw-border-yellow-500 tw-bg-white">
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}

export default RootLayout;

// --- Components ---
