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
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

import { ProgressBar } from "~/components/layout";
import { AuthService } from "~/auth";
import { useDidMount } from "~/hooks";
import { I18nService } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import MetadataService from "~/services/metadata";
import { createPreloadedState, useStore } from "~/state";
import type { T_ReactElement } from "~/types";
import { isPWA } from "~/utils/browser";
import { MDXComponents } from "~/utils/mdx";

import ErrorPage from "./500";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 30, // 30 days
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function CustomApp({ Component, pageProps }: AppProps): T_ReactElement {
  const router = useRouter();
  const store = useStore(
    createPreloadedState({
      metadata: pageProps.metadata,
      pageContent: pageProps.pageContent,
      locale: pageProps.locale,
    }),
  );

  useDidMount(() => {
    AuthService.configureHttpHeaders();
    AnalyticsService.init();

    persistQueryClient({
      persistor: createWebStoragePersistor({ storage: window.localStorage }),
      queryClient,
    });

    if (isPWA()) {
      const LOCAL_STORAGE_KEY = "DFR_LAST_PAGE";
      const lastPageVisited = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";
      const handleRouteChangeComplete = () => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, window.location.pathname);
      };

      if (lastPageVisited && lastPageVisited !== window.location.pathname) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.location.href = lastPageVisited;
        return;
      }

      router.events.on("routeChangeComplete", handleRouteChangeComplete);

      return () => {
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      };
    }
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
              storageKey="DFR_THEME"
              defaultTheme="system"
              enableSystem={true}
              attribute="class"
              themes={["light"]}
              value={{ light: "tw-light" }}
              // themes={["light", "dark"]}
              // value={{ light: "tw-light", dark: "tw-dark" }}
            >
              <MDXProvider components={MDXComponents as any}>
                <Component {...pageProps} />
              </MDXProvider>
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
