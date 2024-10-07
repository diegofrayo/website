import "~/styles/app.css";

import * as React from "react";
import {
	Staatliches as FontTitles,
	Black_Ops_One as FontMainTitle,
	Domine as FontTexts,
} from "next/font/google";
import router from "next/router";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import type { AppProps } from "next/app";

import { isMobileDevice, isPWA, isWindowsDevice } from "@diegofrayo/utils/browser";
import { useDidMount } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import useAuth from "~/modules/auth/hooks";
import { addErrorsGlobalListener, logger } from "~/modules/logging";
import ErrorPage from "~/modules/pages/ErrorPage";
import { initPWARoutingConfig } from "~/modules/routing";
import { recoverFromBreakingChanges } from "~/utils/errors-recovery";

// --- PROPS & TYPES ---

type T_CustomAppProps = AppProps;

// --- COMPONENT DEFINITION ---

function CustomApp({ Component, pageProps }: T_CustomAppProps) {
	// --- HOOKS ---
	const { isSessionLoaded } = useAuth();

	// --- EFFECTS ---
	useDidMount(() => {
		addErrorsGlobalListener();
		recoverFromBreakingChanges();

		if (isWindowsDevice()) {
			document.body.classList.add("windows-os");
		}

		if (isMobileDevice()) {
			document.body.classList.add("mobile");
		}

		if (isPWA()) {
			return initPWARoutingConfig(router);
		}

		return () => undefined;
	});

	React.useEffect(
		function checkUserSession() {
			if (isSessionLoaded) {
				setTimeout(() => document.body.classList.add("visible"), 500);
			}
		},
		[isSessionLoaded],
	);

	// --- UTILS ---
	function onError(error: Error, info: { componentStack: string }) {
		console.group("componentDidCatch (ErrorBoundary)");
		logger("ERROR", error);
		logger("ERROR", info);
		console.groupEnd();
	}

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={onError}
		>
			<style
				dangerouslySetInnerHTML={{
					__html: `
            html {
              --font-main-title: ${fontMainTitle.style.fontFamily};
              --font-titles: ${fontTitles.style.fontFamily};
              --font-texts: ${fontTexts.style.fontFamily};
            }
        `,
				}}
			/>
			<RadixTooltip.Provider>
				<CustomErrorBoundary>
					{isSessionLoaded ? <Component {...pageProps} /> : null}
					<Toaster
						position="bottom-center"
						toastOptions={{
							style: { justifyContent: "center" },
						}}
						closeButton
						richColors
					/>
				</CustomErrorBoundary>
			</RadixTooltip.Provider>
		</ErrorBoundary>
	);
}

export default CustomApp;

// --- FONTS ---

const fontMainTitle = FontMainTitle({
	display: "swap",
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-main-title",
});

const fontTitles = FontTitles({
	display: "swap",
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-titles",
});

const fontTexts = FontTexts({
	display: "swap",
	subsets: ["latin"],
	weight: ["400", "700"],
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

class CustomErrorBoundary extends React.Component<
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
