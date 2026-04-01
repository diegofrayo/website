import autoBind from "auto-bind";

import { BrowserStorageManager } from "@diegofrayo-pkg/browser-storage";
import type UtilsTypes from "@diegofrayo-pkg/types";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { AuthService } from "../auth";
import { logger } from "../logger";

class AnalyticsServiceClass {
	private isLibraryAlreadyInitialized = false;

	private DISABLE_ANALYTICS_FLAG = "analytics=false";

	private AnalyticsStatus = BrowserStorageManager.createItem<AnalyticsStatus>({
		key: "DR_ANALYTICS_STATUS",
		readInitialValueFromStorage: true,
		saveDuringCreation: false,
		value: "ENABLED",
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

	init() {
		if (this.shouldSkipTracking() || this.isLibraryAlreadyInitialized) {
			return;
		}

		this.isLibraryAlreadyInitialized = true;
	}

	trackPageLoaded() {
		if (this.shouldSkipTracking()) {
			logger(
				"LOG",
				`Page "${window.location.pathname}" | "${document.title}" visit was not tracked`,
			);
			return;
		}

		this.init();
		window.rybbit.pageview();
		logger("LOG", `Page "${window.location.pathname}" | "${document.title}" visit was tracked`);
	}

	trackClickEvent(name: string, data?: UtilsTypes.Object<UtilsTypes.Primitive>) {
		return () => {
			this.trackEvent(name, data);
		};
	}

	trackEvent(name: string, data?: UtilsTypes.Object<UtilsTypes.Primitive>) {
		if (this.shouldSkipTracking()) {
			logger("LOG", `Event "${name}" was not tracked`, data);
			return;
		}

		this.init();
		window.rybbit.event(name, data);
	}

	composeURLWithDisableFlag(route: string) {
		return `${route}?${this.DISABLE_ANALYTICS_FLAG}`;
	}

	isAnalyticsDisabled() {
		return this.AnalyticsStatus.get() === "DISABLED";
	}
}

const AnalyticsService = new AnalyticsServiceClass();

export default AnalyticsService;

// --- TYPES ---

export type AnalyticsStatus = "ENABLED" | "DISABLED";
