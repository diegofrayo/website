export function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

// NOTE: References: https://es-toolkit.slash.page/reference/util/attemptAsync.html
export async function attemptAsync<Return>(
	callback: () => Return,
): Promise<[Awaited<PromiseLike<Return>>, undefined] | [undefined, Error]> {
	try {
		const response = await callback();
		return [response, undefined];
	} catch (error) {
		return [undefined, error as Error];
	}
}

// NOTE: References: https://es-toolkit.slash.page/reference/util/attempt.html
export function attempt<Return>(callback: () => Return): [Return, undefined] | [undefined, Error] {
	try {
		const response = callback();
		return [response, undefined];
	} catch (error) {
		return [undefined, error as Error];
	}
}

export async function mapSequentially<ArrayElement, ReturnElement>(
	array: Array<ArrayElement>,
	callback: (arg: ArrayElement, index: number) => ReturnElement | Promise<ReturnElement>,
): Promise<Array<ReturnElement>> {
	const result: ReturnElement[] = [];
	let index = 0;

	for (const item of array) {
		result.push(await callback(item, index));
		index += 1;
	}

	return result;
}

export async function forEachSequentially<ArrayElement>(
	array: Array<ArrayElement>,
	callback: (arg: ArrayElement, index: number) => Promise<unknown>,
): Promise<void> {
	let index = 0;

	for (const item of array) {
		await callback(item, index);
		index += 1;
	}
}
