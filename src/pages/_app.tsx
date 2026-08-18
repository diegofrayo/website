import "~/styles/globals.css";

import { Component, type ErrorInfo } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import type { AppProps } from "next/app";
import {
	Kaushan_Script as FontSpecial,
	Bitter as FontTexts,
	Domine as FontTitles,
} from "next/font/google";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import { useDidMount } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isMobileDevice } from "@diegofrayo-pkg/utilities/browser";

import AuthService from "~/features/auth";
import logger, { addGlobalErrorListener } from "~/features/logger";
import ErrorPage from "~/features/pages/error.page";

// --- PROPS & TYPES ---

type CustomAppProps = AppProps;

// --- COMPONENT DEFINITION ---

function CustomApp({ Component, pageProps }: CustomAppProps) {
	// --- EFFECTS ---
	useDidMount(() => {
		addGlobalErrorListener();

		if (isMobileDevice()) {
			document.body.classList.add("mobile");
		}

		AuthService.loadSession();
	});

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

			<Tooltip.Provider>
				<CustomErrorBoundary>
					<Component {...pageProps} />
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
			</Tooltip.Provider>
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
	{ children: ReactTypes.Children },
	{ hasError: boolean }
> {
	constructor(props: { children: ReactTypes.Children }) {
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
