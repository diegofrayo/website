import "~/styles/app.css";

import * as React from "react";
import { Staatliches, Black_Ops_One, Montserrat } from "next/font/google";
import router from "next/router";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import type { AppProps } from "next/app";

import { addErrorsGlobalListener, logger } from "~/modules/logging";
import EnvVars from "~/modules/env-vars";
import ErrorPage from "~/modules/pages/ErrorPage";
import { initPWARoutingConfig } from "~/modules/routing";
import { recoverFromBreakingChanges } from "~/utils/errors-recovery";
import { useDidMount } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { isDevelopmentEnvironment } from "~/utils/app";
import { isMobileDevice, isPWA, isWindowsDevice } from "@diegofrayo/utils/browser";
import { isServer } from "@diegofrayo/utils/misc";

// --- PROPS & TYPES ---

type T_CustomAppProps = AppProps;

// --- COMPONENT DEFINITION ---

function CustomApp({ Component, pageProps }: T_CustomAppProps) {
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
			<RadixTooltip.Provider>
				<CustomErrorBoundary>
					<Component {...pageProps} />
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

// --- STYLES ---

const fontMainTitle = Black_Ops_One({
	display: "swap",
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-main-title",
});

const fontTitles = Staatliches({
	display: "swap",
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-titles",
});

const fontTexts = Montserrat({
	display: "swap",
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-texts",
});

(function injectGlobalStyles() {
	if (isServer()) {
		return;
	}

	let css;

	if (isDevelopmentEnvironment(EnvVars)) {
		css = `
      html {
        --font-main-title: 'Black Ops One';
        --font-titles: 'Staatliches';
        --font-texts: 'Montserrat';
      }
    `;
	} else {
		css = `
      html {
        --font-main-title: ${fontMainTitle.style.fontFamily};
        --font-titles: ${fontTitles.style.fontFamily};
        --font-texts: ${fontTexts.style.fontFamily};
      }
    `;
	}

	const style = document.createElement("style");
	style.appendChild(document.createTextNode(css));

	const head = document.head || document.getElementsByTagName("head")[0];
	head.appendChild(style);
})();

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
