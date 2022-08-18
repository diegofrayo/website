import { createArray } from "./objects-and-arrays";

export function convertToCapitalLetter(str: string): string {
	return str
		.split(" ")
		.map((item) => (item ? item[0].toUpperCase() + item.substring(1) : ""))
		.join(" ")
		.trim();
}

export function generateSlug(str: string): string {
	let result = str.replace(/^\s+|\s+$/g, "").toLowerCase();

	result = removeAccents(result)
		.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // collapse whitespace and replace by -
		.replace(/-+/g, "-"); // collapse dashes

	return result;
}

export function removeAccents(input: string): string {
	const FROM = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	const TO = "aaaaeeeeiiiioooouuuunc------";
	let result = input;

	createArray(FROM.length).forEach((i) => {
		result = replaceAll(result, FROM.charAt(i), TO.charAt(i));
	});

	return result;
}

export function replaceAll(str: string, toReplace: string | string[], replacement: string): string {
	if (Array.isArray(toReplace)) {
		return toReplace.reduce(
			(result, item) => result.replace(new RegExp(escapeRegExp(item), "g"), replacement),
			str,
		);
	}

	return str.replace(new RegExp(escapeRegExp(toReplace), "g"), replacement);
}

export function pluralize(value: number, singular: string, plural: string): string {
	return value === 1 ? `${value} ${singular}` : `${value} ${plural}`;
}

export function createRandomString(length: number): string {
	const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = CHARACTERS.length;
	let result = "";

	createArray(length).forEach(() => {
		result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
	});

	return result.toUpperCase();
}

// --- Private functions ---

function escapeRegExp(text: string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/*
function generateObjectKeyInUpperCase(url: string): string {
  return url.toUpperCase().replace(/-+/g, "_");
}

function generateObjectKeyInLowerCase(url: string): string {
  return url.toLowerCase().replace(/-+/g, "_");
}
*/
