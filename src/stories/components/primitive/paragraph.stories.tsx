import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Paragraph from "~/components/primitive/paragraph";

// --- META ---

const meta: Meta<typeof Paragraph> = {
	title: "Primitive/Paragraph",
	component: Paragraph,
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		children: "This is a Paragraph component.",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Paragraph> = {
	args: {
		children: "This is a Paragraph component.",
	},
};

export const CustomClass: StoryObj<typeof Paragraph> = {
	args: {
		children: "Text with custom class.",
		className: "text-lg text-blue-600",
	},
};
