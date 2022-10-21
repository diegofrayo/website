import type { T_UnknownObject, T_Primitive } from "~/types";

import { or } from "./fp";
import { between } from "./numbers";
import {
	isBoolean,
	isNotTrue,
	isNull,
	isNumber,
	isObject,
	isString,
	isTrue,
	isUndefined,
} from "./validations";

export function transformObjectKeysFromSnakeCaseToLowerCamelCase<G_Result = T_UnknownObject>(
	object: T_UnknownObject,
): G_Result {
	return transformObjectKeysFromSnakeCaseToLowerCamelCasePrivate(object) as G_Result;
}

export function mirror<G_Variant extends string>(
	elements: readonly G_Variant[],
): Record<G_Variant, G_Variant> {
	return elements.reduce(
		(result, element) => ({ ...result, [element]: element }),
		{} as Record<G_Variant, G_Variant>,
	);
}

export function createArray(length: number, start?: number): number[] {
	return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

export function getRandomItem<G_ItemType>(array: G_ItemType[]): G_ItemType {
	return array[between(0, array.length - 1)];
}

type T_SortableType = string | number | boolean | Date;

export function sortPlainArray(
	order: "asc" | "desc",
): (a: T_SortableType, b: T_SortableType) => number {
	return function sortByReturn(a, b) {
		const greater = order === "desc" ? -1 : 1;
		const smaller = order === "desc" ? 1 : -1;
		const aParam = a;
		const bParam = b;

		if (aParam > bParam) {
			return greater;
		}

		if (aParam < bParam) {
			return smaller;
		}

		return 0;
	};
}

type T_PickSortableAttributes<G_Type> = {
	[Key in keyof G_Type as G_Type[Key] extends T_SortableType ? Key : never]: G_Type[Key];
};

type T_ExtendTypeKeys<G_Type> = {
	[Key in keyof T_PickSortableAttributes<G_Type>]: G_Type[Key];
} & {
	[Key in keyof T_PickSortableAttributes<G_Type> as Key extends string
		? `-${Key}`
		: never]: G_Type[Key];
};

// asc  = 1...5  |  "title"
// desc = 5...1  |  "-title"
export function sortBy<G_ItemType>(
	...criteria: (keyof {
		[Key in keyof T_ExtendTypeKeys<G_ItemType>]: string;
	})[]
): (a: G_ItemType, b: G_ItemType) => number {
	return function sortByReturn(a, b) {
		return removeDuplicates(criteria).reduce(
			(result, criteriaItem) => {
				if (result.finish) {
					return result;
				}

				// WARN (as)
				const attribute = (criteriaItem as string).replace("-", "") as keyof G_ItemType;
				const order = (criteriaItem as string).startsWith("-") ? "desc" : "asc";
				const greater = order === "desc" ? -1 : 1;
				const smaller = order === "desc" ? 1 : -1;
				const aParam = a[attribute];
				const bParam = b[attribute];

				if (isBoolean(aParam) && isBoolean(bParam)) {
					if (isTrue(aParam) && isNotTrue(bParam)) {
						return { result: greater, finish: true };
					}

					if (isNotTrue(aParam) && isTrue(bParam)) {
						return { result: smaller, finish: true };
					}

					return result;
				}

				if (aParam > bParam) {
					return { result: greater, finish: true };
				}

				if (aParam < bParam) {
					return { result: smaller, finish: true };
				}

				return result;
			},
			{ result: 0, finish: false },
		).result;
	};
}

// --- Private ---

function removeDuplicates<G_ItemType>(array: G_ItemType[]): G_ItemType[] {
	return array.filter((item, index) => array.indexOf(item) === index);
}

function convertSnakeCaseToLowerCamelCase(str: string): string {
	return str
		.split("_")
		.map((item: string, index: number) =>
			index === 0 ? item : item[0].toUpperCase() + item.substring(1),
		)
		.join("")
		.trim();
}

function isPrimitiveValue(value: unknown): value is T_Primitive {
	return or(value, [isUndefined, isNumber, isNull, isString, isBoolean]);
}

function transformObjectKeysFromSnakeCaseToLowerCamelCasePrivate(
	object: T_UnknownObject | T_Primitive,
): T_UnknownObject | T_Primitive {
	if (isPrimitiveValue(object)) {
		return object;
	}

	return Object.entries(object).reduce((result, [key, value]) => {
		const transformedKey = convertSnakeCaseToLowerCamelCase(key);

		if (isPrimitiveValue(value)) {
			return {
				...result,
				[transformedKey]: value,
			};
		}

		if (Array.isArray(value)) {
			return {
				...result,
				[transformedKey]: value.map(transformObjectKeysFromSnakeCaseToLowerCamelCase),
			};
		}

		if (isObject(value)) {
			return {
				...result,
				[transformedKey]: transformObjectKeysFromSnakeCaseToLowerCamelCase(value),
			};
		}

		return result;
	}, {} as T_UnknownObject);
}
