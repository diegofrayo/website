import "react-toastify/dist/ReactToastify.min.css";
import "~/styles/index.post.css";

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

import { ProgressBar } from "~/components/layout";
import { AnalyticsService } from "~/features/analytics";
import { AuthService } from "~/features/auth";
import { addErrorsGlobalListener, logger } from "~/features/logging";
import { I18nService, T_Locale, T_PageContent } from "~/features/i18n";
import { MetadataService } from "~/features/metadata";
import { useDidMount } from "~/hooks";
import { createPreloadedState, useStore } from "~/stores";
import { T_Metadata } from "~/stores/modules/metadata";
import { isMobileDevice, isPWA } from "~/utils/browser";
import { MDXComponents, updateMDXScope } from "~/features/mdx";
import { initPWARoutingConfig } from "~/features/routing";
import type { T_ReactElement, T_Object } from "~/types";

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