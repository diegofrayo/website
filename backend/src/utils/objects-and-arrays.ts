import v from "~/lib/validator";

export function getEntries<
	G_Object extends object,
	G_Return extends [keyof object, T_GetObjectValue<G_Object>][],
>(object: G_Object): G_Return {
	return Object.entries(object) as G_Return;
}

export function getByKey(object: Record<string, unknown> | unknown, path: string): unknown {
	if (!path || !v.isObject(object)) {
		return object;
	}

	const keys = path.split(".");
	const currentKey = keys[0];

	if (currentKey in object) {
		return getByKey(object[currentKey], keys.slice(1).join("."));
	}

	throw new Error(`${currentKey} does not exist in the passed object`);
}

export function createArray(length: number, start?: number): number[] {
	return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

// --- Types ---

type T_GetObjectValue<G_Object> = G_Object extends { [Key in keyof G_Object as Key]: infer U }
	? U
	: never;
