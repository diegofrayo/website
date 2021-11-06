import splitbee from "@splitbee/web";

import { AuthService } from "~/auth";
import { isBrowser, isDevelopmentEnvironment } from "~/utils/misc";

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

  isAnalyticsDisabled() {
    if (
      isBrowser() &&
      (window.location.href.includes("a=d") || window.localStorage.getItem("DFR_DA"))
    ) {
      window.localStorage.setItem("DFR_DA", "true");
      return true;
    }

    return AuthService.isUserLoggedIn() === true || isDevelopmentEnvironment() === true;
  }
}

export default new AnalyticsService();
