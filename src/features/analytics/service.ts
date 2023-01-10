import autoBind from "auto-bind";
import splitbee from "@splitbee/web";

import { AuthService } from "~/features/auth";
import { logger } from "~/features/logging";
import v from "~/lib/v";
import { isLocalhostEnvironment } from "~/utils/app";
import type { T_Object } from "~/types";

class AnalyticsService {
	constructor() {
		autoBind(this);
	}

	private isLibraryInitialized = false;

	init(): void {
		if (this.isAnalyticsDisabled() || v.isTrue(this.isLibraryInitialized)) {
			return;
		}

		splitbee.init();
		this.isLibraryInitialized = true;
	}

	trackPageLoaded(): void {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Page "${window.location.pathname}" visit was not tracked`);
			return;
		}

		/*
		 * NOTE: Splitbee tracks a page loaded automatically,
		 * it is not necessary invoking any function
		 */
		this.init();
		logger("LOG", `Page "${window.location.pathname}" visit was tracked`);
	}

	trackEvent(name: string, data: T_Object<string | number | boolean>): void {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Event "${name}" was not tracked`, data);
			return;
		}

		this.init();
		splitbee.track(name, data);
	}

	isAnalyticsDisabled(): boolean {
		if (
			window.location.href.includes("a=d") ||
			v.isNotEmptyString(window.localStorage.getItem("DFR_ANALYTICS_DISABLED"))
		) {
			window.localStorage.setItem("DFR_ANALYTICS_DISABLED", "true");
			return true;
		}

		return AuthService.isUserLoggedIn() || isLocalhostEnvironment();
	}
}

export default new AnalyticsService();
