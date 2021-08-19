import "react-toastify/dist/ReactToastify.min.css";
import "~/styles/index.post.css";

import React from "react";
import App from "next/app";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { ProgressBar } from "~/components/layout";
import { useDidMount } from "~/hooks";
import { I18nService } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import AuthService from "~/services/auth";
import MetadataService from "~/services/metadata";
import { createPreloadedState, useStore } from "~/state";
import { T_ReactElement } from "~/types";
import { detectEmojisSupport } from "~/utils/browser";

import ErrorPage from "./500";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function CustomApp({ Component, pageProps }: AppProps): T_ReactElement {
  const store = useStore(
    createPreloadedState({
      metadata: pageProps.metadata,
      pageContent: pageProps.pageContent,
    }),
  );

  useDidMount(() => {
    AuthService.configureHttpHeaders();
    AnalyticsService.init();
    detectEmojisSupport();
  });

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
          onError={function onError(error: Error, info: { componentStack: string }) {
            console.group("componentDidCatch (ErrorBoundary)");
            console.error(error);
            console.error(info);
            console.groupEnd();
          }}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              value={{ light: "tw-light", dark: "tw-dark" }}
            >
              <Component {...pageProps} />
              <ProgressBar />
              <ToastContainer autoClose={3000} hideProgressBar />
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </I18nextProvider>
    </Provider>
  );
}

export default CustomApp;

// --- Next.js functions ---

CustomApp.getInitialProps = async (appContext) => {
  const metadata = await MetadataService.fetchData(appContext.router.locale);
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      metadata,
    },
  };
};
