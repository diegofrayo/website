// --- JS ---

export type T_SetTimeout = NodeJS.Timeout;

// --- Data ---

export type T_Primitive = string | number | boolean | null;

export type T_JSON = T_GenericObject<
	string | number | boolean | null | T_JSON[] | { [key: string]: T_JSON }
>;

// --- Objects ---

export type T_Object<G_Type = unknown> = T_GenericObject<G_Type>;

type T_GenericObject<G_Type = unknown> = Record<string | number | symbol, G_Type>;
