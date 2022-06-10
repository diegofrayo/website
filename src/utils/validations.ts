import { T_UnknownObject } from "~/types";

export function isNotEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.length > 0;
}

export function isEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.length === 0;
}

// TODO: Think about a better name for this function
export function isNotDefined(input: unknown): input is undefined | null {
  return input === null || input === undefined;
}

export function isUndefined(input: unknown): input is undefined {
  return input === undefined;
}

export function notFound(input: unknown): input is undefined {
  return isUndefined(input);
}

export function exists<G_InputType = unknown>(input: unknown): input is G_InputType {
  return !isNotDefined(input);
}

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

export function isDate(input: unknown): input is Date {
  return input instanceof Date;
}

export function validate<T_Types>(
  input: unknown,
  validators: ((input: unknown) => boolean)[],
): input is T_Types {
  return validators.reduce((result: boolean, fn) => {
    return result && fn(input);
  }, true);
}

// TODO: Review predicates with return different to booleans
// type T_Args = ((input: unknown) => boolean)[];
// type T_ValidateReturn = (...args: T_Args) => boolean;

// export function validate<T_Types>(input: unknown): input is T_Types {
//   const validateReturn = function validateReturn(...args: T_Args) {
//     return args.reduce((result: boolean, fn) => {
//       return result && fn(input);
//     }, true);
//   };

//   return validateReturn;
// }
