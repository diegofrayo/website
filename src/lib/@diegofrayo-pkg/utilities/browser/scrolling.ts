import { isString } from "../../validator";
import { isElementInViewport } from "./dom-elements";

export function getScrollPosition() {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number, behavior?: "auto" | "smooth") {
	window.scroll({ top: val, behavior: behavior || "smooth" });
}

export function goToElement(
	element_: string | Element,
	options?: { onlyIfElementIsOutsideViewport?: boolean },
) {
	const element = isString(element_) ? document.getElementById(element_) : element_;

	if (!element) return;

	if (
		(options?.onlyIfElementIsOutsideViewport && !isElementInViewport(element)) ||
		!options?.onlyIfElementIsOutsideViewport
	) {
		element.scrollIntoView({ behavior: "smooth" });
	}
}
