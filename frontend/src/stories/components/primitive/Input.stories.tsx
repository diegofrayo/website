// @ts-nocheck

import * as React from "react";

import Input from "~/components/primitive/Input";
import type { T_ReactElement } from "~/types";

export default {
	title: "primitive/Input",
	component: Input,
	argTypes: {},
};

// --- Stories ---

export const WithLabel = (): T_ReactElement => {
	const [inputValue, setInputValue] = React.useState("I have a label");

	return (
		<Input
			value={inputValue}
			label="Label"
			id="WithLabel"
			onChange={(e) => setInputValue(e.currentTarget.value)}
		/>
	);
};

export const WithoutLabel = (): T_ReactElement => {
	const [inputValue, setInputValue] = React.useState("");

	return (
		<Input
			value={inputValue}
			placeholder="I'm a placeholder"
			containerProps={{ className: "dfr-bg-color-primary tw-p-4" }}
			id="WithoutLabel"
			onChange={(e) => setInputValue(e.currentTarget.value)}
		/>
	);
};
