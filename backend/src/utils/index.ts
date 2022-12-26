export function getEntries<G_Object>(object: G_Object) {
	return Object.entries(object) as [keyof object, T_GetObjectValue<G_Object>][];
}

// --- Types ---

type T_GetObjectValue<G_Object> = G_Object extends { [Key in keyof G_Object as Key]: infer U }
	? U
	: never;
