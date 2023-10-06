import { logger } from "~/features/logging";
import { isBrowser, isServer } from "~/utils/app";
import v from "@diegofrayo/v";

export type T_LocalStorageStateConfig<G_ValueType> = {
	key: string;
	value: G_ValueType;
	saveWhenCreating?: boolean;
	readInitialValueFromStorage?: boolean;
};

export type T_LocalStorageState<G_ValueType> = {
	get: () => G_ValueType;
	set: (newValue: G_ValueType) => void;
	remove: () => void;
	exists: () => boolean;
};

const LocalStorageManager = {
	createItem: function createItem<G_ValueType>({
		key,
		value,
		saveWhenCreating = false,
		readInitialValueFromStorage = false,
	}: T_LocalStorageStateConfig<G_ValueType>) {
		if (isBrowser()) {
			const valueFromStorage = getItem({ key, type: typeof value });

			if (readInitialValueFromStorage && valueFromStorage !== null) {
				logger("LOG", "...");
			} else if (saveWhenCreating && valueFromStorage === null) {
				setItem(key, value);
			}
		}

		return {
			get: (): G_ValueType | null => {
				if (isServer()) return null;

				const valueFromStorage = getItem({ key, type: typeof value });
				return valueFromStorage === null ? value : valueFromStorage;
			},

			set: (newValue: G_ValueType) => {
				if (isServer()) return;

				setItem(key, newValue);
			},

			remove: () => {
				if (isServer()) return;

				window.localStorage.removeItem(key);
			},

			exists: () => {
				if (isServer()) return false;

				return window.localStorage.getItem(key) !== null;
			},
		} as T_LocalStorageState<G_ValueType>;
	},
};

export default LocalStorageManager;

// --- INTERNALS ---

function setItem(key: string, newValue: unknown) {
	try {
		if (v.isObject(newValue) || v.isArray(newValue)) {
			window.localStorage.setItem(key, JSON.stringify(newValue));
		} else {
			window.localStorage.setItem(key, String(newValue));
		}
	} catch (error) {
		logger("WARN", error);
		window.localStorage.removeItem(key);
	}
}

function getItem({
	key,
	type,
}: {
	key: string;
	type: string | number | boolean | unknown[] | Record<string, unknown>;
}) {
	const value = window.localStorage.getItem(key);

	try {
		if (value === null) {
			return value;
		}

		if (type === "boolean") {
			if (value === "true") return true;
			if (value === "false") return false;
		}

		if (type === "number") {
			return Number(value);
		}

		if (type === "object") {
			return JSON.parse(value);
		}

		return value;
	} catch (error) {
		logger("WARN", error);
		window.localStorage.removeItem(key);

		return value;
	}
}
