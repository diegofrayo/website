import autoBind from "auto-bind";
import splitbee from "@splitbee/web";

import { AuthService } from "~/features/auth";
import { logger } from "~/features/logging";
import LocalStorageManager from "@diegofrayo/utils/local-storage";
import type DR from "@diegofrayo/types";

class AnalyticsServiceClass {
	constructor() {
		autoBind(this);
	}

	private isLibraryAlreadyInitialized = false;

	private LS_AnalyticsDisabled = LocalStorageManager.createItem({
		key: "DFR_ANALYTICS_DISABLED",
		value: false,
		readInitialValueFromStorage: true,
	});

	init(): void {
		if (this.isAnalyticsDisabled() || this.isLibraryAlreadyInitialized) {
			return;
		}

		splitbee.init();
		this.isLibraryAlreadyInitialized = true;
	}

	trackPageLoaded(): void {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Page "${window.location.pathname}" visit was not tracked`);
			return;
		}

		this.init();
		logger("LOG", `Page "${window.location.pathname}" visit was tracked`);
	}

	trackEvent(name: string, data: DR.Object<DR.Primitive>): void {
		if (this.isAnalyticsDisabled()) {
			logger("LOG", `Event "${name}" was not tracked`, data);
			return;
		}

		this.init();
		splitbee.track(name, data);
	}

	isAnalyticsDisabled(): boolean {
		if (
			new URLSearchParams(window.location.search).get("analytics") === "false" ||
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
