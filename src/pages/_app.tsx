import "../styles.css";

import * as React from "react";
import App from "next/app";
import Router from "next/router";
import { ThemeProvider } from "next-themes";

import { initAnalytics, configureAnalytics } from "~/utils/analytics";
import { setScroll } from "~/utils/misc";

import ErrorPage from "./_error";

class CustomApp extends App {
  state = { error: null, loadFromServer: true };

  componentDidMount(): void {
    initAnalytics();

    function onRouteChangeComplete() {
      console.log("onRouteChangeComplete");
      setScroll(0);
    }

    Router.events.on("routeChangeComplete", onRouteChangeComplete);
    Router.events.on("routeChangeStart", () => {
      this.setState({ error: null });
    });

    if (this.state.loadFromServer) {
      configureAnalytics();
      onRouteChangeComplete();
      this.setState({ loadFromServer: false });
    }
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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {error ? <ErrorPage /> : <Component {...pageProps} />}
      </ThemeProvider>
    );
  }
}

export default CustomApp;
