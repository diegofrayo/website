import splitbee from "@splitbee/web";
import { isUserLoggedIn } from "./misc";

export function initAnalytics(): void {
  if (isUserLoggedIn() === true) return;
  splitbee.init();
}

export function trackPageLoaded(): void {
  console.group("trackPageLoaded");
  console.info({ page: window.location.pathname, title: document.title });
  console.groupEnd();
}
