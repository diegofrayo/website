import { WEBSITE_METADATA } from "~/data/metadata";

export function createArray(length: number): Array<number> {
  return Array.from(Array(length).keys()).map(value => value + 1);
}

export function createQueryFromObject(object: Record<string, string>): string {
  const result = Object.entries(object)
    .map(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        return "";
      }

      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  return result;
}

export function slugify(str: string): string {
  let result = str.replace(/^\s+|\s+$/g, "").toLowerCase();

  // remove accents, swap ñ for n, etc
  const FROM = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const TO = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = FROM.length; i < l; i += 1) {
    result = result.replace(new RegExp(FROM.charAt(i), "g"), TO.charAt(i));
  }

  result = result
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return result;
}

export function toUpperCaseObjectProperty(url: string): string {
  return url.toUpperCase().replace(/-+/g, "_");
}

export function toLowerCaseObjectProperty(url: string): string {
  return url.toLowerCase().replace(/-+/g, "_");
}

export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(item => (item ? item[0].toUpperCase() + item.substring(1) : ""))
    .join(" ")
    .trim();
}

export function isDevelopmentEnvironment(): boolean {
  return !WEBSITE_METADATA.url.includes("vercel.app");
}

export function removeEmojiFromTitle(str: string): string {
  return str.split(" ").slice(1).join(" ").trim();
}

export function setScrollPosition(val: number): void {
  /*
  document.getElementById("__next").scrollTop = val;
  document.documentElement.scrollTop = val;
  document.body.scrollTop = val;
  */

  window.scroll({ top: val, behavior: "smooth" });
}

export function getScrollPosition(): number {
  return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function onScrollStoppedListener({
  onScroll,
  onScrollStopped,
  timeout,
}: Record<string, any>): void {
  let isScrolling;

  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(isScrolling);

      onScroll();

      isScrolling = setTimeout(() => {
        onScrollStopped();
      }, timeout);
    },
    false,
  );
}

export async function copyToClipboard(
  e?: Record<string, any>,
  text?: string,
): Promise<any> {
  try {
    if (!e && !text) throw new Error("Invalid params");
    if (!navigator.clipboard) throw new Error("Clipboard not supported");

    let clipboardText = "";
    if (e) {
      const { currentTarget: element } = e;
      clipboardText = element.getAttribute("data-clipboard-text");
    } else if (text) {
      clipboardText = text;
    }

    navigator.clipboard.writeText(clipboardText).then(
      () => {
        console.log("Copying to clipboard was successful");
      },
      err => {
        console.error("Could not copy text:", err);
      },
    );
  } catch (e) {
    console.error(e);
  }
}

export function delay(time: number): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export function detectEmojisSupport(): void {
  try {
    const pixelRatio = window.devicePixelRatio || 1;
    const offset = 12 * pixelRatio;
    const node = window.document.createElement("canvas");
    const ctx = node.getContext("2d");

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
    document.documentElement.classList.add("no-emojis");
  }
}

export function isAndroid(): boolean {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

export function getAndroidVersion(): number {
  try {
    const ua = navigator.userAgent.toLowerCase();
    const match = ua.match(/android\s([0-9\.]*)/);

    if (!match) throw new Error();

    return parseFloat(match[1]);
  } catch (error) {
    return -1;
  }
}

export function isUserLoggedIn(): boolean {
  let isLoggedIn = isDevelopmentEnvironment();

  if (isBrowser()) {
    isLoggedIn =
      window.location.href.includes("login=true") ||
      window.localStorage.getItem("login") === "true" ||
      isLoggedIn;

    if (isLoggedIn) {
      window.localStorage.setItem("login", "true");
    } else {
      window.localStorage.setItem("login", "false");
    }
  }

  return isLoggedIn;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
