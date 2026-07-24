// --- USUAL FP FUNCTIONS ---

type Step<Input, Output> = (input: Input) => Output;

export function pipe<Input, A>(input: Input, functions: [Step<Input, A>]): A;
export function pipe<Input, A, B>(input: Input, functions: [Step<Input, A>, Step<A, B>]): B;
export function pipe<Input, A, B, C>(
	input: Input,
	functions: [Step<Input, A>, Step<A, B>, Step<B, C>],
): C;
export function pipe<Input, A, B, C, D>(
	input: Input,
	functions: [Step<Input, A>, Step<A, B>, Step<B, C>, Step<C, D>],
): D;
export function pipe<Input, A, B, C, D, E>(
	input: Input,
	functions: [Step<Input, A>, Step<A, B>, Step<B, C>, Step<C, D>, Step<D, E>],
): E;
export function pipe<Input, A, B, C, D, E, F>(
	input: Input,
	functions: [Step<Input, A>, Step<A, B>, Step<B, C>, Step<C, D>, Step<D, E>, Step<E, F>],
): F;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pipe(input: any, functions: Step<any, any>[]): any {
	return functions.reduce((currentResult, nextFunction) => {
		return nextFunction(currentResult);
	}, input);
}

type AsyncStep<Input, Output> = (input: Input) => Promise<Output> | Output;

export function pipeAsync<Input, A>(input: Input, functions: [AsyncStep<Input, A>]): Promise<A>;
export function pipeAsync<Input, A, B>(
	input: Input,
	functions: [AsyncStep<Input, A>, AsyncStep<A, B>],
): Promise<B>;
export function pipeAsync<Input, A, B, C>(
	input: Input,
	functions: [AsyncStep<Input, A>, AsyncStep<A, B>, AsyncStep<B, C>],
): Promise<C>;
export function pipeAsync<Input, A, B, C, D>(
	input: Input,
	functions: [AsyncStep<Input, A>, AsyncStep<A, B>, AsyncStep<B, C>, AsyncStep<C, D>],
): Promise<D>;
export function pipeAsync<Input, A, B, C, D, E>(
	input: Input,
	functions: [
		AsyncStep<Input, A>,
		AsyncStep<A, B>,
		AsyncStep<B, C>,
		AsyncStep<C, D>,
		AsyncStep<D, E>,
	],
): Promise<E>;
export function pipeAsync<Input, A, B, C, D, E, F>(
	input: Input,
	functions: [
		AsyncStep<Input, A>,
		AsyncStep<A, B>,
		AsyncStep<B, C>,
		AsyncStep<C, D>,
		AsyncStep<D, E>,
		AsyncStep<E, F>,
	],
): Promise<F>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pipeAsync(input: any, functions: AsyncStep<any, any>[]): Promise<any> {
	return functions.reduce(async (currentPromise, nextFunction) => {
		const resolvedValue = await currentPromise;
		return nextFunction(resolvedValue);
	}, Promise.resolve(input));
}

// --- UTILS ---

export const is = <Input>(input: Input, options: Input[]): boolean => {
	return options.includes(input);
};

// --- ARRAY UTILITIES ---

export const map =
	<ArrayElement, ReturnElement = ArrayElement>(
		mapper: (element: ArrayElement) => ReturnElement,
	): ((arr: ArrayElement[]) => ReturnElement[]) =>
	(arr: ArrayElement[]): ReturnElement[] =>
		arr.map(mapper);

export const filter =
	(predicate: () => boolean): (<ArrayElement>(arr: ArrayElement[]) => ArrayElement[]) =>
	<ArrayElement>(arr: ArrayElement[]): ArrayElement[] =>
		arr.filter(predicate);

export const slice =
	<ArrayElement>(...args: number[]): ((arr: ArrayElement[]) => ArrayElement[]) =>
	(arr: ArrayElement[]): ArrayElement[] =>
		arr.slice(...args);

export const join =
	(string: string): (<ArrayElement>(arr: ArrayElement[]) => string) =>
	<ArrayElement>(arr: ArrayElement[]): string =>
		arr.join(string);

export const sort =
	<ArrayElement>(
		sortFn: (a: ArrayElement, b: ArrayElement) => number,
	): ((arr: ArrayElement[]) => ArrayElement[]) =>
	(arr: ArrayElement[]): ArrayElement[] =>
		[...arr].sort(sortFn);

export const push =
	<ArrayElement>(element: ArrayElement): ((arr: ArrayElement[]) => ArrayElement[]) =>
	(arr: ArrayElement[]): ArrayElement[] =>
		[...arr].concat([element]);

export const unshift =
	<ArrayElement>(element: ArrayElement): ((arr: ArrayElement[]) => ArrayElement[]) =>
	(arr: ArrayElement[]): ArrayElement[] =>
		[element].concat(arr);

export const get = <ArrayElement>(arr: ArrayElement[], index: number): ArrayElement | undefined =>
	arr[index];

export const removeLastItem = <ArrayElement>(arr: ArrayElement[]): ArrayElement[] =>
	arr.slice(0, arr.length - 1);
