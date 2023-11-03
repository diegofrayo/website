import { isBusiness } from "@diegofrayo/types/businesses";
import { isContact } from "@diegofrayo/types/contacts";
import v from "@diegofrayo/v";

export function formatPhoneNumber(phone: string, phoneCountryCode: string) {
	const phoneCleaned = `${phone}`.replace(/\D/g, "");

	const nineDigitsMatch = phoneCleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})$/);
	if (nineDigitsMatch) {
		return `${phoneCountryCode} (${nineDigitsMatch[1]}) ${nineDigitsMatch[2]}-${nineDigitsMatch[3]}-${nineDigitsMatch[4]}`;
	}

	const tenDigitsMatch = phoneCleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	if (tenDigitsMatch) {
		return `${phoneCountryCode} (${tenDigitsMatch[1]}) ${tenDigitsMatch[2]}-${tenDigitsMatch[3]}`;
	}

	const elevenDigitsMatch = phoneCleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
	if (elevenDigitsMatch) {
		return `${phoneCountryCode} (${elevenDigitsMatch[1]}) ${elevenDigitsMatch[2]}-${elevenDigitsMatch[3]}-${elevenDigitsMatch[4]}`;
	}

	return phone;
}

export function countContacts(input: unknown): number {
	if (isContact(input) || isBusiness(InputEvent)) {
		return 1;
	}

	if (v.isArray(input)) {
		return input.length;
	}

	if (v.isObject(input)) {
		return Object.values(input).reduce((result: number, categoryContacts) => {
			return result + countContacts(categoryContacts);
		}, 0);
	}

	throw new Error(`Error counting contacts => Invalid input type: "${typeof input}"`);
}

export function parseCategoryName(input: string) {
	const items = input.split("-");

	if (items.length === 2) {
		return items[1];
	}

	return items[0];
}
