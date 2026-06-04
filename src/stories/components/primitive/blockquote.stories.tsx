import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Blockquote from "~/components/primitive/blockquote";

// --- META ---

const meta: Meta<typeof Blockquote> = {
	title: "Primitive/Blockquote",
	component: Blockquote,
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		children: "This is a blockquote.",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Blockquote> = {
	args: {
		children: "This is a blockquote.",
	},
};

export const CustomClass: StoryObj<typeof Blockquote> = {
	args: {
		children: "Blockquote with custom class.",
		className: "text-lg italic text-zinc-600",
	},
};
