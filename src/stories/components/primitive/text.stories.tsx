import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Text from "~/components/primitive/text";

// --- META ---

const meta: Meta<typeof Text> = {
	title: "Primitive/Text",
	component: Text,
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		children: "This is a Text component.",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Text> = {
	args: {
		children: "This is a Text component.",
	},
};

export const CustomClass: StoryObj<typeof Text> = {
	args: {
		children: "Text with custom class.",
		className: "text-lg text-blue-600",
	},
};
