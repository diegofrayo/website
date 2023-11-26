type T_SortableType = string | number | boolean | Date;

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
	...criteria: (keyof T_ExtendTypeKeys<G_ItemType>)[]
): (a: G_ItemType, b: G_ItemType) => number {
	return function sortByReturn(a, b) {
		return removeDuplicates(criteria).reduce(
			(result, criteriaItem) => {
				if (result.finish) {
					return result;
				}

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
