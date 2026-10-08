export function focusAndClickElement(element: HTMLElement): void {
	element.focus();
	element.click();
}

export function focusInputAndSelectText(element: HTMLInputElement): void {
	element.focus();
	element.select();
}

export function isElementInViewport(element: Element): boolean {
	const bounding = element.getBoundingClientRect();

	return (
		bounding.top >= 0 &&
		bounding.left >= 0 &&
		bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

export function getTargetElement<HTMLElement>(event: Event): HTMLElement {
	if (!event.target) {
		throw new Error("Target element is null unexpectedly");
	}

	return event.target as HTMLElement;
}

type InjectScriptParams = {
	src: string;
	id?: string;
	async?: boolean;
	defer?: boolean;
	attributes?: Record<string, string>;
};

export function injectScript({
	src,
	id,
	async = true,
	defer = false,
	attributes = {},
}: InjectScriptParams): Promise<HTMLScriptElement> {
	return new Promise((resolve, reject) => {
		if (id) {
			const existingScript = document.getElementById(id);

			if (existingScript instanceof HTMLScriptElement) {
				resolve(existingScript);
				return;
			}
		}

		const script = document.createElement("script");

		script.src = src;
		script.async = async;
		script.defer = defer;
		if (id) script.id = id;

		Object.entries(attributes).forEach(([name, value]) => {
			script.setAttribute(name, value);
		});

		script.onload = (): void => resolve(script);
		script.onerror = (): void => {
			script.remove();
			reject(new Error(`Failed to load script: ${src}`));
		};

		document.body.appendChild(script);
	});
}
