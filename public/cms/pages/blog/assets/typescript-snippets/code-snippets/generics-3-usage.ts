type T_MyObject = {
	a: string;
	b: number;
	c: boolean;
};

type ResultOmit1 = CustomOmit<T_MyObject, "a" | "b">;
type ResultOmit2 = CustomOmit<T_MyObject, "a" | "d">; // TS error
type ResultPick1 = CustomPick<T_MyObject, "a" | "a">;
type ResultPick2 = CustomPick<T_MyObject, "asdd">; // TS error
