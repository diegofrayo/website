import { isBrowser, isServer } from "../utils/misc";
import v from "../v";

type T_Storage = "sessionStorage" | "localStorage";

export type T_BrowserStorageStateConfig<G_ValueType> = {
	key: string;
	value: G_ValueType;
	saveWhenCreating?: boolean;
	readInitialValueFromStorage?: boolean;
	storage?: T_Storage;
};

export type T_BrowserStorageState<G_ValueType> = {
	get: () => G_ValueType;
	set: (newValue: G_ValueType) => void;
	remove: () => void;
	exists: () => boolean;
};

const BrowserStorageManager = {
	createItem: function createItem<G_ValueType>({
		key,
		value,
		saveWhenCreating = false,
		readInitialValueFromStorage = false,
		storage = "localStorage",
	}: T_BrowserStorageStateConfig<G_ValueType>) {
		if (isBrowser()) {
			const valueFromStorage = getItem({ key, type: typeof value, storage });

			if (readInitialValueFromStorage && valueFromStorage !== null) {
				console.log("...");
			} else if (saveWhenCreating && valueFromStorage === null) {
				setItem(key, value, storage);
			}
		}

		return {
			get: (): G_ValueType | null => {
				if (isServer()) return null;

				const valueFromStorage = getItem({ key, type: typeof value, storage });
				return valueFromStorage === null ? value : valueFromStorage;
			},

			set: (newValue: G_ValueType) => {
				if (isServer()) return;

				setItem(key, newValue, storage);
			},

			remove: () => {
				if (isServer()) return;

				window[storage].removeItem(key);
			},

			exists: () => {
				if (isServer()) return false;

				return window[storage].getItem(key) !== null;
			},
		} as T_BrowserStorageState<G_ValueType>;
	},
};

export default BrowserStorageManager;

// --- INTERNALS ---

function setItem(key: string, newValue: unknown, storage: T_Storage) {
	try {
		if (v.isObject(newValue) || v.isArray(newValue)) {
			window[storage].setItem(key, JSON.stringify(newValue));
		} else {
			window[storage].setItem(key, String(newValue));
		}
	} catch (error) {
		console.warn(error);
		window[storage].removeItem(key);
	}
}

function getItem({
	key,
	type,
	storage,
}: {
	key: string;
	type: string | number | boolean | unknown[] | Record<string, unknown>;
	storage: T_Storage;
}) {
	const value = window[storage].getItem(key);

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
		console.warn(error);
		window[storage].removeItem(key);

		return value;
	}
}
