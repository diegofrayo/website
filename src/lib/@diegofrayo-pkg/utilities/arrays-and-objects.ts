import { throwError } from "./errors";

export function createArray(length: number, start?: number): number[] {
	return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

export function keyMirror<Keys extends string, Return extends Record<Keys, Keys>>(
	elements: Keys[],
): Return {
	return elements.reduce((result, element) => ({ ...result, [element]: element }), {} as Return);
}

export function getObjectKeys<Object extends object, Return extends (keyof Object)[]>(
	object: Object,
): Return {
	return Object.keys(object) as Return;
}

export function omit<Object extends object, ObjectKeys extends keyof Object>(
	input: Object,
	keys: ObjectKeys[],
): Omit<Object, ObjectKeys> {
	const output = { ...input };

	keys.forEach((key) => {
		delete output[key];
	});

	return output;
}

export function pick<Object extends object, ObjectKeys extends keyof Object>(
	obj: Object,
	keys: ObjectKeys[],
): Pick<Object, ObjectKeys> {
	const result = {} as Pick<Object, ObjectKeys>;

	keys.forEach((key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
	});

	return result;
}

export function removeDuplicates<ItemType>(array: ItemType[]): ItemType[] {
	return array.filter((item, index) => array.indexOf(item) === index);
}

export function removeDuplicatesByKey<ItemType, ItemTypeKey extends keyof ItemType>(
	array: ItemType[],
	key: ItemTypeKey,
): ItemType[] {
	const seenItems = new Set<ItemType[ItemTypeKey]>();

	return array.filter((item) => {
		if (seenItems.has(item[key])) {
			return false;
		}

		seenItems.add(item[key]);
		return true;
	});
}

export function sortObjectKeys<Object extends object, ObjectKeys extends keyof Object>(
	object: Object,
	order: "ASC" | "DESC",
): Object {
	return Object.keys(object)
		.sort(order === "ASC" ? undefined : (a, b): number => b.localeCompare(a))
		.reduce((result, key): Object => {
			return {
				...result,
				[key]: object[key as ObjectKeys],
			};
		}, {} as Object);
}

export function getOrFail<ObjectInput extends object, ObjectKeys extends keyof ObjectInput>(
	object: ObjectInput,
	opts: { key: ObjectKeys; error: string },
): ObjectInput[ObjectKeys] {
	return object[opts.key] ?? throwError(opts.error);
}

export function chunk<Element>(elements: Element[], chunkSize: number): Array<Array<Element>> {
	const result: Element[][] = [];

	for (let i = 0; i < elements.length; i += chunkSize) {
		result.push(elements.slice(i, i + chunkSize));
	}

	return result;
}

export function shallowMerge<Target extends object>(target: Target, updates: Partial<Target>): Target {
	return { ...target, ...updates };
}
