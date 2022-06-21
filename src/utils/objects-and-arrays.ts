import type { T_UnknownObject, T_Primitive } from "~/types";

import { logger } from "./app";
import { or } from "./fp";
import { between } from "./numbers";
import {
  isBoolean,
  isDate,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "./validations";

export function transformObjectKeysFromSnakeCaseToLowerCamelCase<G_Result = T_UnknownObject>(
  object: T_UnknownObject,
): G_Result {
  return transformObjectKeysFromSnakeCaseToLowerCamelCasePrivate(object) as G_Result;
}

export function mirror<G_Variant extends string>(
  elements: readonly G_Variant[],
): Record<G_Variant, G_Variant> {
  return elements.reduce(
    (result, element) => ({ ...result, [element]: element }),
    {} as Record<G_Variant, G_Variant>,
  );
}

export function createArray(length: number, start?: number): number[] {
  return Array.from(Array(length).keys()).map((value) => value + (start === undefined ? 1 : start));
}

type T_Order = "asc" | "desc";
type T_Criteria = { param: string; order: T_Order };
type T_SorterFunction = (a: T_UnknownObject, b: T_UnknownObject) => number;

export function sortBy(criteria: T_Criteria[]): T_SorterFunction {
  const sortByReturn: T_SorterFunction = function sortByReturn(a, b) {
    return criteria.reduce(
      (result, { param, order }: T_Criteria) => {
        if (result.finish) {
          return result;
        }

        const greater = order === "desc" ? -1 : 1;
        const smaller = order === "desc" ? 1 : -1;
        const aParam = a[param];
        const bParam = b[param];

        if (
          or<string | number | Date>(aParam, [isString, isNumber, isDate]) &&
          or<string | number | Date>(bParam, [isString, isNumber, isDate])
        ) {
          if (aParam > bParam) {
            return { result: greater, finish: true };
          }

          if (aParam < bParam) {
            return { result: smaller, finish: true };
          }

          return result;
        }

        logger("WARN", "Invalid elements types for comparison", a, b);

        return result;
      },
      { result: 0, finish: false },
    ).result;
  };

  return sortByReturn;
}

export function getRandomItem<G_ItemType>(array: G_ItemType[]): G_ItemType {
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
  return or(value, [isUndefined, isNumber, isNull, isString, isBoolean]);
}

function transformObjectKeysFromSnakeCaseToLowerCamelCasePrivate(
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
