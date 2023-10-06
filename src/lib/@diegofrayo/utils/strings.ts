import { createArray } from "./arrays-and-objects";

// --- PUBLIC FUNCTIONS ---

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

// --- PRIVATE FUNCTIONS ---

function escapeRegExp(text: string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
