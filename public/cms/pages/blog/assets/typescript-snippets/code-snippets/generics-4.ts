// ###### Example 1 ######

type T_GetReturnType<T> = T extends (...args: any[]) => infer U ? U : never;

// ###### Example 2 ######

export function useSelector(selector: (store: T_Store) => T_StoreItemValue<T_Store>) {}

type T_StoreItemValue<G_Object> = G_Object extends { [Key in keyof G_Object as Key]: infer U }
	? U
	: never;

// ###### Example 3 ######

type T_NestedOmit<
	T extends Record<string, any>,
	KeysToOmit extends string,
> = KeysToOmit extends `${infer KeyPart1}.${infer KeyPart2}`
	? KeyPart1 extends keyof T
		? Omit<T, KeyPart1> & {
				[NewKeys in KeyPart1]: T_NestedOmit<T[NewKeys], KeyPart2>;
		  }
		: T
	: Omit<T, KeysToOmit>;
