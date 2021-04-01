import { isUserLoggedIn } from "./misc";

export async function initAnalytics(): Promise<void> {
  if (isUserLoggedIn() === true) return;
  const splitbee: any = await import("@splitbee/web");
  splitbee.init();
}

export function trackPageLoaded(): void {
  console.group("trackPageLoaded");
  console.info({ page: window.location.pathname, title: document.title });
  console.groupEnd();
}
