import splitbee from "@splitbee/web";

import { AuthService } from "~/auth";
import { isBrowser, isDevelopmentEnvironment, logger } from "~/utils/app";
import { exists } from "~/utils/validations";
import type { T_ObjectWithPrimitives } from "~/types";

// TODO: Command pattern to avoid repeating this line (if (this.isAnalyticsDisabled()) return;)
class AnalyticsService {
  init(): void {
    if (this.isAnalyticsDisabled()) return;

    splitbee.init();
  }

  trackPageLoaded(): void {
    if (this.isAnalyticsDisabled()) return;

    console.group("trackPageLoaded");
    logger("LOG", { page: window.location.pathname, title: document.title });
    console.groupEnd();
  }

  trackEvent(name: string, data: T_ObjectWithPrimitives): void {
    if (this.isAnalyticsDisabled()) return;

    splitbee.track(name, data);
  }

  // TODO: Review this method
  isAnalyticsDisabled(): boolean {
    if (
      isBrowser() &&
      (window.location.href.includes("a=d") || exists(window.localStorage.getItem("DFR_DA")))
    ) {
      window.localStorage.setItem("DFR_DA", "true");
      return true;
    }

    return AuthService.isUserLoggedIn() || isDevelopmentEnvironment();
  }
}

export default new AnalyticsService();
