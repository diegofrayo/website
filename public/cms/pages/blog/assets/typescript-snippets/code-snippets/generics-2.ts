function pick<G_Object, G_ObjectKeys extends keyof G_Object>(
	obj: G_Object,
	keys: G_ObjectKeys[],
): Pick<G_Object, G_ObjectKeys> {
	const result = {} as Pick<G_Object, G_ObjectKeys>;

	keys.forEach((key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
	});

	return result;
}

function stringifyObjectKeyValues<
	G_ObjectShape extends Record<string, number | boolean>,
	G_Return extends { [K in keyof G_ObjectShape]: string },
>(input: G_ObjectShape): G_Return {
	return Object.entries(input).reduce((result, [key, value]) => {
		return {
			...result,
			[key]: String(value),
		};
	}, {} as G_Return);
}

function mirror<G_Keys extends string, G_Return extends Record<G_Keys, G_Keys>>(
	elements: G_Keys[],
): G_Return {
	return elements.reduce((result, element) => ({ ...result, [element]: element }), {} as G_Return);
}
