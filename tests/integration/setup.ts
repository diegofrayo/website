import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/**
 * jsdom doesn't implement HTMLDialogElement.showModal()/close(), which the
 * `Modal` primitive relies on. Polyfill them so components using `<dialog>`
 * can be exercised in tests.
 */
if (!window.HTMLDialogElement.prototype.showModal) {
	window.HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
		this.open = true;
	};

	window.HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
		this.open = false;
		this.dispatchEvent(new Event("close"));
	};
}

/**
 * jsdom doesn't implement `window.matchMedia`, which some browser-detection
 * utilities (e.g. `isPWA`) rely on.
 */
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});
