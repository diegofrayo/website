import { useSyncExternalStore } from "react";

function useIsMounted(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useIsMounted;

// --- UTILS ---

function subscribe(): () => void {
	return (): void => {};
}

function getSnapshot(): boolean {
	return true;
}

function getServerSnapshot(): boolean {
	return false;
}
