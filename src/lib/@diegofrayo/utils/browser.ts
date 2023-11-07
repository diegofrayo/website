import v from "../v";

export function isConfirmAlertAccepted(message: string) {
	return window.confirm(message);
}

export function isPWA() {
	/* WARN:
	 * I ignore this because I'm accessing to a untyped attribute
	 * (navigator.standalone) on navigator object.
	 * This code is irrelevant, i'm not going to try to fix this
	 */
	// @ts-ignore
	const isStandaloneModeActive = window.navigator.standalone;

	return isStandaloneModeActive || window.matchMedia("(display-mode: standalone)").matches;
}

export async function copyToClipboard(text: string): Promise<void> {
	try {
		if (v.isUndefined(navigator.clipboard)) {
			throw new Error("Clipboard not supported");
		}

		if (v.isEmptyString(text)) {
			throw new Error("Any text was selected to copy");
		}

		await navigator.clipboard.writeText(text);
	} catch (error) {
		console.error(error);
	}
}

export function isMobileDevice() {
	/* WARN:
	 * I ignore this because I'm accessing to a untyped attribute
	 * (window.opera) on window object.
	 * This code is irrelevant, i'm not going to try to fix this
	 */
	// @ts-ignore
	const navigatorDetails = navigator.userAgent || navigator.vendor || window.opera;
	const isMobileResult = (function checker(input: string): boolean {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				input,
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
				input.substring(0, 4),
			)
		) {
			return true;
		}

		return false;
	})(navigatorDetails);

	return isMobileResult;
}

export function getScrollPosition() {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number, behavior?: "auto") {
	window.scroll({ top: val, behavior: behavior || "smooth" });
}

export function focusElement(element: HTMLElement) {
	element.focus();
	element.click();
}

export function focusInputAndSelectText(element: HTMLInputElement) {
	element.focus();
	element.select();
}

export function isSmallScreen() {
	return getScreenSize() === "XS";
}

export function getScreenSize(): "XS" | "SM" | "MD" | "LG" | "XL" {
	const width = window.innerWidth;

	if (width < 640) {
		return "XS";
	}

	if (width < 768) {
		return "SM";
	}

	if (width < 1024) {
		return "MD";
	}

	if (width < 1280) {
		return "LG";
	}

	return "XL";
}

export function is_iOS_AndMobileDevice() {
	/* WARN:
	 * I ignore this because I'm accessing to a untyped attribute
	 * (navigator.userAgentData) on navigator object.
	 * This code is irrelevant, i'm not going to try to fix this
	 */
	// @ts-ignore
	const browserPlatform = window.navigator.userAgentData?.platform || window.navigator.platform;
	const isIpadWithIOS13 = navigator.userAgent.includes("Mac") && "ontouchend" in document;
	const APPLE_DEVICES_NAMES = [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod",
	];

	return APPLE_DEVICES_NAMES.includes(browserPlatform) || isIpadWithIOS13;
}

export function getAndroidVersion() {
	try {
		const ua: string = navigator.userAgent.toLowerCase();
		const match: RegExpMatchArray | null = ua.match(/android\s([0-9.]*)/);

		if (!match) throw new Error();

		return parseFloat(match[1]);
	} catch (error) {
		return -1;
	}
}

export function isAndroid() {
	return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

export async function deletePWACache() {
	const cacheKeys = await window.caches.keys();

	return Promise.all(
		cacheKeys.map((key) => {
			return window.caches.delete(key);
		}),
	);
}

export async function downloadComponentAsImage(
	componentRef: HTMLElement,
	fileName: string,
): Promise<void> {
	const domtoimage = await import("dom-to-image");

	return domtoimage.DomToImage.toPng(componentRef, { quality: 1 }).then((dataUrl: string) => {
		const link = document.createElement("a");
		link.download = `${fileName}.png`;
		link.href = dataUrl;
		link.click();
	});
}
