import { toast } from "react-toastify";

import { T_SiteTexts, T_HTMLElement } from "~/types";

import { getSiteTexts } from "./internationalization";

export function getScrollPosition(element?: T_HTMLElement | null): number {
  return element?.scrollTop || document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number): void {
  window.scroll({ top: val, behavior: "smooth" });
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
  event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
): Promise<void> {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard not supported");

    const clipboardText = event.currentTarget.getAttribute("data-clipboard-text") || "";
    if (!clipboardText) throw new Error("Any text was selected to copy");
    await navigator.clipboard.writeText(clipboardText);

    const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
    toast.success(SiteTexts.layout.current_locale.misc.copy_to_clipboard, {
      position: toast.POSITION.BOTTOM_CENTER,
      toastId: "copy-to-clipboard",
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

export function detectEmojisSupport(): void {
  try {
    const pixelRatio: number = window.devicePixelRatio || 1;
    const offset: number = 12 * pixelRatio;
    const node = <HTMLCanvasElement>window.document.createElement("canvas");
    const ctx: CanvasRenderingContext2D | null = node.getContext("2d");

    if (!ctx) {
      throw new Error();
    }

    ctx.fillStyle = "#f00";
    ctx.textBaseline = "top";
    ctx.font = "32px Arial";
    ctx.fillText("\ud83d\udc28", 0, 0); // U+1F428 KOALA

    if (ctx.getImageData(offset, offset, 1, 1).data[0] === 0) {
      throw new Error();
    }

    if (isAndroid() && getAndroidVersion() < 5) {
      throw new Error();
    }
  } catch (error) {
    console.error("Emojis not supported");
    console.error(error);
    document.body.classList.add("no-emojis");
  }
}

export function focusElement(element: T_HTMLElement): void {
  element.focus();
  element.click();
}

export function isSmallScreen(): boolean {
  return getScreenSize() === "XS";
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
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

// --- Private functions ---

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
