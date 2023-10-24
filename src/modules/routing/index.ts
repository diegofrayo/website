import { NextRouter, useRouter } from "next/router";

import { isPWA } from "@diegofrayo/utils/browser";
import { LocalStorageManager } from "@diegofrayo/storage";

// --- CONSTANTS & TYPES ---

export const ROUTES = {
	HOME: "/",
	RESUME: "/resume",
	BLOG: "/blog",
	SIGN_IN: "/sign-in",
	APPS: "/apps",
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

		if (pathname.startsWith(ROUTES.BLOG) && pathnameParam.startsWith(ROUTES.BLOG)) {
			return true;
		}

		return false;
	}

	return { pathname, asPath, isCurrentPathActive };
}

// --- UTILITIES ---

const LS_LastPage = LocalStorageManager.createItem({
	key: "DR_LAST_PAGE",
	value: "",
	saveWhenCreating: true,
	readInitialValueFromStorage: true,
});

export function redirect(path: string): void {
	if (isPWA()) {
		LS_LastPage.set(path);
	}

	window.location.href = path;
}

export function goBack(): void {
	const urlItems = window.location.pathname.split("/");

	redirect(`${urlItems.slice(0, urlItems.length - 1).join("/")}/`);
}

export function initPWARoutingConfig(router: NextRouter): () => void {
	const lastPageVisited = LS_LastPage.get();

	if (!window.navigator.onLine) {
		return () => undefined;
	}

	if (lastPageVisited && lastPageVisited !== window.location.pathname) {
		LS_LastPage.remove();

		const BLACKLIST = [""];
		const isCurrentPageInBlacklist =
			BLACKLIST.find((item) => window.location.pathname.includes(item)) !== undefined;

		if (!isCurrentPageInBlacklist) {
			window.location.href = lastPageVisited;
		}

		return () => undefined;
	}

	const handleRouteChangeComplete = function handleRouteChangeComplete(): void {
		LS_LastPage.set(window.location.pathname);
	};

	router.events.on("routeChangeComplete", handleRouteChangeComplete);

	return () => {
		router.events.off("routeChangeComplete", handleRouteChangeComplete);
	};
}
