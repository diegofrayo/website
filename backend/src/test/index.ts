import v from "~/lib/validator";

// --- Types ---

export type T_GetFunctionArguments<F extends Function> = F extends (...args: infer A) => unknown
	? A
	: never;
export type T_TestCase<G_Arguments extends Array<unknown>, G_Return> = {
	functionName: string;
	fn: (...args: G_Arguments) => G_Return;
	cases: {
		input: G_Arguments;
		expected: G_Return | ((input: G_Arguments) => void);
	}[];
};

// --- Utils ---

export function toStringInput(input: unknown): unknown {
	return v.isObject(input) ? JSON.stringify(input) : input;
}
