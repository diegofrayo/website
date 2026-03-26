import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BlockQuote from "@diegofrayo-features/components/primitive/blockquote";

// --- META ---

const meta: Meta<typeof BlockQuote> = {
	title: "Primitive/BlockQuote",
	component: BlockQuote,
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

export const Default: StoryObj<typeof BlockQuote> = {
	args: {
		children: "This is a blockquote.",
	},
};

export const CustomClass: StoryObj<typeof BlockQuote> = {
	args: {
		children: "Blockquote with custom class.",
		className: "text-lg italic text-zinc-600",
	},
};
