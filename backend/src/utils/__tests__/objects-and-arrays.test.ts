import { expect, test, describe } from "@jest/globals";

import v from "~/lib/validator";
import { getByKey, getEntries } from "~/utils/objects-and-arrays";
import { toStringInput, T_GetFunctionArguments, T_TestCase } from "~/test";
import type { T_Object } from "~/types";

const getEntriesTestCase = {
	functionName: "getEntries",
	fn: getEntries,
	cases: [
		{
			input: { name: "Diego", age: 30 },
			expected: [
				["name", "Diego"],
				["age", 30],
			],
		},
		{
			input: {},
			expected: [],
		},
	],
};

describe(`testing "${getEntriesTestCase.functionName}" function`, () => {
	getEntriesTestCase.cases.forEach((item) => {
		test(`with "${toStringInput(item.input)}" input`, () => {
			expect(getEntries(item.input)).toEqual(item.expected);
		});
	});
});

const getByKeyTestCase: T_TestCase<
	T_GetFunctionArguments<typeof getByKey>,
	ReturnType<typeof getByKey>
> = {
	functionName: "getByKey",
	fn: getByKey,
	cases: [
		{
			input: [{ name: "Diego", age: 30 }, "age"],
			expected: 30,
		},
		{
			input: [{ name: "Diego", age: 30 }, "notDefined"],
			expected: (input: T_GetFunctionArguments<typeof getByKey>): void => {
				try {
					getByKeyTestCase.fn(...input);
				} catch (error) {
					expect((error as T_Object)["message"]).toEqual(
						`${input[1]} does not exist in the passed object`,
					);
				}
			},
		},
	],
};

describe(`testing "${getByKeyTestCase.functionName}" function`, () => {
	getByKeyTestCase.cases.forEach((item) => {
		test(`with "${toStringInput(item.input)}" input`, () => {
			if (v.isFunction(item.expected)) {
				item.expected(item.input);
			} else {
				expect(getByKeyTestCase.fn(...item.input)).toEqual(item.expected);
			}
		});
	});
});
