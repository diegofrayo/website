import splitbee from "@splitbee/web";

import { isDevelopmentEnvironment, isUserLoggedIn } from "~/utils/misc";

class AnalyticsService {
  async initAnalytics(): Promise<void> {
    if (isUserLoggedIn() === true || isDevelopmentEnvironment() === true) return;

    try {
      splitbee.init();
    } catch (error) {
      console.error("Error loading and initializing the analytics");
      console.error(error);
    }
  }

  trackPageLoaded(): void {
    console.group("trackPageLoaded");
    console.info({ page: window.location.pathname, title: document.title });
    console.groupEnd();
  }

  trackEvent(name: string, data): void {
    splitbee.track(name, data);
  }
}

export default new AnalyticsService();
