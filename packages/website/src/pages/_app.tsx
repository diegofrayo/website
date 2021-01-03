import "~/styles/tailwind.css";
import "~/styles/index.css";
import "~/styles/tailwind-utils.css";

import * as React from "react";
import App from "next/app";
import Router from "next/router";
import { ThemeProvider } from "next-themes";

import { AssetsProvider } from "~/hooks/useAssets";
import { initAnalytics } from "~/utils/analytics";
import { setScrollPosition, detectEmojisSupport } from "~/utils/browser";
import { extractLocaleFromUrl, setCurrentLocale } from "~/utils/internationalization";

import ErrorPage from "./_error";

class CustomApp extends App {
  state = { error: null };

  componentDidMount(): void {
    initAnalytics();
    detectEmojisSupport();
    setCurrentLocale(extractLocaleFromUrl());

    Router.events.on("routeChangeComplete", function routeChangeComplete() {
      setScrollPosition(0);
    });

    Router.events.on("routeChangeStart", () => {
      this.setState({ error: null });
    });
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.group("componentDidCatch");
    console.error(error);
    console.error(info);
    console.groupEnd();

    this.setState({ error });
  }

  render(): any {
    const { Component, pageProps } = this.props;
    const { error } = this.state;

    return (
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
      </ThemeProvider>
    );
  }
}

export default CustomApp;
