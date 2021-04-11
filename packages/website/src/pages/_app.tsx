import "react-toastify/dist/ReactToastify.min.css";
import "~/styles/tailwind.css";
import "~/styles/index.post.css";
import "~/styles/tailwind-utils.css";

import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";

import { useDidMount } from "~/hooks";
import { AssetsProvider } from "~/hooks/useAssets";
import AnalyticsService from "~/services/analytics";
import { T_ReactElement } from "~/types";
import { detectEmojisSupport } from "~/utils/browser";
import { extractLocaleFromUrl, setCurrentLocale } from "~/utils/internationalization";

import ErrorPage from "./_error";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps): T_ReactElement {
  useDidMount(() => {
    AnalyticsService.initAnalytics();
    setCurrentLocale(extractLocaleFromUrl());
    detectEmojisSupport();
  });

  return (
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
          <AssetsProvider>
            <Component {...pageProps} />
          </AssetsProvider>
          <ToastContainer autoClose={3000} hideProgressBar />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
