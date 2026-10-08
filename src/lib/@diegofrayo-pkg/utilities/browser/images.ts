export function getImageOrientation(source: string): Promise<"portrait" | "landscape" | "square"> {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = (): void => {
			if (img.naturalWidth > img.naturalHeight) {
				resolve("landscape");
				return;
			}

			if (img.naturalWidth < img.naturalHeight) {
				resolve("portrait");
				return;
			}

			resolve("square");
		};
		img.onerror = (): void => {
			reject(new Error(`Failed to load image: ${source}`));
		};
		img.src = source;
	});
}
