import "react-toastify/dist/ReactToastify.min.css";
import "~/styles/tailwind.css";
import "~/styles/index.post.css";
import "~/styles/tailwind-utils.css";

import React, { useState } from "react";
import type { AppProps } from "next/app";
import Router from "next/router";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import { useDidMount } from "~/hooks";
import { AssetsProvider } from "~/hooks/useAssets";
import AnalyticsService from "~/services/analytics";
import { setScrollPosition, detectEmojisSupport } from "~/utils/browser";
import { extractLocaleFromUrl, setCurrentLocale } from "~/utils/internationalization";

import ErrorPage from "./_error";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const [error, setError] = useState(undefined);

  useDidMount(() => {
    AnalyticsService.initAnalytics();
    setCurrentLocale(extractLocaleFromUrl());
    detectEmojisSupport();

    Router.events.on("routeChangeComplete", function routeChangeComplete() {
      setScrollPosition(0);
    });

    Router.events.on("routeChangeStart", () => {
      setError(undefined);
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        value={{ light: "tw-light", dark: "tw-dark" }}
      >
        {error ? (
          <ErrorPage />
        ) : (
          <AssetsProvider>
            <Component {...pageProps} />
          </AssetsProvider>
        )}
        <ToastContainer autoClose={3000} hideProgressBar />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/*
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.group("componentDidCatch");
    console.error(error);
    console.error(info);
    console.groupEnd();

    this.setState({ error });
  }
*/

export default App;
