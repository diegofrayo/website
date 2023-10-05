import autoBind from "auto-bind";

class AnalyticsService {
	constructor() {
		autoBind(this);
	}

	init(): void {}

	trackPageLoaded(): void {}

	trackEvent(eventName: unknown, eventData: unknown): void {
		console.log(eventName, eventData);
	}

	isAnalyticsDisabled(): boolean {
		return true;
	}
}

export default new AnalyticsService();
