import "react-toastify/dist/ReactToastify.min.css";
import "~/styles/index.post.css";

import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";

import { ProgressBar } from "~/components/layout";
import { useDidMount } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import I18NService from "~/services/i18n";
import { T_ReactElement } from "~/types";
import { detectEmojisSupport } from "~/utils/browser";

import ErrorPage from "./500";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App({ Component, pageProps }: AppProps): T_ReactElement {
  useDidMount(() => {
    AnalyticsService.initAnalytics();
    detectEmojisSupport();
  });

  return (
    <I18nextProvider
      i18n={I18NService.createI18NInstance({
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
  );
}

export default App;
