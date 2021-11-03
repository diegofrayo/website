import { T_Object, T_Primitive } from "~/types";

import { convertSnakeCaseToLowerCamelCase } from "./strings";

export function createArray(length: number, start?: number): number[] {
  return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

export function createQueryFromObject(object: T_Object<string | number | boolean>): string {
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

export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function isDevelopmentEnvironment(url?: string): boolean {
  return (
    (isBrowser()
      ? window.location.href
      : url || process.env.NEXT_PUBLIC_WEBSITE_URL || ""
    ).includes("vercel.app") === false
  );
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return !isBrowser();
}

export function getRandomItem<T_ItemType>(array: T_ItemType[]): T_ItemType {
  return array[between(0, array.length - 1)];
}

export function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function betweenUntil(min: number, max: number, exclude: number[]): number {
  const randomNumber = between(min, max);

  if (exclude.includes(randomNumber)) {
    return betweenUntil(min, max, exclude);
  }

  return randomNumber;
}

export function sortBy(
  params?: { param: string; order?: "asc" | "desc" }[],
  order?: "asc" | "desc",
) {
  return function sortByReturn(a: T_Object | T_Primitive, b: T_Object | T_Primitive): number {
    let paramsFinal = params;

    if (!paramsFinal) {
      paramsFinal = [{ param: "", order: order || "asc" }];
    }

    return paramsFinal.reduce(
      (result, { param, order }) => {
        if (result.finish) return result;

        const greater = order === "desc" ? -1 : 1;
        const smaller = order === "desc" ? 1 : -1;

        const aParam = param ? (a as T_Object)[param] : a;
        const bParam = param ? (b as T_Object)[param] : b;

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

export function safeCastNumber(string: string, defaultNumber = 0): number {
  const number = Number(string);

  if (Number.isNaN(number)) {
    return defaultNumber;
  }

  return number;
}

export function isPrimitiveValue(value: T_Primitive | T_Object): boolean {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  );
}

export function transformObjectKeysFromSnakeCaseToLowerCamelCase(
  object: T_Object | T_Primitive,
): T_Object | T_Primitive {
  if (isPrimitiveValue(object)) return object;

  return Object.entries(object as T_Object).reduce((result, [key, value]) => {
    const transformedKey = convertSnakeCaseToLowerCamelCase(key);

    if (isPrimitiveValue(value)) {
      result[transformedKey] = value;
    } else if (Array.isArray(value)) {
      result[transformedKey] = value.map(transformObjectKeysFromSnakeCaseToLowerCamelCase);
    } else if (typeof value === "object") {
      result[transformedKey] = transformObjectKeysFromSnakeCaseToLowerCamelCase(value);
    }

    return result;
  }, {});
}

// TODO: TS: Type this function using generics
export function mirror(elements: string[]): T_Object<string> {
  return elements.reduce((result, element) => {
    return { ...result, [element]: element };
  }, {});
}
