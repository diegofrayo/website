import splitbee from "@splitbee/web";

import { isDevelopmentEnvironment } from "~/utils/misc";

import AuthService from "./auth";

class AnalyticsService {
  init(): void {
    if (this.isAnalyticsDisabled()) return;

    splitbee.init();
  }

  trackPageLoaded(): void {
    if (this.isAnalyticsDisabled()) return;

    console.group("trackPageLoaded");
    console.info({ page: window.location.pathname, title: document.title });
    console.groupEnd();
  }

  trackEvent(name: string, data): void {
    if (this.isAnalyticsDisabled()) return;

    splitbee.track(name, data);
  }

  private isAnalyticsDisabled() {
    return AuthService.isUserLoggedIn() === true || isDevelopmentEnvironment() === true;
  }
}

export default new AnalyticsService();
