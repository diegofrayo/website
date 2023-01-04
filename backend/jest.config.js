/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/?(*.)+(test).ts"],
	moduleDirectories: ["node_modules"],
	modulePathIgnorePatterns: ["<rootDir>/src/_framework", "<rootDir>/dist"],
	moduleNameMapper: {
		"~/(.*)": "<rootDir>/src/$1",
	},
};
