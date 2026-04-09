import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BoxWithTitle from "~/components/common/box-with-title";

// --- META ---

const meta: Meta<typeof BoxWithTitle> = {
	title: "Shared/BoxWithTitle",
	component: BoxWithTitle,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		title: "Box Title",
		children: "This is the content inside the box.",
		className: "w-64 p-4 bg-green-200",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof BoxWithTitle> = {};
