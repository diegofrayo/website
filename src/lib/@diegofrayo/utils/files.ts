import * as fs from "fs";
import path from "path";

import v from "../v";

export function writeFile(filePath: string, data: unknown) {
	prepareFilePathFolder(filePath);
	fs.writeFileSync(filePath, typeof data === "string" ? data : JSON.stringify(data));
}

export function readFile(filePath: string) {
	return fs.readFileSync(filePath).toString();
}

export function copyFolder(sourcePath: string, targetPath: string): void {
	const targetFolder = path.resolve(targetPath, path.basename(sourcePath));

	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder, { recursive: true });
	}

	if (fs.lstatSync(sourcePath).isDirectory()) {
		const files = fs.readdirSync(sourcePath);
		files.forEach((fileName) => {
			const filePath = path.resolve(sourcePath, fileName);

			if (fs.lstatSync(filePath).isDirectory()) {
				copyFolder(filePath, targetFolder);
			} else {
				copyFile(filePath, { outputFolderPath: targetFolder });
			}
		});
	}
}

export function copyFile(
	filePath: string,
	opts: { outputFolderPath: string; outputFileName?: string },
): void {
	prepareFilePathFolder(opts.outputFolderPath, true);

	fs.copyFileSync(
		filePath,
		path.resolve(opts.outputFolderPath, opts.outputFileName || path.basename(filePath)),
	);
}

export type T_CustomFile = {
	filePath: string;
	fileName: string;
	baseName: string;
	stats: fs.Stats;
	ext: string;
	isDirectory: boolean;
};

export function readFolderFiles(
	sourceFolderPath: string,
	opts?: {
		includeDirectories?: boolean;
		includeTheseExtensions?: string[];
		includeMediaFiles?: boolean;
		recursive?: boolean;
	},
): T_CustomFile[] {
	return fs.readdirSync(sourceFolderPath).reduce((result: T_CustomFile[], fileName) => {
		const filePath = path.resolve(sourceFolderPath, fileName);
		const stats = fs.statSync(filePath);
		const { ext, name } = path.parse(filePath);
		const file = {
			filePath,
			fileName,
			baseName: name,
			stats,
			ext: ext.toLowerCase().slice(1),
			isDirectory: stats.isDirectory(),
		};

		if (opts?.recursive && file.isDirectory) {
			return [...result, ...readFolderFiles(file.filePath, opts)];
		}

		if (
			!opts ||
			(opts.includeDirectories && file.isDirectory) ||
			(opts.includeMediaFiles && isMediaFile(file.ext)) ||
			(v.isArray(opts.includeTheseExtensions) && opts.includeTheseExtensions.includes(file.ext))
		) {
			return result.concat([file]);
		}

		return result;
	}, []);
}

export function createFolder(outputFolderPath: string): void {
	fs.mkdirSync(outputFolderPath, { recursive: true });
}

export function fileExists(filePath: string) {
	return fs.existsSync(filePath);
}

export function renameFile(
	currentFilePath: string,
	opts: { newFilePath?: string; newFileName?: string },
) {
	if (opts.newFilePath) {
		fs.renameSync(currentFilePath, opts.newFilePath);
	} else if (opts.newFileName) {
		fs.renameSync(currentFilePath, path.resolve(path.dirname(currentFilePath), opts.newFileName));
	} else {
		throw new Error("Wrong 'opts' param passed in 'renameFile' function");
	}
}

export function isMediaFile(extension: string) {
	return ["jpg", "jpeg", "png", "gif", "heic", "mp4", "webp", "avif"].includes(
		extension.toLowerCase(),
	);
}

export function prepareFilePathFolder(filePath: string, isDirectory?: boolean) {
	const folderPath = isDirectory ? filePath : path.dirname(filePath);

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}
}

export function deleteFolder(folderPath: string) {
	fs.rmSync(folderPath, { recursive: true, force: true });
}
