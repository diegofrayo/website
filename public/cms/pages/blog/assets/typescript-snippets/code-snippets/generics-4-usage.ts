// ###### Example 1 ######

function someFunction() {
	return true;
}

type T_ReturnTypeOfSomeFunction1 = T_GetReturnType<typeof someFunction>; // boolean
type T_ReturnTypeOfSomeFunction2 = T_GetReturnType<"string">; // never

// ###### Example 2 ######

type T_SomeType = {
	a: {
		b: string;
		c: {
			d: number;
			e: string[];
		};
		f: number;
	};
	g: number | string;
	h: {
		i: string;
		j: number;
	};
	k: {
		l: number;
	};
};

type T_Result = T_NestedOmit<T_SomeType, "a.zede3" | "a.c.e" | "h.i" | "k">;

/*
// Output
type T_SomeType = {
	a: {
		b: string;
		c: {
			d: number;
		};
		f: number;
	};
	g: number | string;
	h: {
		j: number;
	};
};
*/
