import { useSyncExternalStore } from "react";

type UseDidMountValueParams<Value> = {
	subscribe?: (onStoreChange: () => void) => () => void;
	getSnapshot: () => Value;
	getServerSnapshot?: () => Value | null;
};

type UseDidMountValueReturn<Value> = Value | null;

function useDidMountValue<Value>(params: UseDidMountValueParams<Value>): UseDidMountValueReturn<Value> {
	return useSyncExternalStore<Value | null>(
		params.subscribe || subscribe,
		params.getSnapshot,
		params.getServerSnapshot || getServerSnapshot,
	);
}

export default useDidMountValue;

// --- UTILS ---

// NOTE: Declared outside the hook so their identity is stable, otherwise `useSyncExternalStore` resubscribes on every render
function subscribe(): () => void {
	return function unsubscribe(): void {};
}

function getServerSnapshot(): null {
	return null;
}
