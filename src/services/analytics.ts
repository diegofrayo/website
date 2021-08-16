import splitbee from "@splitbee/web";

import { isDevelopmentEnvironment, isUserLoggedIn } from "~/utils/misc";

class AnalyticsService {
  initAnalytics(): void {
    if (this.analyticsIsDisabled()) return;

    splitbee.init();
  }

  trackPageLoaded(): void {
    if (this.analyticsIsDisabled()) return;

    console.group("trackPageLoaded");
    console.info({ page: window.location.pathname, title: document.title });
    console.groupEnd();
  }

  trackEvent(name: string, data): void {
    if (this.analyticsIsDisabled()) return;

    splitbee.track(name, data);
  }

  private analyticsIsDisabled() {
    return isUserLoggedIn() === true || isDevelopmentEnvironment() === true;
  }
}

export default new AnalyticsService();
