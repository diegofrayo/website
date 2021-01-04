import { isBrowser } from "./browser";

export function createArray(length: number): number[] {
  return Array.from(Array(length).keys()).map(value => value + 1);
}

export function createQueryFromObject(
  object: Record<string, string | number | boolean>,
): string {
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

export function delay(time: number): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export function isDevelopmentEnvironment(url?: string): boolean {
  return !(isBrowser()
    ? window.location.href
    : url || process.env.NEXT_PUBLIC_WEBSITE_URL || ""
  ).includes("vercel.app");
}

export function isUserLoggedIn(): boolean {
  let isLoggedIn: boolean = isDevelopmentEnvironment();

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
