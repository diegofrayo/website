import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import List from "~/components/primitive/list";

// --- META ---

const meta: Meta<typeof List> = {
	title: "Primitive/List",
	component: List,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: Object.values(List.variant),
		},
		className: { control: "text" },
		children: { control: "object" },
	},
	args: {
		variant: "UNSTYLED",
		className: "",
		children: [
			<List.Item key="1">Item 1</List.Item>,
			<List.Item key="2">Item 2</List.Item>,
			<List.Item key="3">Item 3</List.Item>,
		],
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof List> = {
	args: {
		variant: "UNSTYLED",
	},
};

export const Simple: StoryObj<typeof List> = {
	args: {
		variant: "SIMPLE",
	},
};
