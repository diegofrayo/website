import type { T_Object } from "~/types";

// --- Primitives ---

function isNull(input: unknown): input is null {
	return input === null;
}

function isFunction<G_InputType = Function>(input: unknown): input is G_InputType {
	return isUndefined(input) === false && typeof input === "function";
}

function isArray<G_ItemsType>(input: unknown): input is G_ItemsType[] {
	return Array.isArray(input);
}

function isArrayOf<G_ItemsType>(input: unknown, type: "string"): input is G_ItemsType[] {
	return Array.isArray(input) && input.every((item) => typeof item === type);
}

function isUndefined(input: unknown): input is undefined {
	return typeof input === "undefined";
}

function isObject<G_InputType = T_Object>(input: unknown): input is G_InputType {
	if (!input || Array.isArray(input)) return false;
	return typeof input === "object";
}

function isString(input: unknown): input is string {
	return typeof input === "string";
}

function isNumber(input: unknown): input is number {
	return typeof input === "number";
}

function isBoolean(input: unknown): input is boolean {
	return typeof input === "boolean";
}

function isDate(input: unknown): input is Date {
	return input instanceof Date;
}

// --- Generics ---

function isTrue(input: unknown): input is boolean {
	return input === true;
}

function isNotTrue(input: unknown): input is boolean {
	return input === false;
}

function isNotUndefined(input: unknown): boolean {
	return input !== undefined;
}

function isFalsy(input: unknown): boolean {
	return !input;
}

function isNotEquals(input1: unknown, input2: unknown): boolean {
	return input1 !== input2;
}

function isEquals(input1: unknown, input2: unknown): boolean {
	return input1 === input2;
}

// --- Strings ---

function isEmptyString(input: unknown): boolean {
	return typeof input === "string" && input.length === 0;
}

function isNotEmptyString(input: unknown): input is string {
	return typeof input === "string" && input.length > 0;
}

// --- Numbers ---

function isBetween(input: number, range: [number, number]): boolean {
	return input >= range[0] && input <= range[1];
}

// --- Arrays ---

function isNotEmptyArray(input: unknown): input is unknown[] {
	return Array.isArray(input) && input.length > 0;
}

function isEmptyArray(input: unknown): boolean {
	return Array.isArray(input) && input.length === 0;
}

// --- Objects ---

function isEmptyObject(input: unknown): input is object {
	return (
		!!input && Object.keys(input).length === 0 && Object.getPrototypeOf(input) === Object.prototype
	);
}

function isNotEmptyObject(input: unknown): input is object {
	return isEmptyObject(input) === false;
}

// --- Semantic ---

function notFound(input: unknown): input is undefined {
	return input === undefined;
}

function exists(input: unknown): boolean {
	return input !== undefined;
}

// --- Values ---

function isEmail(email: unknown): email is string {
	return (
		String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			) !== null
	);
}

// --- DOM ---

const v = {
	isNull,
	isFunction,
	isArray,
	isArrayOf,
	isUndefined,
	isString,
	isNumber,
	isBoolean,
	isDate,
	isObject,

	isTrue,
	isNotTrue,
	isNotUndefined,
	isFalsy,
	isNotEquals,
	isEquals,

	isEmptyString,
	isNotEmptyString,

	isBetween,

	isNotEmptyArray,
	isEmptyArray,

	isEmptyObject,
	isNotEmptyObject,

	notFound,
	exists,

	isEmail,
};

export default v;
