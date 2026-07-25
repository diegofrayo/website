export function getImageOrientation(source: string): Promise<"portrait" | "landscape" | "square"> {
	return new Promise((resolve) => {
		const img = new Image();

		img.src = source;
		img.onload = (): void => {
			if (img.naturalWidth > img.naturalHeight) {
				resolve("landscape");
			} else if (img.naturalWidth < img.naturalHeight) {
				resolve("portrait");
			}

			resolve("square");
		};
	});
}
