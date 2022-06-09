import type { T_UnknownObject } from "~/types";

import { between } from "./numbers";
import { isDate, isNumber, isObject, isString, validate } from "./validations";

export function transformObjectKeysFromSnakeCaseToLowerCamelCase(
  object: T_UnknownObject | T_Primitive,
): T_UnknownObject | T_Primitive {
  if (isPrimitiveValue(object)) {
    return object;
  }

  return Object.entries(object).reduce((result, [key, value]) => {
    const transformedKey = convertSnakeCaseToLowerCamelCase(key);

    if (isPrimitiveValue(value)) {
      return {
        ...result,
        [transformedKey]: value,
      };
    }

    if (Array.isArray(value)) {
      return {
        ...result,
        [transformedKey]: value.map(transformObjectKeysFromSnakeCaseToLowerCamelCase),
      };
    }

    if (isObject(value)) {
      return {
        ...result,
        [transformedKey]: transformObjectKeysFromSnakeCaseToLowerCamelCase(value),
      };
    }

    return result;
  }, {} as T_UnknownObject);
}

export function mirror<T_Variant extends string>(
  elements: readonly T_Variant[],
): Record<T_Variant, T_Variant> {
  return elements.reduce(
    (result, element) => ({ ...result, [element]: element }),
    {} as Record<T_Variant, T_Variant>,
  );
}

export function createArray(length: number, start?: number): number[] {
  return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

type T_Order = "asc" | "desc";
type T_Criteria = { param: string; order?: T_Order };
type T_SorterFunction = (a: unknown, b: unknown) => number;

// TODO: Review this function params
export function sortBy(criteria?: T_Criteria[], order?: T_Order): T_SorterFunction {
  const sortByReturn: T_SorterFunction = function sortByReturn(a, b) {
    return (criteria || [{ param: "", order: order || "asc" }]).reduce(
      (result, { param, order: order2 }: T_Criteria) => {
        if (result.finish) return result;

        const greater = order2 === "desc" ? -1 : 1;
        const smaller = order2 === "desc" ? 1 : -1;

        const aParam = param ? (a as T_UnknownObject)[param] : a;
        const bParam = param ? (b as T_UnknownObject)[param] : b;

        if (
          validate<string | number | Date>(aParam, [isString, isNumber, isDate]) &&
          validate<string | number | Date>(bParam, [isString, isNumber, isDate])
        ) {
          if (aParam > bParam) {
            return { result: greater, finish: true };
          }

          if (aParam < bParam) {
            return { result: smaller, finish: true };
          }
        } else {
          throw new Error("Review this please");
        }

        return result;
      },
      { result: 0, finish: false },
    ).result;
  };

  return sortByReturn;
}

export function getRandomItem<T_ItemType>(array: T_ItemType[]): T_ItemType {
  return array[between(0, array.length - 1)];
}

// --- Private ---

function convertSnakeCaseToLowerCamelCase(str: string): string {
  return str
    .split("_")
    .map((item: string, index: number) =>
      index === 0 ? item : item[0].toUpperCase() + item.substring(1),
    )
    .join("")
    .trim();
}

function isPrimitiveValue(value: unknown): value is T_Primitive {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  );
}

// --- Types ---

type T_Primitive = string | number | boolean | undefined | null;
