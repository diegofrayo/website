export function getScrollPosition(): number {
  return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function setScrollPosition(val: number): void {
  /*
  document.getElementById("__next").scrollTop = val;
  document.documentElement.scrollTop = val;
  document.body.scrollTop = val;
  */

  window.scroll({ top: val, behavior: "smooth" });
}

type TypeOnScrollStoppedListenerParams = {
  onScroll: () => void;
  onScrollStopped: () => void;
  timeout: number;
};

export function onScrollStoppedListener({
  onScroll,
  onScrollStopped,
  timeout,
}: TypeOnScrollStoppedListenerParams): void {
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

// TODO: Set event type
export function copyToClipboard(event?: any, textToCopy?: string): void {
  try {
    if (!event && !textToCopy) throw new Error("Invalid params");
    if (!navigator.clipboard) throw new Error("Clipboard not supported");

    let clipboardText = "";
    if (event) {
      const { currentTarget: element } = event;
      clipboardText = element.getAttribute("data-clipboard-text") || "";
    } else if (textToCopy) {
      clipboardText = textToCopy;
    }

    if (!clipboardText) throw new Error("Any text was selected to copy");

    navigator.clipboard.writeText(clipboardText);
  } catch (e) {
    console.error(e);
  }
}

export function detectEmojisSupport(): void {
  try {
    const pixelRatio: number = window.devicePixelRatio || 1;
    const offset: number = 12 * pixelRatio;
    const node = window.document.createElement("canvas"); // TODO: Set type
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
  } catch (e) {
    document.body.classList.add("no-emojis");
  }
}

export function getAndroidVersion(): number {
  try {
    const ua: string = navigator.userAgent.toLowerCase();
    const match: RegExpMatchArray | null = ua.match(/android\s([0-9\.]*)/);

    if (!match) throw new Error();

    return parseFloat(match[1]);
  } catch (e) {
    console.error(e);
    return -1;
  }
}

export function isAndroid(): boolean {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
