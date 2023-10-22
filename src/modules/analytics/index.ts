import autoBind from "auto-bind";
import splitbee from "@splitbee/web";

import { isDevelopmentEnvironment } from "~/utils/app";
import { LocalStorageManager } from "@diegofrayo/storage";
import type DR from "@diegofrayo/types";

import { AuthService } from "../auth";
import { logger } from "../logging";

class AnalyticsServiceClass {
	constructor() {
		autoBind(this);
	}

	private isLibraryAlreadyInitialized = false;

	private DISABLE_ANALYTICS_FLAG = "analytics=false";

	private LS_AnalyticsDisabled = LocalStorageManager.createItem({
		key: "DR_ANALYTICS_DISABLED",
		value: false,
		readInitialValueFromStorage: true,
	});

	init() {
		if (this.isAnalyticsDisabled() || this.isLibraryAlreadyInitialized) {
			return;
		}

		splitbee.init();
		this.isLibraryAlreadyInitialized = true;
	}

	trackPageLoaded() {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Page "${window.location.pathname}" visit was not tracked`);
			return;
		}

		this.init();
		logger("LOG", `Page "${window.location.pathname}" visit was tracked`);
	}

	trackEvent(name: string, data: DR.Object<DR.Primitive>) {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Event "${name}" was not tracked`, data);
			return;
		}

		this.init();
		splitbee.track(name, data);
	}

	composeURLWithDisableFlag(route: string) {
		return `${route}?${this.DISABLE_ANALYTICS_FLAG}`;
	}

	isAnalyticsDisabled() {
		if (
			isDevelopmentEnvironment() ||
			window.location.href.includes(this.DISABLE_ANALYTICS_FLAG) ||
			this.LS_AnalyticsDisabled.get() === true
		) {
			this.LS_AnalyticsDisabled.set(true);
			return true;
		}

		return AuthService.isUserLoggedIn();
	}
}

const AnalyticsService = new AnalyticsServiceClass();

export default AnalyticsService;
