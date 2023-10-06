export function createArray(length: number, start?: number): number[] {
	return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

export function mirror<G_Keys extends string, G_Return extends Record<G_Keys, G_Keys>>(
	elements: G_Keys[],
): G_Return {
	return elements.reduce((result, element) => ({ ...result, [element]: element }), {} as G_Return);
}

export function getObjectKeys<G_Object extends object, G_Return extends (keyof G_Object)[]>(
	object: G_Object,
): G_Return {
	return Object.keys(object) as G_Return;
}

export function omit<G_Object extends object, G_ObjectKeys extends keyof G_Object>(
	input: G_Object,
	keys: G_ObjectKeys[],
): Omit<G_Object, G_ObjectKeys> {
	const output = { ...input };

	keys.forEach((key) => {
		delete output[key];
	});

	return output;
}

export function removeDuplicates<G_ItemType>(array: G_ItemType[]): G_ItemType[] {
	return array.filter((item, index) => array.indexOf(item) === index);
}
