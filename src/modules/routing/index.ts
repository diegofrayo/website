import { NextRouter, useRouter } from "next/router";

import { BrowserStorageManager } from "@diegofrayo/storage";
import { isPWA } from "@diegofrayo/utils/browser";

// --- CONSTANTS & TYPES ---

export const ROUTES = {
	HOME: "/",
	RESUME: "/resume",
	BLOG: "/blog",
	SIGN_IN: "/sign-in",
	APPS: "/apps",
	KORDZ: "/kordz",
} as const;

export type T_RoutesKeys = keyof typeof ROUTES;

export type T_RoutesValues = (typeof ROUTES)[T_RoutesKeys];

// --- HOOKS ---

type T_UseRoutingReturn = {
	pathname: string;
	asPath: string;
	isCurrentPathActive: (pathnameParam: string) => boolean;
};

export function useRouting(): T_UseRoutingReturn {
	// --- HOOKS ---
	const { pathname, asPath } = useRouter();

	// --- API ---
	function isCurrentPathActive(pathnameParam: string): boolean {
		if (pathname === pathnameParam || asPath === pathnameParam) {
			return true;
		}

		if (
			(pathname.startsWith(ROUTES.BLOG) && pathnameParam.startsWith(ROUTES.BLOG)) ||
			(pathname.startsWith(ROUTES.APPS) && pathnameParam.startsWith(ROUTES.APPS)) ||
			(pathname.startsWith(ROUTES.KORDZ) && pathnameParam.startsWith(ROUTES.KORDZ))
		) {
			return true;
		}

		return false;
	}

	return { pathname, asPath, isCurrentPathActive };
}

// --- UTILS ---

const BS_LastPageVisited = BrowserStorageManager.createItem({
	key: "DR_LAST_PAGE_VISITED",
	value: "",
	saveWhenCreating: false,
	readInitialValueFromStorage: true,
});

const BS_NoRedirectionsYet = BrowserStorageManager.createItem({
	key: "DR_NO_REDIRECTIONS_YET",
	value: true,
	saveWhenCreating: true,
	readInitialValueFromStorage: true,
	storage: "sessionStorage",
});

export function redirect(path: string) {
	if (isPWA()) {
		BS_LastPageVisited.set(path);
	}

	window.location.href = path;
}

export function goBack() {
	const urlItems = window.location.pathname.split("/").filter(Boolean);

	redirect(`/${urlItems.slice(0, urlItems.length - 1).join("/")}`);
}

export function initPWARoutingConfig(router: NextRouter): () => void {
	const lastPageVisited = BS_LastPageVisited.get();

	if (!window.navigator.onLine) {
		return () => undefined;
	}

	if (
		BS_NoRedirectionsYet.get() === true &&
		window.location.pathname === ROUTES.HOME &&
		lastPageVisited &&
		lastPageVisited !== window.location.pathname
	) {
		BS_NoRedirectionsYet.set(false);
		window.location.href = lastPageVisited;

		return () => undefined;
	}

	const handleRouteChangeComplete = function handleRouteChangeComplete() {
		BS_LastPageVisited.set(window.location.pathname);
	};

	router.events.on("routeChangeComplete", handleRouteChangeComplete);

	return () => {
		router.events.off("routeChangeComplete", handleRouteChangeComplete);
	};
}
