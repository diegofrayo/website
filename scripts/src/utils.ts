import * as fs from "fs";
import path from "path";

// --- FILES ---

export const PATHS = {
	OUTPUT_FOLDER: "./scripts/.output",
	MODULES_FOLDER: "./scripts/src/scripts",
};

export function writeFile(filePath: string, data: unknown) {
	prepareFilePathFolder(filePath);
	fs.writeFileSync(filePath, typeof data === "string" ? data : JSON.stringify(data));
}

export function readFile(filePath: string) {
	return fs.readFileSync(filePath).toString();
}

export function copyFile(filePath: string, outputFolderPath: string): void {
	prepareFilePathFolder(filePath);
	fs.copyFileSync(filePath, path.join(outputFolderPath, path.basename(filePath)));
}

export function copyFolder(sourcePath: string, targetPath: string): void {
	const targetFolder = path.join(targetPath, path.basename(sourcePath));

	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder, { recursive: true });
	}

	if (fs.lstatSync(sourcePath).isDirectory()) {
		const files = fs.readdirSync(sourcePath);
		files.forEach((fileName) => {
			const filePath = path.join(sourcePath, fileName);

			if (fs.lstatSync(filePath).isDirectory()) {
				copyFolder(filePath, targetFolder);
			} else {
				copyFile(filePath, targetFolder);
			}
		});
	}
}

function prepareFilePathFolder(filePath: string) {
	if (!fs.existsSync(path.dirname(filePath))) {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
	}
}

// --- STRINGS ---

export function replaceAll(str: string, toReplace: string, replacement: string) {
	return str.replace(new RegExp(escapeRegExp(toReplace), "g"), replacement);
}

export function removeFirstAndLastBlankLines(input: string) {
	let output = input;

	if (output.startsWith("\n")) {
		output = output.substring(1);
	}

	if (output.endsWith("\n")) {
		output = output.substring(0, output.length - 1);
	}

	return output;
}

// --- MISC ---

export function throwError(message: string) {
	throw new Error(message);
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;

	return "Unknown error";
}

// --- INTERNALS ---

function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
