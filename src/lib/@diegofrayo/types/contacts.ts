import { type Input, object, string, union, array, enumType, email, optional } from "valibot";
import v from "../v";

export type T_ContactsData = Record<string, T_Contact[] | { [key: string]: T_ContactsData }>;

export const ContactSchema = object({
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
	email: union([string([email()]), string()]),
	country: enumType([
		"AR",
		"BR",
		"CA",
		"CO",
		"FR",
		"GB",
		"ISR",
		"IT",
		"MX",
		"NI",
		"PE",
		"PY",
		"SP",
		"SW",
		"USA",
		"UY",
	]),
	notes: optional(string()),
});

export type T_Contact = Input<typeof ContactSchema>;

export function isContact(input: unknown): input is T_Contact {
	return v.isObject(input) && v.isString(input["email"]);
}
