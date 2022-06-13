import { T_UnknownObject } from "~/types";

// --- Primitives ---

export function isNull(input: unknown): input is null {
  return input === null;
}

export function isObject(input: unknown): input is T_UnknownObject {
  return typeof input === "object";
}

export function isString(input: unknown): input is string {
  return typeof input === "string";
}

export function isNumber(input: unknown): input is number {
  return typeof input === "number";
}

export function isBoolean(input: unknown): input is boolean {
  return typeof input === "boolean";
}

export function isDate(input: unknown): input is Date {
  return input instanceof Date;
}

// --- Strings ---

export function isEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.length === 0;
}

export function isNotEmptyString(input: unknown): input is string {
  return !isEmptyString(input);
}

export function isFilledString(input: unknown): input is string {
  return typeof input === "string" && input.length > 0;
}

export function isEmptyOrNotDefinedString(input: unknown): input is string {
  return isEmptyString(input) || isNotDefined(input);
}

// --- Null & Undefined ---

// TODO: Think about a better name for this function
export function isNotDefined(input: unknown): input is undefined | null {
  return input === null || input === undefined;
}

export function isUndefined(input: unknown): input is undefined {
  return input === undefined;
}

export function isNotUndefined(input: unknown): input is typeof input {
  return !isUndefined(input);
}

export function isDefined(input: unknown): input is typeof input {
  return !isUndefined(input);
}

// --- Utilities ---

// easy to use
export function isNotTrue(input: boolean): input is boolean {
  return input === false;
}

// use after .find statement
export function notFound(input: unknown): input is undefined {
  return isUndefined(input);
}

// check if a property exists inside an object
export function exists<G_InputType = unknown>(input: unknown): input is G_InputType {
  return !isNotDefined(input);
}

// check if a property not exists inside an object
export function notExists(input: unknown): input is undefined {
  return isUndefined(input);
}
