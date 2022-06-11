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

export function isEmptyStringOrNotDefined(input: unknown): input is string {
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

// validate a value using multiple functions
export function validate<G_Types>(
  input: unknown,
  validators: ((input: unknown) => boolean)[],
): input is G_Types {
  return validators.reduce((result: boolean, fn) => {
    return result && fn(input);
  }, true);
}

// TODO: Review predicates with return different to booleans
// type T_Args = ((input: unknown) => boolean)[];
// type T_ValidateReturn = (...args: T_Args) => boolean;

// export function validate<G_Types>(input: unknown): input is G_Types {
//   const validateReturn = function validateReturn(...args: T_Args) {
//     return args.reduce((result: boolean, fn) => {
//       return result && fn(input);
//     }, true);
//   };

//   return validateReturn;
// }
