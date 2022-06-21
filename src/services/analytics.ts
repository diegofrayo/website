import splitbee from "@splitbee/web";

import { AuthService } from "~/auth";
import { isDevelopmentEnvironment, logger } from "~/utils/app";
import { isNotEmptyString } from "~/utils/validations";
import type { T_Object } from "~/types";

class AnalyticsService {
  private isLibraryNotInitialized = true;

  init(): void {
    if (this.isAnalyticsDisabled()) return;

    splitbee.init();
    this.isLibraryNotInitialized = false;
  }

  trackPageLoaded(): void {
    if (this.isAnalyticsDisabled() || this.isLibraryNotInitialized) {
      logger("LOG", `Page "${window.location.pathname}" visit was not tracked`, {
        isLibraryNotInitialized: this.isLibraryNotInitialized,
        isAnalyticsDisabled: this.isAnalyticsDisabled(),
      });

      return;
    }

    console.group("trackPageLoaded");
    logger("LOG", { page: window.location.pathname, title: document.title });
    console.groupEnd();
  }

  trackEvent(name: string, data: T_Object<string | number | boolean>): void {
    if (this.isAnalyticsDisabled() || this.isLibraryNotInitialized) {
      logger("LOG", `Event "${name}" was not tracked`, data, {
        isLibraryNotInitialized: this.isLibraryNotInitialized,
        isAnalyticsDisabled: this.isAnalyticsDisabled(),
      });

      return;
    }

    splitbee.track(name, data);
  }

  isAnalyticsDisabled(): boolean {
    if (
      window.location.href.includes("a=d") ||
      isNotEmptyString(window.localStorage.getItem("DFR_ANALYTICS_DISABLED"))
    ) {
      window.localStorage.setItem("DFR_ANALYTICS_DISABLED", "true");
      return true;
    }

    return AuthService.isUserLoggedIn() || isDevelopmentEnvironment();
  }
}

export default new AnalyticsService();
