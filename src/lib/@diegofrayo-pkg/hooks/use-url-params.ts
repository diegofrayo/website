import { useMemo } from "react";

import useClientValue from "./use-client-value";

export default function useUrlParams(): URLSearchParams {
	const search = useClientValue({ subscribe, getSnapshot, getServerSnapshot });

	return useMemo(() => new URLSearchParams(search), [search]);
}

// --- UTILS ---

// NOTE: `popstate` only fires on browser back/forward buttons, so the Navigation API is also used to catch
// `history.pushState`/`history.replaceState` calls (e.g. client-side routers)
function subscribe(onStoreChange: () => void): () => void {
	window.addEventListener("popstate", onStoreChange);
	window.navigation?.addEventListener("currententrychange", onStoreChange);

	return function unsubscribe(): void {
		window.removeEventListener("popstate", onStoreChange);
		window.navigation?.removeEventListener("currententrychange", onStoreChange);
	};
}

function getSnapshot(): string {
	return window.location.search;
}

function getServerSnapshot(): string {
	return "";
}
