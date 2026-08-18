import autoBind from "auto-bind";

import { BrowserStorageManager } from "@diegofrayo-pkg/browser-storage";
import type UtilsTypes from "@diegofrayo-pkg/types";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import AuthService from "~/features/auth";
import logger from "~/features/logger";

class AnalyticsServiceClass {
	private DISABLE_ANALYTICS_FLAG = "analytics=false";

	private AnalyticsStatus = BrowserStorageManager.createItem<AnalyticsStatus>({
		key: "DR_ANALYTICS_STATUS",
		readInitialValueFromStorage: true,
		saveDuringCreation: false,
		value: "DISABLED",
	});

	constructor() {
		autoBind(this);
	}

	shouldSkipTracking() {
		if (
			!window.rybbit ||
			isDevelopmentEnvironment() ||
			window.location.href.includes(this.DISABLE_ANALYTICS_FLAG) ||
			this.AnalyticsStatus.get() === "DISABLED"
		) {
			this.AnalyticsStatus.set("DISABLED");
			return true;
		}

		return AuthService.isUserLoggedIn();
	}

	trackPageLoaded() {
		if (this.shouldSkipTracking()) {
			logger(
				"LOG",
				`🔘 Page "${window.location.pathname}" | "${document.title}" visit was not tracked`,
			);
			return;
		}

		window.rybbit.pageview();
		logger("LOG", `🟢 Page "${window.location.pathname}" | "${document.title}" visit was tracked`);
	}

	trackEvent(name: string, data?: UtilsTypes.Object<UtilsTypes.Primitive>) {
		if (this.shouldSkipTracking()) {
			logger("LOG", `🔘 Event "${name}" was not tracked`, data);
			return;
		}

		window.rybbit.event(name, data);
		logger("LOG", `🟢 Event "${name}" was tracked`, name, data);
	}

	trackClickEvent(name: string, data?: UtilsTypes.Object<UtilsTypes.Primitive>) {
		return () => {
			this.trackEvent(name, data);
		};
	}
}

const AnalyticsService = new AnalyticsServiceClass();

export default AnalyticsService;

// --- TYPES ---

type AnalyticsStatus = "ENABLED" | "DISABLED";
