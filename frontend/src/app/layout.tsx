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
			className={classNames("tw-bg-white", baseFont.variable, titlesFont.variable)}
		>
			<head />
			<body className="tw-flex tw-min-h-screen tw-flex-col">
				<Header />
				<main className="tw-mx-auto tw-flex tw-w-full tw-flex-1 tw-items-center tw-justify-center tw-py-8 tw-px-4 dfr-max-w-layout">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}

export default RootLayout;
