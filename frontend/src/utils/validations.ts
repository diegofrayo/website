/*
 * Libraries examples:
 * - https://github.com/kibertoad/validation-utils
 * - https://npm.io/package/x-utils-es
 */

import { T_Object } from "~/types";

// --- Primitives ---

export function isNull(input: unknown): input is null {
	return input === null;
}

export function isArray<G_ItemsType>(input: unknown): input is G_ItemsType[] {
	return Array.isArray(input);
}

export function isArrayOf<G_ItemsType>(input: unknown, type: "string"): input is G_ItemsType[] {
	return Array.isArray(input) && input.every((item) => typeof item === type);
}

export function isUndefined(input: unknown): input is undefined {
	return input === undefined;
}

export function isObject(input: unknown): input is T_Object {
	if (!input || Array.isArray(input)) return false;
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

export function isNotUndefined(input: unknown): boolean {
	return input !== undefined;
}

export function isFalsy(input: unknown): boolean {
	return !input;
}

export function isNotEquals(input1: unknown, input2: unknown): boolean {
	return input1 !== input2;
}

export function isEquals(input1: unknown, input2: unknown): boolean {
	return input1 === input2;
}

// --- Strings ---

export function isEmptyString(input: unknown): boolean {
	return typeof input === "string" && input.length === 0;
}

export function isNotEmptyString(input: unknown): input is string {
	return typeof input === "string" && input.length > 0;
}

// --- Numbers ---

export function isBetween(input: number, range: [number, number]): boolean {
	return input >= range[0] && input <= range[1];
}

// --- Arrays ---

export function isNotEmptyArray(input: unknown): input is unknown[] {
	return Array.isArray(input) && input.length > 0;
}

export function isEmptyArray(input: unknown): boolean {
	return Array.isArray(input) && input.length === 0;
}

// --- Semantic ---

export function notFound(input: unknown): input is undefined {
	return input === undefined;
}

export function exists(input: unknown): boolean {
	return input !== undefined;
}

// --- DOM ---

export function isDOMNode(element: unknown): element is Node {
	return "nodeType" in (isObject(element) ? element : {});
}