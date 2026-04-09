import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Box from "~/components/primitive/box";

// --- META ---

const meta: Meta<typeof Box> = {
	title: "Primitive/Box",
	component: Box,
	tags: ["autodocs"],
	argTypes: {
		as: {
			control: "select",
			options: ["div", "main", "section", "article", "header", "aside", "footer", "span"],
		},
		children: { control: "text" },
	},
	args: {
		as: "div",
		children: "This is a Box component.",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Box> = {
	args: {
		as: "div",
		children: "This is a Box component.",
	},
};

export const AsSection: StoryObj<typeof Box> = {
	args: {
		as: "section",
		children: "Box rendered as a <section>.",
	},
};

export const AsHeader: StoryObj<typeof Box> = {
	args: {
		as: "header",
		children: "Box rendered as a <header>.",
	},
};
