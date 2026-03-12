import "~/styles/globals.css";

import { Component, useEffect, type ErrorInfo } from "react";
import type { AppProps } from "next/app";
import {
	Kaushan_Script as FontSpecial,
	Bitter as FontTexts,
	Domine as FontTitles,
} from "next/font/google";
import { Tooltip as RadixTooltip } from "radix-ui";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import { useDidMount } from "@diegofrayo-pkg/hooks";
import type DR from "@diegofrayo-pkg/types";
import { isMobileDevice, isWindowsDevice } from "@diegofrayo-pkg/utilities/browser";
import { useAuth } from "@diegofrayo-features/auth";
import { addGlobalErrorListener, logger } from "@diegofrayo-features/logger";

import ErrorPage from "~/features/pages/error.page";

// --- PROPS & TYPES ---

type CustomAppProps = AppProps;

// --- COMPONENT DEFINITION ---

function CustomApp({ Component, pageProps }: CustomAppProps) {
	// --- HOOKS ---
	const { isSessionLoaded } = useAuth();

	// --- EFFECTS ---
	useDidMount(() => {
		addGlobalErrorListener();

		if (isWindowsDevice()) {
			document.body.classList.add("windows-os");
		}

		if (isMobileDevice()) {
			document.body.classList.add("mobile");
		}

		return () => undefined;
	});

	useEffect(
		function checkUserSession() {
			if (isSessionLoaded) {
				setTimeout(() => document.body.classList.add("visible"), 500);
			}
		},
		[isSessionLoaded],
	);

	// --- UTILS ---
	function onError(error: unknown, info: ErrorInfo) {
		console.group("componentDidCatch (ErrorBoundary)");
		logger("ERROR", error);
		logger("ERROR", info);
		console.groupEnd();
	}

	// --- STYLES ---
	const fontsConfig = `
    html {
      --font-titles: ${fontTitles.style.fontFamily};
      --font-texts: ${fontTexts.style.fontFamily};
      --font-special: ${fontSpecial.style.fontFamily};
    }`;

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={onError}
		>
			<style dangerouslySetInnerHTML={{ __html: fontsConfig }} />

			<RadixTooltip.Provider>
				<CustomErrorBoundary>
					{isSessionLoaded ? <Component {...pageProps} /> : null}
					<Toaster
						position="bottom-center"
						toastOptions={{
							classNames: {
								toast: "justify-center bg-white shadow-md text-black",
								closeButton: "bg-white text-black shadow-lg border border-zinc-300",
							},
						}}
						richColors={false}
						closeButton
					/>
				</CustomErrorBoundary>
			</RadixTooltip.Provider>
		</ErrorBoundary>
	);
}

export default CustomApp;

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

// --- COMPONENTS ---

function ErrorFallback() {
	return (
		<ErrorPage
			variant="500"
			title="500"
		/>
	);
}

class CustomErrorBoundary extends Component<
	{ children: DR.React.Children },
	{ hasError: boolean }
> {
	constructor(props: { children: DR.React.Children }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: unknown, errorInfo: unknown) {
		logger("ERROR", error);
		logger("ERROR", errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorFallback />;
		}

		return this.props.children;
	}
}
