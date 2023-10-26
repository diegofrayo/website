import { type Input, object, string, union, array, url, length, enumType } from "valibot";
import v from "../v";

export type T_BusinessesData = {
	places: T_Business[];
	categories: T_CategoriesBusinesses;
};

export type T_CategoriesBusinesses = Record<
	string,
	T_Business[] | { [key: string]: T_CategoriesBusinesses }
>;

export const BusinessSchema = object({
	id: string(),
	name: string(),
	phone: union([
		string(),
		array(
			object({
				label: string(),
				value: string(),
			}),
		),
	]),
	instagram: string(),
	menu: union([string([length(0)]), string([url()])]),
	maps: union([string([length(0)]), string([url()])]),
	country: enumType(["CO"]),
});

export type T_Business = Input<typeof BusinessSchema>;

export function isBusiness(input: unknown): input is T_Business {
	return v.isObject(input) && v.isNotEmptyString(input["name"]);
}
