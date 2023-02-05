import "react-toastify/dist/ReactToastify.min.css";
import "~/@legacy/src/styles/index.post.css";

import * as React from "react";
import App from "next/app";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { MDXProvider } from "@mdx-js/react";

import { ProgressBar } from "~/@legacy/src/components/layout";
import { AnalyticsService } from "~/@legacy/src/features/analytics";
import { AuthService } from "~/@legacy/src/features/auth";
import { addErrorsGlobalListener, logger } from "~/@legacy/src/features/logging";
import { I18nService, T_Locale, T_PageContent } from "~/@legacy/src/features/i18n";
import { MetadataService } from "~/@legacy/src/features/metadata";
import { useDidMount } from "~/@legacy/src/hooks";
import { createPreloadedState, useStore } from "~/@legacy/src/stores";
import { T_Metadata } from "~/@legacy/src/stores/modules/metadata";
import { isMobileDevice, isPWA } from "~/@legacy/src/utils/browser";
import { MDXComponents, updateMDXScope } from "~/@legacy/src/features/mdx";
import { initPWARoutingConfig } from "~/@legacy/src/features/routing";
import type { T_ReactElement, T_Object } from "~/@legacy/src/types";

import ErrorPage from "./500";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 60 * 24 * 30, // 30 days
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

function CustomApp({
	Component,
	pageProps,
}: AppProps<{
	metadata: T_Metadata;
	pageContent: T_PageContent;
	locale: T_Locale;
}>): T_ReactElement {
	// hooks
	const router = useRouter();
	const store = useStore(
		createPreloadedState({
			metadata: pageProps.metadata,
			pageContent: pageProps.pageContent,
			locale: pageProps.locale,
		}),
	);

	// effects
	useDidMount(() => {
		AnalyticsService.init();
		AuthService.configureHTTPHeaders();
		addErrorsGlobalListener();

		if (isPWA()) {
			return initPWARoutingConfig(router);
		}

		if (isMobileDevice()) {
			document.body.classList.add("mobile");
		}

		return () => undefined;
	});

	// utils
	function onError(error: Error, info: { componentStack: string }): void {
		console.group("componentDidCatch (ErrorBoundary)");
		logger("ERROR", error);
		logger("ERROR", info);
		console.groupEnd();
	}

	return (
		<Provider store={store}>
			<I18nextProvider
				i18n={I18nService.createInstance({
					messages: pageProps.pageContent,
					locale: pageProps.locale,
				})}
			>
				<ErrorBoundary
					FallbackComponent={ErrorPage}
					onError={onError}
				>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider
							storageKey="DFR_THEME"
							defaultTheme="light"
							attribute="class"
							themes={["light", "dark"]}
							value={{ light: "tw-light", dark: "tw-dark" }}
						>
							<MDXProvider components={MDXComponents}>
								<Component {...pageProps} />
							</MDXProvider>
							<ProgressBar />
							<ToastContainer
								autoClose={3000}
								hideProgressBar
							/>
						</ThemeProvider>
					</QueryClientProvider>
				</ErrorBoundary>
			</I18nextProvider>
		</Provider>
	);
}

export default CustomApp;

// --- Next.js functions ---

// https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
// https://linguinecode.com/post/next-js-typescript-getinitialprops
// @ts-ignore
CustomApp.getInitialProps = async (appContext): Promise<T_Object> => {
	const metadata = await MetadataService.fetchData(appContext.router.locale);
	const appProps = await App.getInitialProps(appContext);

	updateMDXScope(metadata.website);

	return {
		...appProps,
		pageProps: {
			...appProps.pageProps,
			metadata,
		},
	};
};

export function reportWebVitals(metrics: unknown): void {
	logger("LOG", metrics);
}
