import { createArray } from "./arrays-and-objects";

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

export function removeFirstAndLastBlankLines(input: string) {
	let output = input;

	if (output.trim().startsWith("\n")) {
		output = output.trim().substring(1);
	}

	if (output.trim().endsWith("\n")) {
		output = output.trim().substring(0, output.length - 1);
	}

	return output;
}

export function createRandomString(length: number) {
	const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = CHARACTERS.length;
	let result = "";

	createArray(length).forEach(() => {
		result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
	});

	return result.toUpperCase();
}

export function addLeftPadding(number: number) {
	return `${number < 10 ? "0" : ""}${number}`;
}

// --- INTERNALS ---

function escapeRegExp(text: string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
