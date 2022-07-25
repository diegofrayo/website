/*
 * Libraries examples:
 * - https://github.com/kibertoad/validation-utils
 * - https://npm.io/package/x-utils-es
 */

import { T_ReactEventTarget, T_UnknownObject } from "~/types";

// --- Primitives ---

export function isNull(input: unknown): input is null {
	return input === null;
}

export function isUndefined(input: unknown): input is undefined {
	return input === undefined;
}

export function isNotUndefined(input: unknown): boolean {
	return !isUndefined(input);
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

// --- Generics ---

export function isTrue(input: unknown): input is boolean {
	return input === true;
}

export function isNotTrue(input: unknown): input is boolean {
	return input === false;
}

export function isFalsy(input: unknown): boolean {
	return !input;
}

export function isTruthy(input: unknown): boolean {
	return !isFalsy(input);
}

export function isNotEquals(input1: unknown, input2: unknown): boolean {
	return input1 !== input2;
}

export function isEquals(input1: unknown, input2: unknown): boolean {
	return input1 === input2;
}

// --- Strings ---

export function isEmptyString(input: unknown): input is string {
	return typeof input === "string" && input.length === 0;
}

export function isNotEmptyString(input: unknown): input is string {
	return typeof input === "string" && input.length > 0;
}

// --- DOM ---

export function isDOMNode(element: T_ReactEventTarget | null): element is Node {
	return "nodeType" in (element || {});
}
