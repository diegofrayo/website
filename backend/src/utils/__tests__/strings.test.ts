import { expect, test, describe } from "@jest/globals";

import { generateSlug, replaceAll } from "~/utils/strings";
import { toStringInput, T_GetFunctionArguments, T_TestCase } from "~/test";

const generateSlugTestCase: T_TestCase<
	T_GetFunctionArguments<typeof generateSlug>,
	ReturnType<typeof generateSlug>
> = {
	functionName: "generateSlug",
	fn: generateSlug,
	cases: [
		{
			input: ["Dkd 1323 ^&(^&*&^%$#) 23442 fsdf"],
			expected: "dkd-1323-23442-fsdf",
		},
		{
			input: ["   "],
			expected: "",
		},
		{
			input: ["_4 56A"],
			expected: "-4-56a",
		},
	],
};

describe(`testing "${generateSlugTestCase.functionName}" function`, () => {
	generateSlugTestCase.cases.forEach((item) => {
		test(`with "${toStringInput(item.input)}" input`, () => {
			expect(generateSlugTestCase.fn(...item.input)).toBe(item.expected);
		});
	});
});

const replaceAllTestCase: T_TestCase<
	T_GetFunctionArguments<typeof replaceAll>,
	ReturnType<typeof replaceAll>
> = {
	functionName: "replaceAll",
	fn: replaceAll,
	cases: [{ input: ["test test TEST", "test", "-"], expected: "- - TEST" }],
};

describe(`testing "${replaceAllTestCase.functionName}" function`, () => {
	replaceAllTestCase.cases.forEach((item) => {
		test(`with "${toStringInput(item.input)}" input`, () => {
			expect(replaceAllTestCase.fn(item.input[0], item.input[1], item.input[2])).toBe(
				item.expected,
			);
		});
	});
});