import { isBrowser } from "./browser";

export function createArray(length: number, start?: number): number[] {
  return Array.from(Array(length).keys()).map(value => value + (start === undefined ? 1 : start));
}

export function createQueryFromObject(object: Record<string, string | number | boolean>): string {
  const result = Object.entries(object)
    .map(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        return "";
      }

      return `${key}=${encodeURIComponent(String(value))}`;
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

export function sortBy(
  params?: { param: string; order?: "asc" | "desc" }[],
  order?: "asc" | "desc",
) {
  return function sortByReturn(a, b): number {
    let paramsFinal = params;

    if (!paramsFinal) {
      paramsFinal = [{ param: "", order: order || "asc" }];
    }

    return paramsFinal.reduce(
      (result, { param, order }) => {
        if (result.finish) return result;

        const greater = order === "desc" ? -1 : 1;
        const smaller = order === "desc" ? 1 : -1;

        const aParam = param ? a[param] : a;
        const bParam = param ? b[param] : b;

        if (aParam > bParam) {
          return { result: greater, finish: true };
        }

        if (aParam < bParam) {
          return { result: smaller, finish: true };
        }

        return result;
      },
      { result: 0, finish: false },
    ).result;
  };
}

export function safeCastNumber(string: string, defaultNumber?: number) {
  const number = Number(string);

  if (Number.isNaN(number)) {
    return Number.isInteger(defaultNumber) ? defaultNumber : 0;
  }

  return number;
}

export function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
