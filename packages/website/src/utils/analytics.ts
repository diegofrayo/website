import ReactGA from "react-ga";

import { isUserLoggedIn } from "./misc";

declare let window: any;
const ANALYTICS_PROPERTY_NAME = "website";
const ANALYTICS_TRACKING_ID = "UA-98284306-1";

export function initAnalytics(): void {
  ReactGA.initialize(ANALYTICS_TRACKING_ID, {
    testMode: isUserLoggedIn(),
  });
  ReactGA.set({ appName: ANALYTICS_PROPERTY_NAME });
}

export function trackPageLoaded(): void {
  console.group("trackPageLoaded");
  console.info({
    hitType: "pageview",
    page: window.location.pathname,
    title: document.title,
  });
  console.groupEnd();

  ReactGA.pageview(window.location.pathname, [], document.title);
}
