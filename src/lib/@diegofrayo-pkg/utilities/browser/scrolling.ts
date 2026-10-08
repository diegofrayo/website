import { isElementInViewport } from "./dom-elements";

export function getScrollPosition(): number {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number, behavior?: "auto" | "smooth"): void {
	window.scroll({ top: val, behavior: behavior || "smooth" });
}

export function scrollToElement(
	element_: string | Element,
	options?: { onlyIfOutsideViewport?: boolean },
): void {
	const element = typeof element_ === "string" ? document.getElementById(element_) : element_;

	if (!element) return;

	if (
		(options?.onlyIfOutsideViewport && !isElementInViewport(element)) ||
		!options?.onlyIfOutsideViewport
	) {
		element.scrollIntoView({ behavior: "smooth" });
	}
}
