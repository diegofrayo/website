import { toast } from "react-toastify";

import { I18nService } from "~/i18n";
import type { T_OnClickEvent } from "~/types";

export function getScrollPosition(element?: HTMLElement | null): number {
  return element?.scrollTop || document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number): void {
  window.scroll({ top: val, behavior: "smooth" });
}

export function scrollToElement(element: HTMLElement | null): void {
  element?.scrollIntoView({
    behavior: "smooth",
  });
}

type T_OnScrollStoppedListenerParams = {
  onScroll: () => void;
  onScrollStopped: () => void;
  timeout: number;
};

export function onScrollStoppedListener({
  onScroll,
  onScrollStopped,
  timeout,
}: T_OnScrollStoppedListenerParams): void {
  let isScrolling: number;

  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(isScrolling);

      onScroll();

      isScrolling = window.setTimeout(() => {
        onScrollStopped();
      }, timeout);
    },
    false,
  );
}

export async function copyToClipboard(
  event: T_OnClickEvent<HTMLDivElement | HTMLButtonElement>,
  optionalText?: string,
): Promise<void> {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard not supported");

    const clipboardText =
      event.currentTarget.getAttribute("data-clipboard-text") || optionalText || "";
    if (!clipboardText) throw new Error("Any text was selected to copy");
    await navigator.clipboard.writeText(clipboardText);

    const translator = I18nService.getInstance();
    toast.success(translator.t("common:copy_to_clipboard"), {
      position: toast.POSITION.BOTTOM_CENTER,
      toastId: "copy-to-clipboard",
      // autoClose: 5000000, // for debugging
    });
  } catch (error) {
    console.error("Error copying text to the clipboard");
    console.error(error);
    toast.error("Error", {
      position: toast.POSITION.BOTTOM_CENTER,
      toastId: "copy-to-clipboard",
    });
  }
}

export function focusElement(element: HTMLElement): void {
  element.focus();
  element.click();
}

export function isSmallScreen(): boolean {
  return getScreenSize() === "XS";
}

export function isInViewport(element?: HTMLElement | null): boolean {
  if (!element) {
    console.warn("isInViewport element param is invalid");
    return false;
  }

  const bounding = element.getBoundingClientRect();

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export async function downloadComponentAsImage(
  componentRef: HTMLElement | null,
  fileName: string,
): Promise<void> {
  if (!componentRef) return;

  const domtoimage = await import("dom-to-image");

  domtoimage.toPng(componentRef, { quality: 1 }).then((dataUrl) => {
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  });
}

export function isMobileiOS(): boolean {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export function isPWA(): boolean {
  return window.navigator["standalone"] === true;
}

// --- Private functions ---

/*
function getAndroidVersion(): number {
  try {
    const ua: string = navigator.userAgent.toLowerCase();
    const match: RegExpMatchArray | null = ua.match(/android\s([0-9.]*)/);

    if (!match) throw new Error();

    return parseFloat(match[1]);
  } catch (error) {
    console.error(error);
    return -1;
  }
}

function isAndroid(): boolean {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}
*/

function getScreenSize() {
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
