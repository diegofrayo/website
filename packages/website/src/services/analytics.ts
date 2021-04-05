import { isUserLoggedIn } from "~/utils/misc";

class AnalyticsService {
  async initAnalytics(): Promise<void> {
    if (isUserLoggedIn() === true) return;

    try {
      const splitbee: any = (await import("@splitbee/web")).default;
      splitbee.init();
    } catch (error) {
      console.error("Error loading and initializing the analytics");
      console.log(error);
    }
  }

  trackPageLoaded(): void {
    console.group("trackPageLoaded");
    console.info({ page: window.location.pathname, title: document.title });
    console.groupEnd();
  }
}

export default new AnalyticsService();
