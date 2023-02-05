import { NextRouter } from "next/router";

import v from "~/lib/v";
import { isPWA } from "~/utils/browser";

// --- Constants ---

export type T_RoutesKeys =
	| "HOME"
	| "ABOUT_ME"
	| "BLOG"
	| "BLOG_DETAILS"
	| "MUSIC"
	| "MUSIC_DETAILS"
	| "PERSONAL"
	| "BOOKMARKS"
	| "RESUME"
	| "SIGN_IN"
	| "SIGN_OUT"
	| "ERROR_404"
	| "ERROR_500";

export type T_RoutesValues =
	| "/"
	| "/about-me"
	| "/blog"
	| "/blog/[slug]"
	| "/music"
	| "/music/[song]"
	| "/personal"
	| "/bookmarks"
	| "/resume"
	| "/sign-in"
	| "/sign-out"
	| "/404"
	| "/500";

export const ROUTES: Readonly<Record<T_RoutesKeys, T_RoutesValues>> = {
	HOME: "/",
	ABOUT_ME: "/about-me",
	RESUME: "/resume",
	BOOKMARKS: "/bookmarks",
	BLOG: "/blog",
	BLOG_DETAILS: "/blog/[slug]",
	MUSIC: "/music",
	MUSIC_DETAILS: "/music/[song]",
	PERSONAL: "/personal",
	SIGN_IN: "/sign-in",
	SIGN_OUT: "/sign-out",
	ERROR_404: "/404",
	ERROR_500: "/500",
};

// --- Utils ---

const LOCAL_STORAGE_KEY = "DFR_LAST_PAGE";

export function redirect(path: string): void {
	if (isPWA()) {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, path);
	}

	window.location.href = path;
}

export function initPWARoutingConfig(router: NextRouter): () => void {
	const lastPageVisited = window.localStorage.getItem(LOCAL_STORAGE_KEY);

	if (v.isNotTrue(window.navigator.onLine)) {
		return () => undefined;
	}

	if (
		v.isNotEmptyString(lastPageVisited) &&
		v.isNotEquals(lastPageVisited, window.location.pathname)
	) {
		window.localStorage.removeItem(LOCAL_STORAGE_KEY);

		const BLACKLIST = ["/lgy/"];
		const isCurrentPageInBlacklist =
			BLACKLIST.find((item) => window.location.pathname.includes(item)) !== undefined;

		if (v.isNotTrue(isCurrentPageInBlacklist)) {
			window.location.href = lastPageVisited;
		}

		return () => undefined;
	}

	const handleRouteChangeComplete = function handleRouteChangeComplete(): void {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, window.location.pathname);
	};

	router.events.on("routeChangeComplete", handleRouteChangeComplete);

	return () => {
		router.events.off("routeChangeComplete", handleRouteChangeComplete);
	};
}

export function goBack(): void {
	const urlItems = window.location.pathname.split("/");

	redirect(`${urlItems.slice(0, urlItems.length - 1).join("/")}/`);
}
